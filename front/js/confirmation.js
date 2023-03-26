/***********************************************************************
    Recupération & affichage de l'ID de la commande à l'utilisateur
***********************************************************************/

// Récupèration de l'ordreId de l'URL 
let orderId = new URLSearchParams(window.location.search).get('orderId'); 

// Le numéro de commande est créé dans le HTML et il s'affiche dans la page confirmation
document.getElementById('orderId').innerHTML = orderId;

// Le localStorage est vidé suite à la commande de l'utilisateur 
window.localStorage.clear();