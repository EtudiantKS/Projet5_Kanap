/*********************************************************************************
    Insérer les produits dans la page d'accueil 
**********************************************************************************/

//Fonction qui permet de récupérer tous les produits de l'API//

function getProducts() {
    return fetch("http://localhost:3000/api/products") // => URL de l'API 
        .then(function (response) {  // retour positive de la promesse
            return response.json()  // récupération du résultat de la requête au format json 
        })
        .then(function (products) {  // récupèration de la valeur du résultat json précédent 
            return products
        })
        .catch(function (error) {  // Retour négatif de la promesse
            error = `Un problème est survenu lors du chargement, veuillez rafraîchir la page.`; // Affichage du message d'erreur
            alert(error);
        })
}

//Fonction qui permet d'afficher les produits avec leur contenu dans la page d'accueil 

function displayProduct(product) {     //fonction pour afficher les produits
    document.getElementById('items').innerHTML +=   //innerHTML: injecte le nouveau contenu dans le DOM // GetElementById: permet de récupérer les informations d'une balise identifiée par son Id (HTML)
        `<a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>`; //lien entre un produit de la page d'accueil et la page produit & information relatif au produit
}

main(); // lancement de la fonction principale pour inserer les produits, s'exécute dès le chargement de la page


//Fonction qui permet de parcourir la liste des produits => utilisation de la boucle (for / of)

async function main() {    // fonction asynchrome => récupèration des produits
    const products = await getProducts()     //attente de la récupération des produits pour s'exécuter 
    for (product of products) {     // pour chacun des produits de la liste
        displayProduct(product) // affichage 
}
}