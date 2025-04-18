// Service lié par EnesCDE 
// PKYT - Service , Tous droits reservées .
// 2020 - 2024 [ NaxeWayz , FayzXase , LosFlyTM by PikaYutMG , GFLP - LSP # SRDMG , SourceDevMG , PikaYutMG , PKYT - service / PKYT - DATABASE + PKYT - DATABASE - UP , nom appartenant a E-CDE ( D.Enes )  . ]
// 2017 - 2022 [ LosFly ] deretour en 2025(../02.2024)
// Patch : 3 04/02/2025
// Sortie officielle : 10/09/2024
// By EnesGP ( Enes D-GP ) 

//////////////////////////////////////////////
// E-CDE | BASE                             //
//////////////////////////////////////////////

 
(function() {
    console.log("⌛ | AllService ✅ [ Les script on etait chargés]");
})();


console.log(" [❇️🔰] | ToutServiceLierPkyt : Enes - CDE , Tous droits reservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : LosFly , Tous droits reservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : PKYT - Service , Tous droits reservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : 2020 - 2024 [ NaxeWayz , FayzXase , LosFlyTM by PikaYutMG , GFLP - LSP # SRDMG , SourceDevMG , PikaYutMG , PKYT - service / PKYT - DATABASE + PKYT - DATABASE - UP , nom appartenant a E-CDE ( D.Enes )  . ]");
console.log(" [❇️🔰] | ToutServiceLierPkyt : 2017 - 2022 [ LosFly ] deretour en 2025(../02.2024).");
console.log(" [❇️🔰] | ToutServiceLierPkyt : By EnesGP ( Enes D-GP ");

//////////////////////////////////////////////
// Enes - CDE | SCRIPT                      //
//////////////////////////////////////////////
// Affiche une console spéciale si "EnesCDE_ADM:CSL" = true.
import { ECDE_Console } from "https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Csl.js";
ECDE_Console();

// Bloque les accès devtools (F12) sauf si "EnesCDE_ADM:F12" = ADMIN.
import { Secure_F12 } from "https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-F12.js";
Secure_F12();

// Réactualise la page toutes les minutes si "EnesCDE_ADM:Refresh" est true.
import { Secure_Ref } from "https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Rfh.js";
Secure_Ref();

// Vérifie si l'utilisateur a accepté les règles, sinon redirige vers google.com.
import { CheckRulesToAcces } from "https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-RulesIsTrue.js";
CheckRulesToAcces();

// Limite à 4/5 onglets ouverts maximum.
import { CheckTabs_OpenLimit } from "https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-TabsLimites.js";
CheckTabs_OpenLimit();

// Utilisé pour les comptes v3 PKYT. Si banni, redirige vers leur page dédiée.
import { checkBan_Account3V } from "https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-V3AccBan.js";
checkBan_Account3V();

// Nettoie automatiquement la console (seulement les warnings).
import { CO_Cleaner_ecde } from "https://enes-cde.vercel.app/SLPECDE/script/@N-FCT@-ClearCsl.js";
CO_Cleaner_ecde();

// Corrige les valeurs incorrectes dans cookies / localStorage / session.
import { Rules } from "https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js";
Rules();

// Corrige les valeurs incorrectes dans cookies / localStorage / session (version ADM).
import { ADM_RPE } from "https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js";
ADM_RPE();

// Affiche un popup signalant que le site est protégé par EnesCDE Sys.
import { pu_ucd_ecde } from "https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-E.CDE-Sys.js";
pu_ucd_ecde();

// Synchronise les données d’un utilisateur sur les sites ECDE via son ID_IP.
import { PU_Sync } from "https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-SyncData.js";
PU_Sync();

// Redirige si l’un des 4 IDs est banni dans la base PPDS.
import { ecde_client } from "https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Ban.js";
ecde_client();

// Loggue l’activité utilisateur dans PPDS (pages visitées, cookies, etc).
import { ID_log_ecde } from "https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Log.js";
ID_log_ecde();

