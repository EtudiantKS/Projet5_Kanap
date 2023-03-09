/*********************************************************************************
Afficher un tableau récapitulatif des achats
**********************************************************************************/
//Récupération des produits du Local Storage sous forme de tableau

let localStoragepanier = JSON.parse(localStorage.getItem("panier"));
console.log(localStoragepanier)

//Création du tableau             
localStoragepanier = [];

