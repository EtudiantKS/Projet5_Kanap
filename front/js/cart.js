/*********************************************************************************
    Afficher un tableau récapitulatif des achats
**********************************************************************************/
//Récupération des produits du Local Storage sous forme de tableau

let localStoragepanier = JSON.parse(localStorage.getItem("panier"));
//console.log(localStoragepanier)

// on récupère les données supplémentaires via l'API (pour récupérer le nom, l'image, le prix)
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
    Gestion du panier => Affichage des produits dans le panier 
**********************************************************************************/


async function displayPanier (){
    //Si le panier est vide: Message à l'utilisateur     
    if(localStoragepanier === null || localStoragepanier.length === 0){
        document.querySelector('h1').innerHTML = 'Votre panier est actuellement vide';
    }
    //Si le panier n'est pas vide: On récupére les informations des produits   
    else{
        //boucle pour récupérer l'ensemble des informations du LS et API 
        for(i=0; i<localStoragepanier.length; i++){
            let article = localStoragepanier[i]
            //console.table(localStoragepanier);

            //Constante pour les informations des articles
            productData = await getProduct(article.id);
            document.getElementById('cart__items').innerHTML +=
            //id, color et quantity proviennent du Local Storage et le reste de l'API 
            `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
                <div class="cart__item__img">
                <img src="${productData.imageUrl}" alt="${productData.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${article.color}</p>
                    <p>${productData.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>`;
        
            changeQuantity();
            deleteProduct();
        }
    }
}

displayPanier();

/*********************************************************************************
    Gestion du panier => Modifier la quantité d'un produit depuis le panier
**********************************************************************************/
//fonction pour modifier la quantité
function changeQuantity() {

    //Déclaration pour la nouvelle quantité et modification dans le DOM
    let articleQuantity = document.querySelectorAll('.itemQuantity');

    //Boucle pour chaque modification de la quantité
    for (let q = 0; q < articleQuantity.length; q++) {
        articleQuantity[q].addEventListener("change", (event) => {
            let newarticleQuantity = articleQuantity[q].value;

            const choiceQuantity = {
                id: localStoragepanier[q].id, 
                color: choiceColor,
                quantity: parseInt(newarticleQuantity),
            }
            //Si la quantité ne respecte pas les conditions suivantes, alors alerte à l'utilisateur
            if(newarticleQuantity> 100 || newarticleQuantity <= 0|| newarticleQuantity === ""){
                alert (`Merci de sélectionner une quantité valide. La quantité doit être comprise en 1 et 100`);
            }
            //Si la quantité est conforme alors on stocke dans le LS
            else {
            localStoragepanier[q] = choiceQuantity;
            localStorage.setItem("panier", JSON.stringify(localStoragepanier));
            alert("La quantité de votre produit a bien été mise à jour")
            }
        });
    }
}
/*********************************************************************************
    Gestion du panier => Supprimer un produit depuis le panier
**********************************************************************************/

function deleteProduct() {
    // Déclaration de suppression du produit via les boutons présent dans le DOM
    let deleteBouton = document.querySelectorAll('.deleteItem');
    //console.log(deleteBouton);

        //Boucle pour chaque chaque élement du tableau 
        for (let s = 0; s < deleteBouton.length; s++) {
            deleteBouton[s].addEventListener("click", (event) =>{
                event.preventDefault(); 

                //sélection de l'id du produit qui va être supprimer en cliquant sur le bouton : 
                let id_delete = localStoragepanier[s].id;
                let color_delete = localStoragepanier[s].color;
                //console.log(id_delete); 

                //avec la méthode filtre => séléction des éléments à garder et suppression de l'élément où le bouton a été cliqué
                localStoragepanier = localStoragepanier.filter(
                    (el) => el.id !== id_delete || el.color !== color_delete
                ); 
                //console.log(localStoragepanier);

                // envoi de la variable dans le local Storage
                // transformation en format JSON et envoi de la Key'panier" du localStorage 
                localStorage.setItem("panier", JSON.stringify(localStoragepanier));

                //alert pour avertir que le produit a été supprimer & rafraîchissement de la page 
                alert("Le produit a bien été supprimer du panier"); 
                window.location.href = "cart.html"

            });
        }
}

/*********************************************************************************
    Gestion du panier => Calcul de la somme totale du panier
**********************************************************************************/