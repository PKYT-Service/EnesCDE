## 📄 Pages & Scripts – Gestion des Comptes E‑CDE

---

### 🔐 `__Login__.js`

Script de connexion principal pour accéder aux services E‑CDE ainsi qu’aux services affiliés.
→ Vérifie l'authentification via les identifiants stockés et sécurise l'accès aux espaces protégés.

---

### 🆕 `__Signup__.js`

Script d'inscription pour créer un nouveau compte sur E‑CDE.
→ Inclut les vérifications de sécurité, la génération d'identifiants, et l'enregistrement dans la base distante.

---

### ✅ `__wl__.js`

Système de **whitelist simplifiée** basé uniquement sur l’adresse email.
→ Bloque l’accès aux services pour les utilisateurs non autorisés.

---

### 👤 `__Load_Profil__.js`

Charge dynamiquement les informations du profil utilisateur connecté.
→ Complète automatiquement les balises HTML liées aux données de session (nom, image, rôle, etc.).

---

### 🧩 `[PlugIn]-ProfilViewer.js`

Plug-in d'intégration pour la **visualisation des profils** utilisateurs.
→ Permet l'affichage et l’interaction avec les données de profil dans les interfaces publiques ou administratives.

---

### 🛡️ `__Private_Protection__.js`

Système de sécurité avancée pour la gestion des permissions et des services affectés.
→ Fonctionne via des balises `div` dynamiques telles que :

```html
<div id="session/D"></div>
<div id="perm/100"></div>
```

Ces balises définissent les niveaux d'accès et les droits de l'utilisateur sur la page courante.

---

### 🛠️ `__Admin_Secure__.js`

Script réservé à l’administration.
→ Renforce les contrôles d’accès pour les outils internes, en lien avec les comptes ayant des droits élevés.

---

### 🔄 `__sessions__.js`

Script public **conditionné** à la présence d’un compte valide.
→ Permet de récupérer et d'afficher les sessions en cours, tout en bloquant l'accès aux visiteurs anonymes.

---
---
---
---
---


## 📘 Scripts E‑CDE – Authentification & Sécurité

| Fichier                     | Description enrichie                                                                                                                              | Visibilité     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `__Login__.js`              | Gère la connexion aux services E‑CDE et affiliés. Vérifie les identifiants, crée une session sécurisée.                                           | 🔒 Privé       |
| `__Signup__.js`             | Permet l’inscription de nouveaux comptes. Gère la validation, la génération des identifiants et l’enregistrement distant.                         | 🔓 Public      |
| `__wl__.js`                 | Système de **whitelist** basé uniquement sur les adresses emails. Bloque l’accès aux services pour les utilisateurs non autorisés.                | 🔒 Privé       |
| `__Load_Profil__.js`        | Charge dynamiquement les infos du profil connecté et complète les balises HTML (`<span class="username">`, etc.).                                 | 🔒 Privé       |
| `[PlugIn]-ProfilViewer.js`  | Plug-in pour afficher les profils utilisateur dans l’interface (visuelle/admin). Sert aussi pour les systèmes publics de consultation.            | 🌐 Mixte       |
| `__Private_Protection__.js` | Gère les permissions/services via balises HTML personnalisées (`<div id="session/D">`, `<div id="perm/100">`). Sécurité avancée.                  | 🔒 Privé       |
| `__Admin_Secure__.js`       | Module **réservé à l’administration**. Renforce les contrôles d’accès, avec protection renforcée sur les outils sensibles.                        | 🔒 Interne     |
| `__sessions__.js`           | Script public **conditionné** : s’active uniquement si un compte est détecté dans le localStorage. Gère les sessions et leur affichage dynamique. | 🌐 Semi-public |

---

🔒 **Privé** = uniquement pour utilisateurs connectés
🔓 **Public** = accessible à tous
🌐 **Mixte** = peut être utilisé en mode public ou privé selon contexte
🛡️ **Interne** = usage exclusivement réservé au staff/admins
