import os
import shutil
import json
from ftplib import FTP

# ---------------- CONFIG ----------------
MID_FOLDER = r"C:\e-cde\MID"
CONFIG_FILE = os.path.join(MID_FOLDER, "config.json")
LFP_FOLDER = os.path.join(MID_FOLDER, "LFP")
VPS_FTP_HOST = "51.77.140.39"
VPS_FTP_USER = "ftpuser"
VPS_FTP_PASS = "instance"

# ---------------- UTILS ----------------
def ensure_dirs(*dirs):
    for d in dirs:
        if not os.path.exists(d):
            os.makedirs(d)

def load_json(path):
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}

def save_json(path, data):
    ensure_dirs(os.path.dirname(path))
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

def compare_and_clean(client_folder, lfp_folder):
    """Supprime dans client_folder les fichiers identiques au LFP"""
    if not os.path.exists(lfp_folder):
        return
    for root, _, files in os.walk(lfp_folder):
        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), lfp_folder)
            client_file = os.path.join(client_folder, rel_path)
            lfp_file = os.path.join(root, file)
            if os.path.exists(client_file) and os.path.getsize(client_file) == os.path.getsize(lfp_file):
                os.remove(client_file)

def copy_to_lfp_and_local(src_folder, client_folder, lfp_folder):
    """Copie tous les fichiers de src_folder vers client et LFP"""
    for root, _, files in os.walk(src_folder):
        for file in files:
            rel_path = os.path.relpath(root, src_folder)
            dest_client = os.path.join(client_folder, rel_path)
            dest_lfp = os.path.join(lfp_folder, rel_path)
            ensure_dirs(dest_client, dest_lfp)
            shutil.copy2(os.path.join(root, file), dest_client)
            shutil.copy2(os.path.join(root, file), dest_lfp)

def ftp_download(ftp, remote_path, local_path):
    """Télécharge récursivement un dossier FTP"""
    ensure_dirs(local_path)
    try:
        ftp.cwd(remote_path)
        items = ftp.nlst()
        for item in items:
            item_remote = f"{remote_path}/{item}"
            local_item = os.path.join(local_path, item)
            try:
                ftp.cwd(item)  # si dossier
                ftp_download(ftp, item_remote, local_item)
                ftp.cwd("..")
            except:
                with open(local_item, "wb") as f:
                    ftp.retrbinary(f"RETR {item}", f.write)
    except Exception as e:
        print(f"Erreur FTP: impossible d'accéder au répertoire {remote_path}")

# ---------------- CONFIG CLIENT ----------------
def setup_config():
    config = {}
    print("Définir les dossiers locaux :")
    config['mods'] = input("Chemin dossier mods : ").strip()
    config['shaderpacks'] = input("Chemin dossier shaderpacks : ").strip()
    config['resourcepacks'] = input("Chemin dossier resourcepacks : ").strip()
    config['LFP'] = LFP_FOLDER
    ensure_dirs(config['mods'], config['shaderpacks'], config['resourcepacks'], LFP_FOLDER)
    save_json(CONFIG_FILE, config)
    return config

def load_config():
    cfg = load_json(CONFIG_FILE)
    if not cfg:
        cfg = setup_config()
    return cfg

# ---------------- VERSION ----------------
def load_version(path):
    return load_json(path) if os.path.exists(path) else {}

def is_update_needed(local_v_path, remote_v_path):
    local_v = load_version(local_v_path)
    remote_v = load_version(remote_v_path)
    if not local_v:
        return True
    if 'base' in remote_v and remote_v['base'] != local_v.get('base'):
        return True
    for srv, ver in remote_v.get('servers', {}).items():
        if local_v.get('servers', {}).get(srv) != ver:
            return True
    return False

# ---------------- MENU ----------------
def main_menu():
    print("\n--- Gestionnaire MID ---")
    print("[1] Installer / Réinstaller Base")
    print("[2] Supprimer Base")
    print("[3] Mettre à jour Base")
    print("[4] Installer Instance Serveur")
    print("[5] Supprimer Instance Serveur")
    print("[6] Mettre à jour Instance Serveur")
    print("[0] Quitter")
    return input("Choix : ").strip()