// Applique les 4 IDs de sécurité si absents ou non définis.
import { ID_stock_ecde } from "https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Storage.js";
ID_stock_ecde();

// Vérifie si l’un des 4 IDs est dans PPDS, et déclenche un bannissement.
// import { ID_verif_ecde } from "https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Verification.js";
// ID_verif_ecde();

// Le WebManager permet d’ajouter un site au système PPDS et de le contrôler via un panel dédié au staff ECDE.
import { WebManager } from "https://enes-cde.vercel.app/SLPECDE/script/@W-FCT@WebMng.js";
WebManager();


//////////////////////////////////////////////
// Google & Microsoft & Instatus | Sections //
//////////////////////////////////////////////


// Microsoft
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "p48i5fvwyv");


// Google
     window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());

       gtag('config', 'G-MHN0VB5ENT');
       document.write("<script async src=\"https:\/\/www.googletagmanager.com\/gtag\/js?id=G-MHN0VB5ENT\"><\/script>");
// Instatus

     //const script_AD = document.createElement('script');
     //script_AD.src = 'https://pikayut.instatus.com/fr/7c9cc48b/widget/script.js';
     //document.body.appendChild(script_AD);


document.write("<meta name=\"viewport\" content=\"initial-scale=1\" \/>");


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  autre                                                                                                                              ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
// | PKYT - Service ST : A [ PKYT - Service , tous droits réservées |
// |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |



    document.addEventListener("DOMContentLoaded", function() {
      // Charger la police Google Fonts
      const fontLink = document.createElement("link");
      fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    
      // Création de l'overlay de chargement
      const loadingOverlay = document.createElement("div");
      Object.assign(loadingOverlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif", // Police appliquée
        zIndex: "1000",
      });
    
      // Texte principal "PKYT - Service"
      const mainText = document.createElement("div");
      mainText.innerHTML = `PKYT - <span style="color: #145af2;">Service</span> <br> <font color="red">Maintenance</font>`;
      Object.assign(mainText.style, {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px",
      });
    
      // Texte secondaire "By LosFlyProtect" en gras et italique
      const subText = document.createElement("div");
      subText.innerHTML = `By <b><i>EnesGP</i></b>`;
      Object.assign(subText.style, {
        color: "#ADAFB6",
        fontSize: "16px",
        marginBottom: "20px",
      });
    
      // Conteneur pour les points clignotants
      const dotFlashingContainer = document.createElement("div");
      Object.assign(dotFlashingContainer.style, {
        display: "flex",
        position: "absolute",
        bottom: "50px",
        justifyContent: "center",
        alignItems: "center",
      });
    
      // Création des points clignotants
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        Object.assign(dot.style, {
          width: "10px",
          height: "10px",
          margin: "0 5px",
          backgroundColor: "white",
          borderRadius: "50%",
          animation: `dotFlashing 1s infinite alternate`,
          animationDelay: `${i * 0.2}s`,
        });
        dotFlashingContainer.appendChild(dot);
      }
    
      // Ajout du texte en bas à gauche
      const bottomLeftText = document.createElement("div");
      bottomLeftText.innerHTML = "<b>PKYT - <font color='#145af2'>Service </font> </b><i>DEBUT : 03/02/2025 </i>: <b><mark>all rights reserved .</mark> </b>";
      Object.assign(bottomLeftText.style, {
        position: "absolute",
        bottom: "10px",
        left: "10px",
        fontSize: "14px",
        color: "#ADAFB6",
      });
    
      // Ajout des éléments au conteneur de chargement
      loadingOverlay.appendChild(mainText);
      loadingOverlay.appendChild(subText);
      loadingOverlay.appendChild(dotFlashingContainer);
      loadingOverlay.appendChild(bottomLeftText);
    
      // Ajoute le conteneur de chargement au body
      document.body.appendChild(loadingOverlay);
    
      // Retire l'overlay après 3 secondes
      setTimeout(() => {
        loadingOverlay.remove();
      }, 0);
    
      // Définition de l'animation des points clignotants
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes dotFlashing {
          0% { opacity: 0.2; }
          50%, 100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    });
      
