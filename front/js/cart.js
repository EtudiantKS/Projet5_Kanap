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
        for(let i=0; i<localStoragepanier.length; i++){
            let article = localStoragepanier[i]
            //console.table(localStoragepanier);

            //Constante pour les informations des articles
             let productData = await getProduct(article.id);
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
            totalPanier(); //déclaration de la fonction asynchrone 
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
            event.preventDefault (); //ne rien faire s'il n'ya pas de click

            let newarticleQuantity = articleQuantity[q].value;

            const choiceQuantity = {
                id: localStoragepanier[q].id, 
                color: localStoragepanier[q].color,
                quantity: parseInt(newarticleQuantity),
            }
            //Si la quantité ne respecte pas les conditions suivantes, alors alerte à l'utilisateur
            //if(newarticleQuantity> 100 || newarticleQuantity <= 0|| newarticleQuantity === ""){
            if(newarticleQuantity> 100 || newarticleQuantity <= 0|| newarticleQuantity === ""){
                alert (`Merci de sélectionner une quantité valide. La quantité doit être comprise en 1 et 100`);
            }
            //Si la quantité est conforme alors on stocke dans le LS
            else {
            localStoragepanier[q] = choiceQuantity;
            localStorage.setItem("panier", JSON.stringify(localStoragepanier));
            alert("La quantité de votre produit a bien été mise à jour")
            }
            // Mise a jour du prix du panier suite aux modifications
            totalPanier();
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

        //Boucle pour chaque élement du tableau 
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
                alert("Le produit a bien été supprimé du panier"); 
                window.location.href = "cart.html"

            });
        }
}

/*********************************************************************************
    Gestion du panier => Calcul de la somme totale du panier
**********************************************************************************/
async function totalPanier() {
    //Déclaration des variables (priceTotal & quantityTotal) en tant que nombre par défaut
    let priceTotal = 0; 
    let quantityTotal = 0; 


    //L'opérateur d'inégalité (!=) vérifie si les deux opérandes ne sont pas égaux 
    if(localStoragepanier !=0 || localStoragepanier != null ){
        //boucle pour récupérer l'ensemble des informations du LS et API 
        for(let i=0; i<localStoragepanier.length; i++){
            let article = localStoragepanier[i]
            //Constante pour les informations des articles
            let productData = await getProduct(article.id);
            //Calcul du prix total
            priceTotal +=  article.quantity * productData.price;
            //Donne la quantité des articles  
            quantityTotal +=  article.quantity; 
        }
    }
    // injecte le nouveau contenu dans le DOM 
    let finalQuantity = document.getElementById('totalQuantity');
    finalQuantity.innerHTML = quantityTotal;
  
    let finalPrice = document.getElementById('totalPrice');
    finalPrice.innerHTML =  priceTotal;
}


/***************************************************************************************************
   Récupération et Validation des données dans le formulaire puis stockage dans le Local Strorage
****************************************************************************************************/

//Déclaration des constantes pour séléctionner dans le DOM 
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('email');


/**** Pour le Prénom ******/
//Contrôle du prénom dès le changement de l'élément Html 
firstNameInput.addEventListener("change", function(){ //écoute de l'événement change sur l'input prénom
    let inputValue = this.value; //variable qui définit la valeur modifiée
    controlePrenom(inputValue); //permet de lancer la fonction de contrôle 
});

  //Utilisation des Regex pour verifier les données des champs du formulaire & affichage d'un message d'erreur si besoin  

function controlePrenom(){
    const firstNameInputcontrole = firstNameInput.value;
    if(/^[A-Za-z][A-Za-z\é\è\ê\ë\ï\œ\-\s]+$/.test(firstNameInputcontrole)){
        document.getElementById('firstNameErrorMsg').textContent = ""; // si ok, ne plus afficher le message d'alerte
        firstNameInput.setAttribute('style', 'border:3px solid green');
        return true;
    }else{
        document.getElementById('firstNameErrorMsg').textContent = "Veuillez renseigner votre Prénom. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)";  // pour avoir une alerte sous le champs concerné
        firstNameInput.setAttribute('style', 'border:3px solid #FF0000');
        return false;
    }
    }; 

