/*********************************************************************************
    Afficher un tableau récapitulatif des achats
**********************************************************************************/
//Récupération des produits du Local Storage sous forme de tableau

let localStoragepanier = JSON.parse(localStorage.getItem("panier"));
console.log(localStoragepanier)

//Création du tableau             
tablePanier = [];



/*********************************************************************************
    Gestion du panier => Affichage du produit du panier 
**********************************************************************************/

//Si le panier est vide: Message à l'utilisateur 
if(localStoragepanier === null || localStoragepanier.length === 0){
    document.querySelector('h1').innerHTML = 'Votre panier est actuellement vide';

 
//Si le panier n'est pas vide: Affichage des produits du local Storage
} 
else{

    for(i=0; i<localStoragepanier.length; i++){
        document.getElementById('cart__items').innerHTML +=
        `<article class="cart__item" data-id="${localStoragepanier.idProduct}" data-color="${localStoragepanier.choicecolor}">
            <div class="cart__item__img">
              <img src="${localStoragepanier.imageUrl}" alt="${localStoragepanier.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${localStoragepanier.name}</h2>
                <p>${localStoragepanier.choicecolor}</p>
                <p>${localStoragepanier.price}€</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStoragepanier.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>
        `;}
        //if(i == localStoragepanier.length){}

    }
