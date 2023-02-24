/*********************************************************************************
    Faire le lien entre un produit de la page d'accueil et la page produit 
**********************************************************************************/

//Fonction qui permet de récupérer l'ID du produit //
function getProductId() {
    return new URL(location.href).searchParams.get('id')
}

const idProduct = getProductId()

//Fonction qui permet de récupérer les informations du produit selon son ID //
fetch(`http://localhost:3000/api/products/${idProduct}`) // => URL pour récuperer les valeurs souhaités 
        .then(function (response) {  // retour positive de la promesse
            return response.json()  // récupération du résultat de la requête au format json 
        })
        .then(function (products) {  // récupèration de la valeur du résultat json précédent 
            return products
            //return console.table(products)
        })
        .catch(function (error) {  // Retour négatif de la promesse
            error = `Un problème est survenu lors du chargement, veuillez rafraîchir la page.`; // Affichage du message d'erreur
            alert(error);
        })