/**** Pour le Nom ******/

//Contrôle du Nom dès le changement de l'élément Html 
lastNameInput.addEventListener("change", function(){ //écoute de l'événement change sur l'input nom
    let inputValue = this.value; //variable qui définit la valeur modifiée
    controleNom(inputValue); //permet de lancer la fonction de contrôle 
});

//Utilisation des Regex pour verifier les données des champs du formulaire & affichage d'un message d'erreur si besoin  
    function controleNom(){
    const lastNameInputcontrole = lastNameInput.value;
    if(/^[A-Za-z][A-Za-z\é\è\ê\ë\ï\œ\-\s]+$/.test(lastNameInputcontrole)){
        document.getElementById('lastNameErrorMsg').textContent = ""; // si ok, ne plus afficher le message d'alerte
        lastNameInput.setAttribute('style', 'border:3px solid green');
        return true;
    }else{
        document.getElementById('lastNameErrorMsg').textContent = "Veuillez renseigner votre Nom. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)";  // pour avoir une alerte sous le champs concerné
        lastNameInput.setAttribute('style', 'border:3px solid #FF0000');
        return false;
    }
    };

/**** Pour l'Adresse ******/
//Contrôle de l'adresse dès le changement de l'élément Html 
addressInput.addEventListener("change", function(){ //écoute de l'événement change sur l'input d'adresse
    let inputValue = this.value; //variable qui définit la valeur modifiée
    controleAddress(inputValue); //permet de lancer la fonction de contrôle 
});
//Utilisation des Regex pour verifier les données des champs du formulaire & affichage d'un message d'erreur si besoin 
    function controleAddress(){
    const addressInputcontrole = addressInput.value;
    if(/^[a-zA-Z0-9.\é\è\ê\ë\ï\œ\â,-_ ]{5,50}[ ]{0,2}$/.test(addressInputcontrole)){
        document.getElementById('addressErrorMsg').textContent = ""; // si ok, ne plus afficher le message d'alerte
        addressInput.setAttribute('style', 'border:3px solid green');
        return true;
    }else{
        document.getElementById('addressErrorMsg').textContent = "Veuillez renseigner votre adresse. (Minimum 5 caractères, symboles spéciaux interdits)";  // pour avoir une alerte sous le champs concerné
        addressInput.setAttribute('style', 'border:3px solid #FF0000');
        return false;
    }
    };

/**** Pour la ville ******/
//Contrôle de la ville dès le changement de l'élément Html 
cityInput.addEventListener("change", function(){ //écoute de l'événement change sur l'input ville 
    let inputValue = this.value; //variable qui définit la valeur modifiée
    controleCity(inputValue); //permet de lancer la fonction de contrôle 
});
//Utilisation des Regex pour verifier les données des champs du formulaire & affichage d'un message d'erreur si besoin 
    function controleCity(){
    const cityInputcontrole = cityInput.value;
    if(/^[A-Za-z][A-Za-z\é\è\ê\ë\ï\œ\â\-\s]+$/.test(cityInputcontrole)){
        document.getElementById('cityErrorMsg').textContent = ""; // si ok, ne plus afficher le message d'alerte
        cityInput.setAttribute('style', 'border:3px solid green');
        return true;
    }else{
        document.getElementById('cityErrorMsg').textContent = "Veuillez renseigner la ville. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)";  // pour avoir une alerte sous le champs concerné
        cityInput.setAttribute('style', 'border:3px solid #FF0000');
        return false;
    }
    };

/**** Pour l'Email ******/
//Contrôle de l'emal dès le changement de l'élément Html 
emailInput.addEventListener("change", function(){ //écoute de l'événement change sur l'input email
    let inputValue = this.value; //variable qui définit la valeur modifiée
    controleEmail(inputValue); //permet de lancer la fonction de contrôle 
});
//Utilisation des Regex pour verifier les données des champs du formulaire & affichage d'un message d'erreur si besoin 
    function controleEmail(){
    const emailInputcontrole = emailInput.value;
    if(/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$/.test(emailInputcontrole)){
        document.getElementById('emailErrorMsg').textContent = ""; // si ok, ne plus afficher le message d'alerte
        emailInput.setAttribute('style', 'border:3px solid green');
        return true;
    }else{
        document.getElementById('emailErrorMsg').textContent = "Veuillez renseigner votre adresse mail. Celle-ci doit être composée telle que test@domaine.com";  //pour avoir une alerte sous le champs concerné
        emailInput.setAttribute('style', 'border:3px solid #FF0000');
        return false;
    }
    };

