//**********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                  FONCTIONS APPELEES AUTOMATIQUEMENT PAR LES PAGES                    ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION POUR INITIALISER UN COMPTE ADMIN // APPELEE AUTOMATIQUEMENT DANS INDEX.HTML
function initAdmin ()
{
    //Créer un compte admin par default (pas sécurisé car mot de passe admin visible dans le code mais utilisé pour faciliter l'exerice)
    var id = JSON.parse(localStorage.getItem('userId') || '1');
    var admin = {
        id: id,
        firstName : "Admin",
        lastName : "Admin",
        email : "admin@tunisiashop.com",
        password : "admin",
        confirmPassword : "admin",
        role : "admin"
    };

    var allUsers = JSON.parse(localStorage.getItem('listUsers') || '[]');
    
    //Vérifier si le compte admin existe ou non
    var adminExist = false;
    for (var i = 0; i < allUsers.length; i++) 
    {
        if (allUsers[i].email === admin.email)
        {
            adminExist = true;
        }
    }

    //Si le compte admin n'existe pas
    if(!adminExist)
    {
        //Ajouter le compte admin par default
        allUsers.push(admin);
        localStorage.setItem('userId', id + 1 );
        localStorage.setItem('listUsers', JSON.stringify(allUsers) );
    }
}

//FONCTION POUR VERIFIER SI UTILISATEUR CONNECTE // APPELEE AUTOMATIQUEMENT DANS CHAQUE PAGE
function verifConnectedUser()
{
    //Si pas de user connecté
    //Si page actuelle différente de index ou contact ou account 
    if ( (!localStorage.getItem('connectedUser')) && (!window.location.href.includes("index.html")) && (!window.location.href.includes("contact.html")) && (!window.location.href.includes("signup.html")) )
    {
        //Rediriger vers index
        location.replace('index.html'); 
    }
    else
    {
        var user = JSON.parse(localStorage.getItem('connectedUser'));
        var btnLogin = document.getElementById('btn-top-login');
        var btnLogout = document.getElementById('btn-top-logout');
        var btnCart = document.getElementById('btn-top-cart');
        var btnAdmin = document.getElementById('btn-top-admin');
        var btnInbox = document.getElementById('btn-top-inbox');
        var fieldEmailContact = document.getElementById('contactEmail');
        var btnEpSl = document.getElementById('btn-ep-sl');
        var btnEpSC = document.getElementById('btn-ep-sc');

        if (user)
        {
            //Si Utilisateur connecté role = user
            if (user.role == 'user')
            {
                //Desactiver l'affichage du bouton login
                btnLogin.style.display = 'none';
                //Activer l'affichage des boutons "Mon Panier" et "Logout"
                btnCart.style.display = '';
                btnLogout.style.display = '';
                //Desctiver l'affichage des boutons "Epicerie salée" et "Epicerie sucrée"
                btnEpSl.style.display = '';
                btnEpSC.style.display = '';
                //Desctiver le champ mail dans la page contact et le remplir avec le email du user connecté
                fieldEmailContact.value = user.email;
                fieldEmailContact.disabled = true;
            }
            else if (user.role == 'admin')
            {
                //Desactiver l'affichage du bouton login
                btnLogin.style.display = 'none';
                //Activer l'affichage des boutons "Dashboard" et "Logout"
                btnAdmin.style.display = '';
                btnInbox.style.display = '';
                btnLogout.style.display = '';
            }
        }
    }
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                  FONCTIONS INSCRIPTION ET LOGIN ET LOGOUT                            ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION POUR INSCRIPTION UTILISATEUR
function signUpUser()
{

    //Récuperation des valeurs de chaque input
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('pwd').value;
    var cpwd = document.getElementById('cpwd').value;
    
    var isValid = true;

    if(fname === "")
    {
        document.getElementById('fnameError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(lname === "")
    {
        document.getElementById('lnameError').innerHTML = "Ce champs est obligatoire"; 
        isValid = false;
    }

    if(email === "")
    {
        document.getElementById('emailError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }
    else if (validateEmail(email) === false)
    {
        document.getElementById('emailError').innerHTML = "Le format de l'email est non valide";
        isValid = false;
    }

    if(pwd === "")
    {
        document.getElementById('pwdError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(cpwd === "")
    {
        document.getElementById('cpwdError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if (cpwd !== pwd)
    {
        document.getElementById('cpwdError').innerHTML = "Les mots de passe ne sont pas identiques";
        isValid = false;
    }

    var allUsers = JSON.parse(localStorage.getItem('listUsers') || '[]');

    //Vérifier si l'email de l'utilisateur existe ou non
    var userExist = false;
    for (var i = 0; i < allUsers.length; i++) 
    {
        if (allUsers[i].email === email)
        {
            userExist = true;
        }
    }

    //Si l'email est utilisée
    if(userExist)
    {
        document.getElementById('emailError').innerHTML = "L'addresse mail est déjà utilisée";
    }
    //Sinon
    else
    {
        if (isValid)
        {
            //Ajouter nouveau utilisateur
            var id = JSON.parse(localStorage.getItem('userId') || '1');
            var user ={
                id: id,
                firstName : fname,
                lastName : lname,
                email : email,
                password : pwd,
                confirmPassword : cpwd,
                role : 'user'
            };

            allUsers.push(user);
            localStorage.setItem('userId', id + 1 );
            localStorage.setItem('listUsers', JSON.stringify(allUsers) );
            alert('Inscription faite ! Vous pouvez vous connecter maintenant');
            location.replace('index.html'); 
        }   
    }
}

//FONCTION POUR LOGIN UTILISATEUR
function loginUser()
{
    var email = document.getElementById('loginEmail').value;
    var pwd = document.getElementById('loginPwd').value;

    //L'utilisateur doit saisir un email et un mdp
    if (email.length === 0 || pwd.length === 0)
    {
        document.getElementById('loginError').innerHTML = "Veuillez saisir vos identifiants";
    }
    else if (validateEmail(email) === false)
    {
        document.getElementById('loginError').innerHTML = "Le format de l'email est non valide";
    }
    else
    {
        //Récuperation du tableau contenant la liste des utilisateurs
        var allUsers = JSON.parse(localStorage.getItem('listUsers'));
        var user;
        for (let i = 0 ; i < allUsers.length; i++)
        {
            if (allUsers[i].email === email && allUsers[i].password === pwd)
            {
                user = allUsers[i];
            }
        } 

        //Si le login OK
        if (user)
        {
            localStorage.setItem('connectedUser', JSON.stringify(user));
            if(user.role === 'user')
            {
                //rediction vers la page index
                location.replace('index.html');
            }
            else
            {
                //rediction vers la page admin
                location.replace('admin.html');
            }
        }
        //Sinon
        else
        {
            document.getElementById('loginError').innerHTML = "Connexion impossible ! Veuillez vérifier votre saisie";
        }
    }    
}

//FONCTION POUR DECONNECTER UTILISATEUR 
function logoutUser()
{
    localStorage.removeItem('connectedUser');
    //rediction vers la page index
    location.replace('index.html');
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/

/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                          TOUTES LES FONCTIONS USERS                                  ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION POUR AFFICHER LA LISTE DES UTILISATEURS DANS ADMIN.HTML
function displayUsers()
{
    var allUsers = JSON.parse(localStorage.getItem('listUsers'));

    usersTable = 
    `<br/>
    <button type="button" class="btn btn-info" onclick='addUser()'>Ajouter un nouveau utilisateur</button><br/><br/>
    <div id="addUser"></div>
    <table id="usersTable" class="table">
    <thead>
    <tr>
        <th>Nom</th>
        <th>Prenom</th>
        <th>Email</th>
        <th>Mot de passe</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>`;

    if (allUsers)
    {
        for (let i = 0; i < allUsers.length; i++) 
        {
            usersTable += `<tr>
            <td>${allUsers[i].firstName}</td>
            <td>${allUsers[i].lastName}</td>
            <td>${allUsers[i].email}</td>
            <td>${allUsers[i].password}</td>
            <td>${allUsers[i].role}</td>
            <td>
            <button type="button" class="btn btn-danger" onclick='deleteObject(${i} , "listUsers")'>Supprimer</button>
            <button type="button" class="btn btn-success" onclick='editUser(${allUsers[i].id})'>Modifier</button>
            <button type="button" class="btn btn-info" onclick='userDetails(${allUsers[i].id})'>Afficher</button>
            </td>
        </tr>`;      
        }
    }
    
    usersTable +=`</tbody></table>`;
    document.getElementById('usersTableDiv').innerHTML = usersTable; 
}

//FONCTION AJOUTER UN NOUVEAU USER DANS ADMIN.HTML / ONGLET "GERER LES UTILISATEURS"
function addUser()
{
    var addForm = `
    <section class="contact_area section_gap_bottom">
    <div class="container">
        <div class="row"> 
            <div class="col-lg-12">
                <h3>Ajouter un Utilisateur</h3><br/>
                    <div class="col-md-6">
                        <div class="aa-login-form">
                            <div class="form-group">
                                <input type="text" id="fnameAdd" name="lname" placeholder="Entrez le nom">
                            </div>
                            <div>
                                <span id="fnameError"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="lnameAdd" name="fname" placeholder="Entrez le prénom">
                            </div>
                            <div>
                                <span id="lnameError"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="emailAdd" name="email" placeholder="Entrez l'email">
                            </div>
                            <div>
                                <span id="emailError"></span>
                            </div>
                            <div class="form-group">
                                <input type="password" id="pwdAdd" name="pwd" placeholder="Entrez le mot de passe">
                            </div>
                            <div>
                                <span id="pwdError"></span>
                            </div>
                            <div class="form-group">
                                <input type="password" id="cpwdAdd" name="cpwd" placeholder="Confirmez le mot de passe">
                            </div>
                            <div>
                                <span id="cpwdError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <button type="submit"  class="btn btn-danger"   onclick="cancelDiv('addUser')">Annuler</button>
                        <button type="submit"  class="btn btn-success" onclick="validateAddUser()">Valider</button>
                    </div>
            </div>
        </div>
    </div>
    </section><br/<br/>`;

    document.getElementById('addUser').innerHTML = addForm ;
}

//FONCTION VALIDER LE FORMULAIRE AJOUT UTILISATEUR DANS ADMIN.HTML
function validateAddUser()
{
    var newLname = document.getElementById('fnameAdd').value;
    var newFname = document.getElementById('lnameAdd').value;
    var newEmail = document.getElementById('emailAdd').value;
    var newPwd   = document.getElementById('pwdAdd').value;
    var newCpwd  = document.getElementById('cpwdAdd').value;

    var isValid = true;

    if(newLname === "")
    {
        document.getElementById('lnameError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(newFname === "")
    {
        document.getElementById('fnameError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(newEmail === "")
    {
        document.getElementById('emailError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(newPwd === "")
    {
        document.getElementById('pwdError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if (newPwd != newCpwd)
    {
        document.getElementById('cpwdError').innerHTML = "Les mots de passes ne sont pas identiques";
        isValid = false;
    }

    var allUsers = JSON.parse(localStorage.getItem('listUsers') || '[]');

    //Vérifier si le user existe ou non
    var userExist = false;

    for (var i = 0; i < allUsers.length; i++) 
    {
        if (allUsers[i].email === newEmail)
        {
            userExist = true;
        }
    }

    //Si utilisateur existe
    if(userExist)
    {
        document.getElementById('emailError').innerHTML = "Ce user existe déjà dans l'annuaire";
    }
    //Sinon
    else
    {
        if (isValid)
        {
           //Ajouter nouveau utilisateur
            var id = JSON.parse(localStorage.getItem('userId') || '1');
            var user ={
                id: id,
                firstName : newFname,
                lastName : newLname,
                email : newEmail,
                password : newPwd,
                confirmPassword : newCpwd,
                role : 'user'
            };

            allUsers.push(user);
            localStorage.setItem('userId', id + 1 );
            localStorage.setItem('listUsers', JSON.stringify(allUsers) );
            alert('Utilisateur Ajouté !');
            location.reload(); 
        }   
    }
}

//FONCTION MODIFIER UN UTILISATEUR AYANT LE IDENTIFIANT "id" 
function editUser(id)
{
    var user = searchById(id, 'listUsers');

    var editForm = `
    <div class="container">
        <div class="row"> 
            <div class="col-lg-12">
                <h3>Modifier un Utilisateur</h3><br/>
                    <div class="col-md-6">
                        <div class="aa-login-form">
                            <div class="form-group">
                                <input type="text" id="fnameEdit" name="fname" placeholder="Entrez le nom" value ="${user.firstName}">
                            </div>
                            <div>
                                <span id="fnameEditError"></span>
                            </div>
                            <div class="form-group">
                            <input type="text" id="lnameEdit" name="lname" placeholder="Entrez le prénom" value ="${user.lastName}">
                            </div>
                            <div>
                                <span id="lnameEditError"></span>
                            </div>
                            <div class="form-group">
                            <input type="text" id="emailEdit" name="email" placeholder="Entrez l'email" value ="${user.email}">
                            </div>
                            <div>
                                <span id="emailEditError"></span>
                            </div>
                            <div class="form-group">
                            <input type="text" id="pwdEdit" name="pwd" placeholder="Entrez le mot de passe" value ="${user.password}">
                            </div>
                            <div>
                                <span id="pwdEditError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <button type="submit"  class="btn btn-danger"   onclick="cancelDiv('editUser')">Annuler</button>
                        <button type="submit"  class="btn btn-success" onclick="validateEditUser(${user.id})">Valider</button>
                    </div>
            </div>
        </div>
    </div>
    <br/<br/>`;

    document.getElementById('editUser').innerHTML = editForm;
}

//FONCTION VALIDER LE FORMULAIRE MODIFIER UTILISATEUR DANS ADMIN.HTML
function validateEditUser(id)
{
    var users = JSON.parse(localStorage.getItem('listUsers'));
    var newFname = document.getElementById('fnameEdit').value;
    var newLname = document.getElementById('lnameEdit').value;
    var newEmail = document.getElementById('emailEdit').value;
    var newPwd = document.getElementById('pwdEdit').value;

    for (let i = 0; i < users.length; i++) 
    {
        if(users[i].id === id)
        {
            users[i].firstName = newFname;
            users[i].lastName = newLname;
            users[i].email = newEmail;
            users[i].password = newPwd;
        }
    }

    localStorage.setItem('listUsers' , JSON.stringify(users));
    alert('Utilisateur Modifié !');
    location.reload();
}

//FONCTION ENVOYER LES DETAILS D'UN UTILISATEUR VERS LA PAGE USER-DETAIL.HTML
function userDetails(id)
{
    var user = searchById(id, 'listUsers');
    localStorage.setItem('foundedUser', JSON.stringify(user));
    location.replace('user-detail.html');
}

//FONCTION AFFICHER LES DETAILS D'UN UTILISATEUR RECU DE ADMIN.HTML
function displayUserDetails()
{
    var user = JSON.parse(localStorage.getItem('foundedUser'));
    document.getElementById('firstName').innerHTML = user.firstName;
    document.getElementById('lastName').innerHTML = user.lastName;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('pwd').innerHTML = user.password;
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                       TOUTES LES FONCTIONS PRODUCTS                                  ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION AFFICHER LA LISTE DES PRODUITS DANS ADMIN.HTML
function displayProducts()
{
    var allProducts = JSON.parse(localStorage.getItem('listProducts'));
    var productsTable = 
    `<br/>
    <button type="button" class="btn btn-info" onclick='addProduct()'>Ajouter un nouveau produit</button><br/><br/>
    <div id="addProduct"></div>
    <table class="table" id="productsTable">
        <thead>
            <tr>
                <th>Nom Produit</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Categorie</th>
                <th>Photo</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;
        
    if (allProducts) //Vérifier si on a une liste de produits. Si liste vide (null) donc boucle for impossible
    {
        for (let i = 0; i < allProducts.length; i++) 
        {
            productsTable += `<tr>
            <td>${allProducts[i].productName}</td>
            <td>${allProducts[i].price}</td>
            <td>${allProducts[i].stock}</td>
            <td>${allProducts[i].category}</td>
            <td>${allProducts[i].photo}</td>
            <td>
            <button type="button" class="btn btn-danger" onclick='deleteObject(${i} , "listProducts")'>Supprimer</button>
            <button type="button" class="btn btn-success" onclick='editProduct(${allProducts[i].id})'>Modifier</button>
            <button type="button" class="btn btn-info" onclick='productDetails(${allProducts[i].id})'>Afficher</button>
            </td>
            </tr>`;
        }
    }
    
    productsTable +=`</tbody></table>`;

    document.getElementById('productsTableDiv').innerHTML = productsTable; 
                       
}

//FONCTION AJOUTER UN NOUVEAU PRODUIT DANS ADMIN.HTML / ONGLET "GERER LES PRODUITS"
function addProduct()
{
    var addForm = `
    <section class="contact_area section_gap_bottom">
    <div class="container">
        <div class="row"> 
            <div class="col-lg-12">
                <h3>Ajouter un Produit</h3><br/>
                    <div class="col-md-6">
                        <div class="aa-login-form">
                            <div class="form-group">
                                <input type="text" id="nameAdd" name="name" placeholder="Entrer le nom">
                            </div>
                            <div>
                                <span id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <select id="categoryAdd" name="category" style="width: 100%;">
                                    <option value='salé'>SALÉE</option>
                                    <option value='sucré'>SUCRÉE</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <input type="text" id="priceAdd" name="price" placeholder="Entrer le prix unitaire">
                            </div>
                            <div>
                                <span id="priceError"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="stockAdd" name="stock" placeholder="Entrer le stock disponible">
                            </div>
                            <div class="form-group">
                                <input type="file" id="photoAdd" name="photo">
                            </div>
                            <span id="stockError"></span>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <button type="submit"  class="btn btn-danger"   onclick="cancelDiv('addProduct')">Annuler</button>
                        <button type="submit"  class="btn btn-success" onclick="validateAddProduct()">Valider</button>
                    </div>
            </div>
        </div>
    </div>
    </section><br/<br/>`;

    document.getElementById('addProduct').innerHTML = addForm ;
}

//FONCTION VALIDER LE FORMULAIRE AJOUT PRODUIT DANS ADMIN.HTML
function validateAddProduct()
{
    var newName = document.getElementById('nameAdd').value;
    var newCategory = document.getElementById('categoryAdd').value;
    var newPrice = document.getElementById('priceAdd').value;
    var newStock = document.getElementById('stockAdd').value;
    var newPhoto = document.getElementById('photoAdd').value;
    console.log(newPhoto); // affiche : C://fakepath/image.jpeg
    newPhoto = replaceFakePath(newPhoto); //Replace fakepath avec chemin correct de l'image

    var isValid = true;

    if(newName === "")
    {
        document.getElementById('nameError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(newPrice === "")
    {
        document.getElementById('priceError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(newStock === "")
    {
        document.getElementById('stockError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    var allProducts = JSON.parse(localStorage.getItem('listProducts') || '[]');

    //Vérifier si le produit existe ou non
    var produitExist = false;

    for (var i = 0; i < allProducts.length; i++) 
    {
        if (allProducts[i].name === newName)
        {
            produitExist = true;
        }
    }

    //Si produit existe
    if(produitExist)
    {
        document.getElementById('nameError').innerHTML = "Ce produit existe déjà dans le stock";
    }
    //Sinon
    else
    {
        if (isValid)
        {
            newId = JSON.parse(localStorage.getItem('productId') || '1');
            //Ajouter nouveau produit
            var product = {
                id: newId,
                productName : newName,
                category : newCategory,
                price : newPrice,
                stock : newStock,
                photo : newPhoto
            };

            allProducts.push(product);
            localStorage.setItem('productId', newId + 1 );
            localStorage.setItem('listProducts', JSON.stringify(allProducts) );
            alert('Produit Ajouté !');
            location.reload(); 
        }   
    }
}

//FONCTION MODIFIER UN PRODUIT AYANT LE IDENTIFIANT "id" 
function editProduct(id)
{
    var product = searchById(id, 'listProducts');

    var editForm = `
    <div class="container">
        <div class="row"> 
            <div class="col-lg-12">
                <h3>Modifier un Produit</h3><br/>
                    <div class="col-md-6">
                        <div class="aa-login-form">
                            <div class="form-group">
                                <input type="text" id="nameEdit" name="name" placeholder="Entrer le nom" value ="${product.productName}">
                            </div>
                            <div>
                                <span id="nameEditError"></span>
                            </div>
                            <div class="form-group">
                                <select id="categoryEdit" name="category" value ="${product.category}" style="width: 100%;">
                                    <option value='salé'>SALÉE</option>
                                    <option value='sucré'>SUCRÉE</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <input type="text" id="priceEdit" name="price" placeholder="Entrer le prix unitaire" value ="${product.price}">
                            </div>
                            <div>
                                <span id="priceEditError"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="stockEdit" name="stock" placeholder="Entrer le stock disponible" value ="${product.stock}">
                            </div>
                            <div class="form-group">
                                <input type="file" id="photoEdit" name="photo" value ="${product.photo}">
                            </div>
                            <span id="stockEditError"></span>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <button type="submit"  class="btn btn-danger"   onclick="cancelDiv('editProduct')">Annuler</button>
                        <button type="submit"  class="btn btn-success" onclick="validateEditProduct(${product.id})">Valider</button>
                    </div>
            </div>
        </div>
    </div>
    <br/<br/>`;

    document.getElementById('editProduct').innerHTML = editForm;
}

//FONCTION VALIDER LE FORMULAIRE MODIFIER PRODUIT DANS ADMIN.HTML
function validateEditProduct(id)
{
    var products = JSON.parse(localStorage.getItem('listProducts'));
    var newName = document.getElementById('nameEdit').value;
    var newCategory = document.getElementById('categoryEdit').value;
    var newPrice = document.getElementById('priceEdit').value;
    var newStock = document.getElementById('stockEdit').value;
    var newPhoto = document.getElementById('photoEdit').value;
    newPhoto = replaceFakePath(newPhoto); //Replace fakepath with correct image full path

    for (let i = 0; i < products.length; i++) 
    {
        if(products[i].id === id)
        {
            products[i].productName = newName;
            products[i].category = newCategory;
            products[i].price = newPrice;
            products[i].stock = newStock;
            products[i].photo = newPhoto;
        }
    }

    localStorage.setItem('listProducts' , JSON.stringify(products));
    alert('Produit Modifié !');
    location.reload();
}

//FONCTION ENVOYER LES DETAILS D'UN PRODUIT VERS LA PAGE PRODUCT-DETAIL.HTML
function productDetails(id)
{
    var product = searchById(id, 'listProducts');
    localStorage.setItem('foundedProduct', JSON.stringify(product));
    location.replace('product-detail.html');
}

//FONCTION AFFICHER LES DETAILS D'UN PRODUIT RECU DE ADMIN.HTML
function displayProductDetails()
{
    var product = JSON.parse(localStorage.getItem('foundedProduct'));
    document.getElementById('productName').innerHTML = product.productName;
    document.getElementById('price').innerHTML = product.price;
    document.getElementById('stock').innerHTML = product.stock;
    document.getElementById('category').innerHTML = product.category;
}

//FONCTION REMPLACER FAKEPATH DANS URL IMAGE PAR PATH CORRECT
function replaceFakePath(path)
{
    var newPath = path.replace(/\\/g, "/"); //WIN PATH TO WEB PATH - newPath <-- remplacer dans "path" tous les "\" par "/"
    var res = newPath.replace("fakepath", "Users/haythem.chaoued.DAVIDSON-IDF.000/Downloads/tunisiashop4/img/products"); // res <-- replacer dans newpath "fakepath" par chemin correct
    res = "file://" + res; //Ajouter le protocol file dans le web path pour afficher les images
    return res;
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                           TOUTES LES FONCTIONS ORDERS                                ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION POUR AFFICHER LA LISTE DES COMMANDES DANS ADMIN.HTML
function displayOrders()
{
    var allValidatedOrders = JSON.parse(localStorage.getItem('listValidatedOrders'));

    ordersTable = 
    `<br/>
    <table id="usersTable" class="table">
    <thead>
    <tr>
        <th></th>
        <th>Liste produits</th>
        <th>Nom Utilisateur</th>
        <th>Email Utilisateur</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>`;

    if (allValidatedOrders) //Vérifier si on a une liste des commandes. Si liste vide (null) donc boucle for impossible
    {

        for (let i = 0; i < allValidatedOrders.length; i++) 
        {
            var element = allValidatedOrders[i];
            var listProducts = generateListProducts(allValidatedOrders[i]);
            
            for (let j = 0; j < element.length; j++) 
            {
                var user = searchById(element[j].idUser, 'listUsers');
            } 
            
            ordersTable += `<tr>
            <td>${i}</td>
            <td>${listProducts}</td>
            <td>${user.firstName + " " + user.lastName}</td>
            <td>${user.email}</td>
            <td>
            <button type="button" class="btn btn-info" onclick='endOrder(${i})'>Valider</button>
            </td>
            </tr>`;
        }

    }

    ordersTable +=`</tbody></table>`;
    document.getElementById('ordersTableDiv').innerHTML = ordersTable; 
}

//FONCTION POUR GENERER HTML CONTENANT LISTE DES PRODUITS PAR COMMANDE
function generateListProducts (element)
{
    var htmlProducts = "<ul>";

    for (let i = 0; i < element.length; i++) 
    {
        product = searchById(element[i].idProduct, 'listProducts')
        htmlProducts += "<li> Nom : "+product.productName+" [Quanité : "+element[i].quantity+"]</li>";
    }

    htmlProducts += "</ul>";
    
    return htmlProducts;
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                          TOUTES LES FONCTIONS CART                                   ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/

//FONCTION POUR AJOUTER UN PRODUIT DANS LE PANIER
function addToCart(idProduct)
{
    var connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    var searchedProduit = searchById(Number(idProduct), 'listProducts');
    var quantity = document.getElementById('qty-'+idProduct).value;
    
    if ( (quantity > 0) && (quantity <= searchedProduit.stock) )
    {
        var allOrders = JSON.parse(localStorage.getItem('listOrders') || '[]');
        var idOrder = JSON.parse(localStorage.getItem('orderId') || '1');
        var order = 
        {
            id:idOrder,
            quantity: quantity,
            idProduct : idProduct,
            idUser: connectedUser.id
        };

        allOrders.push(order);
        localStorage.setItem('orderId', idOrder + 1);
        localStorage.setItem('listOrders', JSON.stringify(allOrders));

        var allProducts = JSON.parse(localStorage.getItem('listProducts'));

        for (let i = 0; i < allProducts.length; i++) 
        {
            if(allProducts[i].id == Number(idProduct))
            {
                allProducts[i].stock = Number(allProducts[i].stock) - Number(quantity);
            } 
        }

        localStorage.setItem('listProducts', JSON.stringify(allProducts));
        alert('Produit ajouté au panier !');
    }
    else
    {
        document.getElementById('qtyError-'+idProduct).innerHTML = 'Quantité choisie est pas disponible dans le stock';
        document.getElementById('qtyError-'+idProduct).style.color= 'red';
    }

}

//FONCTION POUR AFFICHER LE PANIER DANS LA PAGE CART.HTML
function displayCart()
{
    var connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    var allOrders = JSON.parse(localStorage.getItem('listOrders') || '[]'); // --> 'listOrders' liste de paniers : contient tous les paniers de tous les utilisateurs
    var myOrder = []; //Tableau pour stocker mon panier incluant les produits réservés 
    
    for (let i = 0; i < allOrders.length; i++) 
    {
        if(allOrders[i].idUser === connectedUser.id) //filtrer que le(s) panier(s) de l'utilisateur connecté (id)
        {
            myOrder.push(allOrders[i]);
        }
     }

     if ( (allOrders.length == 0) || (myOrder.length == 0) )
     {
        var orderTable = '<br/><br/><center><h1> VOTRE PANIER EST VIDE</h1></center><br/><br/><br/><br/><br/><br/><br/><br/>';
     }
     else
     {
         
        var orderTable =`<div class="cart-view-table">
                        <div class="table-responsive">
                        <table class="table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>`;
        
        var somme = 0; 
        for (let i = 0; i < myOrder.length; i++) 
        {
            
            var product = searchById(Number(myOrder[i].idProduct), 'listProducts');
            
            var totalPrice = Number(product.price) * Number(myOrder[i].quantity);
            somme = somme + totalPrice; //somme += totalPrice
            
            orderTable += `
                        <tr>
                            <td><a href="#"><img src="${product.photo}" alt="img"></a></td>
                            <td><a class="aa-cart-title" href="#">${product.productName}</a></td>
                            <td>${product.price} TND</td>
                            <td><input class="aa-cart-quantity" type="number" value="${myOrder[i].quantity}"></td>
                            <td>${totalPrice} TND</td>
                            <td>
                            <button type="button" class="btn btn-danger" onclick="deleteOrder(${searchOrderPosition(myOrder[i].id, 'listOrders')}, ${myOrder[i].id})">Supprimer</button>
                            </td>
                        </tr>`;
        }

        orderTable += `</tbody>
                        </table>
                        </div>`;

        orderTable += `<!-- Cart Total view -->
                        <div class="cart-view-total">
                        <h4>Ma Commande</h4>
                        <table class="aa-totals-table">
                            <tbody>
                            <tr>
                                <th>Total</th>
                                <td>${somme} TND</td>
                            </tr>
                            </tbody>
                        </table>
                        <a  class="aa-cart-view-btn" onclick="ValidateOrder(${connectedUser.id})">Payer Ma Commande</a>
                        </div>
                    </div>`;
    }

document.getElementById('orderTable').innerHTML = orderTable;

}

//FONCTION POUR VALIDER UN PANIER 
function ValidateOrder (idUser)
{
    var allOrders = JSON.parse(localStorage.getItem('listOrders'));
    var myOrder = []; //Tableau pour stocker mon panier incluant les produits réservés 

    for (let i = 0; i < allOrders.length; i++) 
    {
        if (allOrders[i].idUser === idUser)
        {
            myOrder.push(allOrders[i]);
        }
    }

    allOrders = allOrders.filter(function(item) {
        return item.idUser !== idUser
    });

    var validatedOrderId = JSON.parse(localStorage.getItem('validatedOrderId') || '1');
    var allValidatedOrders = JSON.parse(localStorage.getItem('listValidatedOrders') || '[]');
    allValidatedOrders.push(myOrder);
    localStorage.setItem('validatedOrderId', validatedOrderId + 1);
    localStorage.setItem('listValidatedOrders', JSON.stringify(allValidatedOrders));

    var idOrder = JSON.parse(localStorage.getItem('orderId') || '1');
    localStorage.setItem('orderId', idOrder - myOrder.length);
    localStorage.setItem('listOrders', JSON.stringify(allOrders));

    alert('Merci ! Commande enregistrée.');

    location.replace("index.html");
}

//FONCTION POUR SUPPRIMER UNE COMMANDE D'UN PANIER DANS LA PAGE CART.HTML
function deleteOrder(pos, id)
{
    var order = searchById(Number(id), 'listOrders'); 
    var qty = order.quantity;
    var products = JSON.parse(localStorage.getItem('listProducts'));
    for (let i = 0; i < products.length; i++) 
    {
        if(products[i].id == order.idProduct)
        {
            products[i].stock += Number(qty)
        }
    }
    localStorage.setItem('listProducts', JSON.stringify(products));
    deleteObject(pos, 'listOrders')
}

//FONCTION POUR CHERCHER LA POSITON D'UNE COMMANDE DANS LA LISTE 
function searchOrderPosition(id, clé) 
{
    var objects = JSON.parse(localStorage.getItem(clé) || "[]");
    var pos;
    for (let i = 0; i < objects.length; i++) 
    {
        if (objects[i].id == id) 
        {
            pos = i;
        }
    }
    return pos;
}


/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************                         TOUTES LES FONCTIONS CONTACT                                 ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/


//FONCTION ENVOYER UN MESSAGE A L'ADMIN DANS CONTACT.HTML
function sendMessage()
{
    subject = document.getElementById('subject').value;
    message = document.getElementById('msg').value;
    email = document.getElementById('contactEmail').value;

    var isValid = true;

    if(subject === "")
    {
        document.getElementById('subjectError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if(message === "")
    {
        document.getElementById('messageError').innerHTML = "Ce champs est obligatoire";
        isValid = false;
    }

    if (isValid)
    {
        var allMessages = JSON.parse(localStorage.getItem('listMessages') || '[]');
        var idMsg = JSON.parse(localStorage.getItem('msgId') || '1');
        var message = 
        {
            id:idMsg,
            subject: subject,
            email : email,
            message: message
        };
    

        // Format JSON : {"id":1,"subject":"test"} --> sous forme de {"cle1":"valeur1", "cle2":"valeur2", ...}
        // JSON.PARSE : CONVERTIR DE :  STRING --> JSON
        // JSON.STRINGIFY : CONVERTIR DE :  JSON --> STRING
        // SI var de type JSON : object.element retourne valeur
        // SI var de type STRING : var != object.element

        allMessages.push(message);
        localStorage.setItem('msgId', idMsg + 1);
        localStorage.setItem('listMessages', JSON.stringify(allMessages));
        alert('Message envoyé !');
        location.reload(); 
    }
}

//FONCTION AFFICHER LA LISTE DES PRODUITS DANS INBOX.HTML
function displayMessages()
{
    var allMessages = JSON.parse(localStorage.getItem('listMessages'));
    var messagesTable = 
    `<br/>
    <table class="table" id="MessageTable">
        <thead>
            <tr>
                <th>Expéditeur</th>
                <th>Sujet</th>
                <th>Message</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;
        
    //if (null) est équivalent à if (false)
    //allMessages est une liste de message. Un message est un objet donc contient (email, subject, message)
    //Chaque case de la liste allMessage est un objet --> allMessages[i]

    if (allMessages) //Vérifier si on a une liste de produits. Si liste vide (null) donc boucle for impossible
    {
        for (let i = 0; i < allMessages.length; i++) 
        {
            messagesTable += `<tr>
            <td>${allMessages[i].email}</td>
            <td>${allMessages[i].subject}</td>
            <td>${allMessages[i].message}</td>
            <td>
            <button type="button" class="btn btn-info" onclick='answerMessage(${allMessages[i].id})'>Répondre</button>
            </td>
            </tr>`;
        }
    }
    
    messagesTable +=`</tbody></table>`;

    document.getElementById('messagesTableDiv').innerHTML = messagesTable; 
                       
}

//FONCTION REPONDRE A UN MESSAGE RECU PAR UN UTILISATEUR DANS INBOX.HTML
function answerMessage(id)
{
    var message = searchById(id, 'listMessages');

    var answerMsg = 
    `<div class="col-md-12 form-group">
    <input type="text" class="form-control" id="subject"  placeholder="Subject" value="RE : ${message.subject}" disabled="true">
        <span id="newPriceError"></span>
    </div>
    <div class="col-md-12 form-group">
        <input type="text" class="form-control" id="emailRec" placeholder="Email"  value=${message.email} disabled="true" >
        <span id="newStockError"></span>
    </div>
    <div class="col-md-12 form-group">
        <textarea class="form-control" name="message" id="msg" rows="1" placeholder="Tapez Message" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter Message'"></textarea>
        <span id="messageError"></span>
    </div>
    <div class="col-md-12 form-group">
        <button type="submit" value="submit" class="primary-btn" onclick="validateAnswerMessage(${message.id})">Envoyer</button>
    </div>`;

    document.getElementById('answerMsg').innerHTML = answerMsg;
}

//FONCTION VALIDER REPONSE MESSAGE DANS INBOX.HTML
function validateAnswerMessage(id)
{
    var allMessages = JSON.parse(localStorage.getItem('listMessages'));

    for (let i = 0; i < allMessages.length; i++) 
    {
        if (allMessages[i].id == id) 
        {
            pos = i;
        }
    }

    allMessages.splice(pos, 1); //Supprimer le message
    localStorage.setItem('listMessages', JSON.stringify(allMessages));
    alert('Message envoyé !');
    location.reload(); 
}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************               FONCTIONS AFFICHAGE PRODUITS SALEES / SUCRES                           ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/


//FONCTION AFFICHER LA LISTE DES PRODUITS SALEES DANS EP-SALEE.HTML
function displayListeSLProducts()
{
 
    var allProducts = JSON.parse(localStorage.getItem('listProducts') || '[]');
    var slProducts = new Array();; 

    for (let i = 0 ; i < allProducts.length; i++)
    {
        if (allProducts[i].category === 'salé')
        {
            slProducts.push(allProducts[i]);
        }
    } 
    
    var productsImg = "";

    if ( (allProducts.length == 0) || (slProducts.length == 0) )
    {
        productsImg = '<br/><br/><center><h1> LA LISTE DES PRODUITS SALES EST VIDE</h1></center><br/><br/><br/><br/><br/><br/><br/>';
    }
    else
    {
        var productsImg = '<ul class="aa-product-catg">';
        
        for (let i = 0; i < slProducts.length; i++) 
        {
            productsImg += 
            `<li>
                <figure>
                    <a class="aa-product-img" href="#"><img width="150" height="150" src="${slProducts[i].photo}"></a>
                    <figcaption>
                        <h4 class="aa-product-title"><a href="#">${slProducts[i].productName}</a></h4>
                        <span class="aa-product-price">${slProducts[i].price} TND</span>
                        <span class="aa-product-qty"><input class="aa-cart-quantity" type="number" value="1" id="qty-${slProducts[i].id}"></span>
                    </figcaption>
                    <a class="aa-add-card-btn" onclick='addToCart(${slProducts[i].id})'><span class="fa fa-shopping-cart"></span>Ajouter au panier</a>
                </figure>        
                <span class="error-span" id='qtyError-${slProducts[i].id}'></span>               
                </li>`; 
        }
        
        productsImg += '</ul>';
    }
   
    document.getElementById('slproductsDiv').innerHTML = productsImg; 

}

//FONCTION AFFICHER LA LISTE DES PRODUITS SUCRES DANS EP-SUCREE.HTML
function displayListeSCProducts()
{
 
    var allProducts = JSON.parse(localStorage.getItem('listProducts') || '[]');
    var scProducts = new Array();; 

    for (let i = 0 ; i < allProducts.length; i++)
    {
        if (allProducts[i].category === 'sucré')
        {
            scProducts.push(allProducts[i]);
        }
    } 

    var productsImg = "";
    
    if ( (allProducts.length == 0) || (scProducts.length == 0) )
    {
        productsImg = '<br/><br/><center><h1> LA LISTE DES PRODUITS SUCRES EST VIDE</h1></center><br/><br/><br/><br/><br/><br/><br/>';
    }
    else
    {
        var productsImg = '<ul class="aa-product-catg">';

        for (let i = 0; i < scProducts.length; i++) 
        {
            productsImg += 
            `<li>
                <figure>
                    <a class="aa-product-img" href="#"><img width="150" height="150" src="${scProducts[i].photo}"></a>
                    <figcaption>
                        <h4 class="aa-product-title"><a href="#">${scProducts[i].productName}</a></h4>
                        <span class="aa-product-price">${scProducts[i].price} TND</span>
                        <span class="aa-product-qty"><input class="aa-cart-quantity" type="number" value="1" id="qty-${scProducts[i].id}"></span>
                    </figcaption>
                    <a class="aa-add-card-btn" onclick='addToCart(${scProducts[i].id})'><span class="fa fa-shopping-cart"></span>Ajouter au panier</a>
                </figure>        
                <span class="error-span" id='qtyError-${scProducts[i].id}'></span>               
                </li>`; 
        }

        productsImg += '</ul>';

    }
    
    document.getElementById('scproductsDiv').innerHTML = productsImg; 

}

/***********************************************************************************************************************************/
//**********************************************************************************************************************************/


/***********************************************************************************************************************************/
//********************                                                                                      ************************/
//********************            TOUTES LES FONCTIONS COMMUNES ENTRE USERS ET PRODUCTS ET CART             ************************/
//********************                                                                                      ************************/
//**********************************************************************************************************************************/


//FONCTION CACHER LE FORMULAIRE AJOUT PRODUIT / UTILISITEUR DANS ADMIN.HTML
function cancelDiv(div)
{
    document.getElementById(div).innerHTML = '';
}
 
//FONCTION SUPPRIMER UN ELEMENT à LA POSITION "POS" DE LA LISTE AYANT LE NOM "CLE" --> CLE peut être "listUsers" ou "listProducts"
function deleteObject(pos, cle)
{
    var objects = JSON.parse(localStorage.getItem(cle) || '[]'); // Exemple avec le localstorage cle = listMessage --> var objects = getItem('listMessages') // 5
    objects.splice(pos , 1);// delete un element selon sa position // splice(1,1) // 4
    localStorage.setItem(cle, JSON.stringify(objects)); // etItem('listMessages', JSON.stringify(objects)) // 4
    location.reload();//actualiser
}

//FUNCTION CHERCHER UN ELEMENT AYANT L'IDENTIFICANT "id" DANS LA LISTE AYANT LE NOM "list"
function searchById(id, list)
{
    var listElements = JSON.parse(localStorage.getItem(list));
    var element;
    for(var i=0 ; i< listElements.length ; i++)
    {
        if (listElements[i].id === id ){
            element = listElements[i];
        }
    }
    return element;
}

//FUNCTION VALIDER SI EMAIL EST CORRECT
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}