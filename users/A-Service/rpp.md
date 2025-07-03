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

