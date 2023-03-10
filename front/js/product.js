/*********************************************************************************
    Faire le lien entre un produit de la page d'accueil et la page produit 
**********************************************************************************/

//Fonction qui permet de récupérer l'ID du produit //
function getProductId() { 
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
    for (const choiceColor of product.colors){
        document.getElementById('colors').innerHTML += `<option value="${choiceColor}">${choiceColor}</option>`
    }
}

/*********************************************************************************
    Fonction Async 
**********************************************************************************/
main ()

//Fonction qui permet de récupérer l'id et insérer un produit et ses détails
async function main() {
    
    //Récupération de l'id du produit dans l'url
   const idProduct = getProductId()  //déclaration de la constante pour distinguer l'ID du produit//
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
    const idProduct = getProductId()
    //On récupére la quantité choisie par l'utilisateur
    const quantity = document.getElementById('quantity').value
    //On récupére la couleur choisie par l'utilisateur
    const choiceColor = document.getElementById('colors').value
    
    //console.log(btn_ajouterPanier)

    //S'assurer qu'une couleur et une quantité soit choisie  (qté entre 1 et 100)
    if (choiceColor === "" || quantity < 1 || quantity > 100 || quantity === "") {
    alert(`Merci de sélectionner une couleur et/ou une quantité valide. La quantité doit être comprise en 1 et 100`);
    } 
    else {
        let choiceProduct = {
            id: idProduct,
            color: choiceColor,
            quantity: parseInt(quantity),
        }
        console.log(choiceProduct)


        /*********************************************************************************
            Local Storage
        **********************************************************************************/

        //Stockage des données récupérer dans le local storage 
        //Déclaration de la variable "localstoragepanier" dans laquelle on met les valeurs qui sont dans le local storage

        let localStoragepanier = JSON.parse (localStorage.getItem("panier")); 
        //JSON.parse permet de convertir les données au format JSON qui sont dans le local storage en objet JavaScript 
        //La syntaxe localStorage.getItem("panier") permet de récupérer une donnée, key= "panier" 
        //console.log(localStoragepanier); 

        //Stockage des données récupérées dans le local storage :

        //il Faut vérifier en amont s'il y des données enregistrées dans le local storage 

        //S'il y a déjà des produits d'enregistrés dans le local storage il faut vérifier certaines conditions:
        if(localStoragepanier){
        // On verifie si un produit est présent dans le local Storage avec le (même id + même couleur)
        //La find()méthode exécute une fonction pour chaque élément du tableau.
            let article = localStoragepanier.find((article) => article.id == choiceProduct.id && article.color == choiceProduct.color);
            // Si celui-ci était déjà présent on incrémente simplement la quantité du produit correspondant dans l’array: 
            if (article){
                const updateQuantity = article.quantity + choiceProduct.quantity; 
                console.log(updateQuantity)

            // si l'addition du produit dépasse 100 alors on alerte l'utilisateur (1 produit d'une couleur ne peut pas être commandé plus de 100 fois)
            if (updateQuantity > 100){
                return alert ("Il n'est pas possible de commander plus de 100 exemplaires d'un même produit.")
            }

            // si l'addition du produit ne dépasse pas 100 on réassigne la quantité
            article.quantity = updateQuantity;

            localStorage.setItem("panier", JSON.stringify(localStoragepanier));
            }


            //Si le produit n'existe pas dans le local storage on le push dans le array
            else {localStoragepanier.push(choiceProduct) //Mettre dans le tableau toutes les informations de l'utilisateur => choiceProduct (Id, qté, choix de la couleur) avec push 
            localStorage.setItem("panier", JSON.stringify(localStoragepanier)); //conversion en Json : JSON.stringify (en objet Javascript)
            //La méthode localStorage.setItem() permet d'ajouter la clé et la valeur dans le stockage. 
            //console.log(localStoragepanier);
            }
        }

        //S'il n'y a pas de produits enregistrés dans le local storage (création d'un tableau):
        else{
            
            localStoragepanier = []; //Création d'un tableau
            localStoragepanier.push(choiceProduct) //Mettre dans le tableau toutes les informations de l'utilisateur => choiceProduct (Id, qté, choix de la couleur) avec push 
            localStorage.setItem("panier", JSON.stringify(localStoragepanier)); //Création de la clé et Envoi dans le local Storage avec conversion en Json : JSON.stringify (en objet Javascript)
            //La méthode localStorage.setItem() permet d'ajouter la clé et la valeur dans le stockage.

            //console.log(localStoragepanier); 

        }
        //Une fois les conditions vérifiées, le produit est ajouté et l'utilisateur est renvoyé vers la page panier.
        //document.getElementById('addToCart').innerHTML = 'Produit ajouté au panier';
        window.alert("Votre produit a bien été ajouté à votre panier")
        //window.location.href = "cart.html"
    }
})