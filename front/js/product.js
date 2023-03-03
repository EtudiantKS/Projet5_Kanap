/*********************************************************************************
    Faire le lien entre un produit de la page d'accueil et la page produit 
**********************************************************************************/

//Fonction qui permet de récupérer l'ID du produit //
function getproductId() { 
    return new URL(location.href).searchParams.get('id') //l'objet newURL et searchParams permettent de recupérer l'id du produit
}


//Fonction qui permet de récupérer les informations du produit selon son ID //
function getProduct (idProduct) {
return fetch(`http://localhost:3000/api/products/${idProduct}`) // => chemin de la ressource qu'on souhaite récupérer avec l'id du produit
        .then(function (response) {  // retour positive 
            return response.json()  // récupération du résultat de la requête au format json 
        })
        .then(function (products) {  // récupèration de la valeur du résultat json précédent 
            return products
            //return console.table(products)
        })
        .catch(function (error) {  // Retour négatif 
            error = `Un problème est survenu lors du chargement, veuillez rafraîchir la page.`; // Affichage du message d'erreur
            alert(error);
        })
}

/*********************************************************************************
    Affichage du produit et ses détails 
**********************************************************************************/

//Fonction pour insérer les informations du produit : 
// Html => img src + Nom + Price + description + color //

function display(product) {     //fonction pour afficher les informations du produit  
    document.querySelector(".item__img").innerHTML = //Création des informations lié à l'image dans le DOM
        `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.getElementById ('title').innerHTML = product.name
    document.getElementById ('price').innerHTML = product.price
    document.getElementById ('description').innerHTML = product.description

    //Pour le choix des coleurs => utilisation de la boucle (for / of)
    for (const choicecolor of product.colors){
        document.getElementById('colors').innerHTML += `<option value="${choicecolor}">${choicecolor}</option>`
    }
}

/*********************************************************************************
    Fonction Async 
**********************************************************************************/
main ()

//Fonction qui permet de récupérer l'id et insérer un produit et ses détails
async function main() {
    
    //Récupération de l'id du produit dans l'url
   const idProduct = getproductId()  //déclaration de la constante pour distinguer l'ID du produit//
    //console.log(productId)

    //Récupération du produit grâce à l'id
    const product = await getProduct (idProduct)

    // Puis affichage
    display(product)   
}

/*********************************************************************************
   Ajouter des produits dans le panier 
**********************************************************************************/

//Récupération des données séléctionnées par l'utilisateur et envoi du panier 

//Constante pour selection du bouton "ajouter au panier" 
const btn_ajouterPanier = document.getElementById ('addToCart')

//Ecouter le bouton au click 
btn_ajouterPanier.addEventListener("click",(event) => {
    //On récupére l'Id du produit
    const idProduct = getproductId()
    //On récupére la quantité choisie par l'utilisateur
    const quantity = document.getElementById('quantity').value
    //On récupére la couleur choisie par l'utilisateur
    const choicecolor = document.getElementById('colors').value
    
    //console.log(btn_ajouterPanier)

    let choiceProduct = {
        id: idProduct,
        color: choicecolor,
        quantity: quantity,
    }
    console.log(choiceProduct)
})