/***********ZOOM : Explication Regex:***********/
    //'^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z][2,10]$', 'g'
        //^ début de la chaîne de caractère autorisée 
        //[a-z: de a à z en minuscule, de A-Z en majuscule 0-9: des chiffres de 0à 9, .-_ : caractères autorisés]
        //\w: Indique un caractère alphanumérique ou un tiret de soulignement. Cela correspond à taper [a-zA-Z0-9_]
        //+ permet de dire que ces caractères peuvent être écrit une fois ou plrs fois
        //[@]{1} on doit trouvé l'@ une seule fois
        //[a-zA-Z0-9.-_]+ : autorisation après l'@
        // [.]{1} le point a retrouver qu'une seule fois 
        // [a-z]: signfie qu'après le . uniquement en minuscule [2,10} et nombre de lettres autorisées : 2min 10max
        // $ fin de notre expresion régulière
        // lors d'une regexp, il faut un marqueur => comment lire la regexp : 'g' pour global 
/***********Fin : Explication Regex:***********/    


/***************************************************************************************************
   L'utilisateur valide le formulaire (order)
   Objet contact (les données du formulaire) et un tableau des produits
****************************************************************************************************/
// on vient cibler le btn 'commander' du formulaire
const orderButton = document.getElementById('order');

//au click du bouton commander par l'utilisateur
orderButton.addEventListener('click', (event) => {
    event.preventDefault();

    //Conditions devant être respectées pour commander: 

    // l'utilisateur ne peut pas pas passer de commande si le panier est vide
    if(localStoragepanier ==0 || localStoragepanier ==null){
        alert('Votre panier est actuellement vide, vous ne pouvez pas commander');
    }
    // si le panier n'est pas vide alors  : 
    else{
        if (controlePrenom() && controleNom() && controleAddress() && controleCity() && controleEmail()){ // il faut que les fonctions soient true (&&)
        
        //Création d'un tableau des ID des articles du panier 
            let ids = [];
            for (let a = 0; a < localStoragepanier.length; a++){
            ids.push(localStoragepanier[a].id);
            }
            //au click récupération des valeurs du formulaire dans un objet (contact)
            const FormContact = {
                contact: {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                city: cityInput.value,
                email: emailInput.value,
                },
                // tableau de la liste des IDs à envoyer
                products: ids,
            };
        //Récupération du formulaire pour le mettre ds le local storage
        localStorage.setItem('contact', JSON.stringify(FormContact)); // JSON.stringify=> convertir l'objet (contact) en chaine de caractères
        
        //Appel de la fonction pour envoyer les données au serveur
        sendServer(FormContact);
        alert("Votre commande a bien été effectuée !");
        }else{
        alert("Merci de verifier le formulaire de contact, toutes les informations doivent être correctement renseigneés");
        }
    }
});
   

/***************************************************************************************************
  Envoi des informations au serveur (utilisation de la méthode POST)
****************************************************************************************************/
    //fonction pour envoyer les produits et les informations sur le serveur: 
        //le tableau des produits envoyé au back-end est sous forme d'un array de strings product-ID.
        //l'objet contact envoyé au serveur doit être constitué des champs : (firstname, lastname, address, city et email)
    
    function sendServer(FormContact) {
        fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            body: JSON.stringify(FormContact), // clefs contact et products
            headers: {'Content-Type': 'application/json'},
        })
        // Récupèration et stockage de la réponse de l'API (orderId)
        .then((res) => res.json ()) // récupération du résultat de la requête au format json 
        .then((data) => { //et avec ces données
            const orderId = data.orderId;
            console.log(orderId);
            window.location.href = 'confirmation.html?orderId=' + orderId; //redirection vers page confirmation avec l'id dans l'url
        })
		.catch((err) => {
			console.error(err);
			alert('erreur: ' + err);
		});
    }

    


 



