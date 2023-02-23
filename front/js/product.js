/*********************************************************************************
    Faire le lien entre un produit de la page d'accueil et la page produit 
**********************************************************************************/

//Fonction qui permet de récupérer l'ID du produit //
function getProductId() {
    return new URL(location.href).searchParams.get('id')
}