# ---------------- ACTIONS ----------------
def handle_server_dat(dest_folder):
    server_dat = os.path.join(dest_folder, "server.dat")
    if os.path.exists(server_dat):
        print("Le fichier server.dat existe déjà ! (déconseillé de remplacer)")
        choix = input("Voulez-vous remplacer ? (O/N) : ").strip().lower()
        if choix != "o":
            return False
    return True

def install_instance_from_ftp(ftp_path, client_folders, instance_name="Base"):
    with FTP(VPS_FTP_HOST) as ftp:
        ftp.login(VPS_FTP_USER, VPS_FTP_PASS)
        tmp_local = os.path.join(LFP_FOLDER, "tmp_download")
        if os.path.exists(tmp_local):
            shutil.rmtree(tmp_local)
        ensure_dirs(tmp_local)

        # Télécharger v.json séparément
        local_v_tmp = os.path.join(tmp_local, "v.json")
        try:
            with open(local_v_tmp, "wb") as f:
                ftp.retrbinary(f"RETR {ftp_path}/v.json", f.write)
        except:
            print("v.json distant introuvable, installation forcée.")

        local_v_file = os.path.join(LFP_FOLDER, instance_name, "v.json")
        if os.path.exists(local_v_tmp):
            if not is_update_needed(local_v_file, local_v_tmp):
                print(f"{instance_name} est déjà à jour.")
                shutil.rmtree(tmp_local)
                return

        # Télécharger chaque sous-dossier
        for key in client_folders.keys():
            remote_sub = f"{ftp_path}/{key}"
            local_sub = os.path.join(tmp_local, key)
            ftp_download(ftp, remote_sub, local_sub)

    # Copier dans les dossiers locaux et LFP
    for key, folder in client_folders.items():
        lfp_sub = os.path.join(LFP_FOLDER, instance_name, key.upper())
        compare_and_clean(folder, lfp_sub)
        shutil.rmtree(lfp_sub, ignore_errors=True)
        ensure_dirs(lfp_sub)
        src_sub = os.path.join(tmp_local, key)
        if os.path.exists(src_sub):
            copy_to_lfp_and_local(src_sub, folder, lfp_sub)

    # Copier v.json
    if os.path.exists(local_v_tmp):
        shutil.copy2(local_v_tmp, os.path.join(LFP_FOLDER, instance_name, "v.json"))
        shutil.copy2(local_v_tmp, os.path.join(client_folders['mods'], "v.json"))

    shutil.rmtree(tmp_local)
    print(f"{instance_name} installé / mis à jour avec succès !")

def remove_instance(client_folders, instance_name="Base"):
    for key, folder in client_folders.items():
        lfp_sub = os.path.join(LFP_FOLDER, instance_name, key.upper())
        compare_and_clean(folder, lfp_sub)
        shutil.rmtree(lfp_sub, ignore_errors=True)
    print(f"{instance_name} supprimé !")

# ---------------- PROGRAMME PRINCIPAL ----------------
if __name__ == "__main__":
    ensure_dirs(MID_FOLDER, LFP_FOLDER)
    config = load_config()

    while True:
        choice = main_menu()
        if choice == "0":
            break

        folders = {
            "mods": config['mods'],
            "shaderpacks": config['shaderpacks'],
            "resourcepacks": config['resourcepacks']
        }

        if choice in ["1", "3"]:  # Installer / MAJ Base
            install_instance_from_ftp("/base", folders, "Base")
        elif choice == "2":  # Supprimer Base
            remove_instance(folders, "Base")
        elif choice in ["4", "6"]:  # Installer / MAJ serveur
            server_name = input("Nom de l'instance serveur : ").strip()
            dest_folder = config['mods']
            if handle_server_dat(dest_folder):
                ftp_path = f"/server/{server_name}"
                install_instance_from_ftp(ftp_path, folders, server_name)
        elif choice == "5":  # Supprimer serveur
            server_name = input("Nom de l'instance serveur : ").strip()
            remove_instance(folders, server_name)
        else:
            print("Choix invalide !")
