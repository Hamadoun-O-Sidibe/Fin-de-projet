
/* =========================================================
   MENU MOBILE
========================================================= */

const menuToggle = document.querySelector("#menu-toggle");
const navItems = document.querySelector("#nav-links");

if (menuToggle && navItems) {
    menuToggle.addEventListener("click", () => {
        navItems.classList.toggle("active");
    });

    // Fermer le menu après avoir cliqué sur un lien
    document.querySelectorAll(".nav-items a").forEach((link) => {
        link.addEventListener("click", () => {
            navItems.classList.remove("active");
        });
    });
}


/* =========================================================
   RECHERCHE + FILTRES
========================================================= */

const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const bookCards = document.querySelectorAll(".livre-card");
const noResults = document.querySelector("#no-results");

let currentFilter = "all";

function filterBooks() {
    const searchValue = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    let visibleBooks = 0;

    bookCards.forEach((book) => {
        const title = (book.dataset.title || "").toLowerCase();
        const category = (book.dataset.category || "").toLowerCase();

        const matchesSearch = title.includes(searchValue);

        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;

        if (matchesSearch && matchesFilter) {
            book.style.display = "";
            visibleBooks++;
        } else {
            book.style.display = "none";
        }
    });

    if (noResults) {
        noResults.style.display =
            visibleBooks === 0 ? "block" : "none";
    }
}

if (searchInput) {
    searchInput.addEventListener("input", filterBooks);
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter || "all";

        filterBooks();
    });
});


/* =========================================================
   FAVORIS
========================================================= */

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (!icon) return;

        if (button.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });
});


/* =========================================================
   PANIER
========================================================= */

const cart = [];

const cartButton = document.querySelector("#cart-btn");
const cartOverlay = document.querySelector("#cart-overlay");
const closeCart = document.querySelector("#close-cart");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");

/*
 * Ton HTML utilise #cart-total.
 * L'ancien JS utilisait #cart-total-price.
 * On prend les deux pour éviter une erreur.
 */
const cartTotal =
    document.querySelector("#cart-total") ||
    document.querySelector("#cart-total-price");


/* Ajouter un livre au panier */

document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const title = button.dataset.title || "Livre";
        const price = Number(button.dataset.price) || 0;

        cart.push({
            title,
            price
        });

        updateCart();

        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }
    });
});


/* Mettre à jour le panier */

function updateCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Votre panier est vide.
            </p>
        `;
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");

            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div>
                    <strong>${escapeHTML(item.title)}</strong>

                    <p>
                        ${item.price.toLocaleString("fr-FR")} FCFA
                    </p>
                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    aria-label="Supprimer ${escapeHTML(item.title)}"
                    type="button"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            cartItems.appendChild(cartItem);
        });
    }

    /* Nombre de livres */

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    /* Calcul du total */

    const total = cart.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    if (cartTotal) {
        cartTotal.textContent =
            `${total.toLocaleString("fr-FR")} FCFA`;
    }

    /* Boutons supprimer */

    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            if (!Number.isNaN(index)) {
                cart.splice(index, 1);
                updateCart();
            }
        });
    });
}


/* Ouvrir le panier */

if (cartButton && cartOverlay) {
    cartButton.addEventListener("click", () => {
        cartOverlay.classList.add("active");
    });
}


/* Fermer le panier */

if (closeCart && cartOverlay) {
    closeCart.addEventListener("click", () => {
        cartOverlay.classList.remove("active");
    });
}


/* Fermer le panier en cliquant à l'extérieur */

if (cartOverlay) {
    cartOverlay.addEventListener("click", (event) => {
        if (event.target === cartOverlay) {
            cartOverlay.classList.remove("active");
        }
    });
}


/* =========================================================
   COMMANDER
========================================================= */

const checkoutButton = document.querySelector("#checkout-btn");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Votre panier est vide.");
            return;
        }

        alert(
            "Merci pour votre commande ! Cette fonctionnalité est une démonstration."
        );
    });
}


/* =========================================================
   FORMULAIRE DE CONTACT
========================================================= */

const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name =
            document.querySelector("#nom")?.value.trim() || "";

        const email =
            document.querySelector("#email")?.value.trim() || "";

        const message =
            document.querySelector("#message")?.value.trim() || "";

        /* Vérification des champs */

        if (!name || !email || !message) {
            if (formMessage) {
                formMessage.textContent =
                    "Veuillez remplir tous les champs.";

                formMessage.style.color = "#d33";
            }

            return;
        }

        /* Vérification de l'email */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            if (formMessage) {
                formMessage.textContent =
                    "Veuillez entrer une adresse email valide.";

                formMessage.style.color = "#d33";
            }

            return;
        }

        /* Message de succès */

        if (formMessage) {
            formMessage.textContent =
                `Merci ${name} ! Votre message a bien été envoyé.`;

            formMessage.style.color = "green";
        }

        contactForm.reset();
    });
}


/* =========================================================
   AUTHENTIFICATION
========================================================= */

/*
 * ATTENTION :
 *
 * Cette version utilise localStorage.
 *
 * Elle convient pour :
 * - un projet scolaire
 * - une démonstration
 * - un prototype
 *
 * Elle ne convient PAS à une vraie authentification
 * de production car les données sont stockées côté navigateur.
 */


/* ---------------------------------------------------------
   ÉLÉMENTS HTML
--------------------------------------------------------- */

const loginButton = document.querySelector("#login-btn");
const signupButton = document.querySelector("#signup-btn");

const authOverlay = document.querySelector("#auth-overlay");
const closeAuth = document.querySelector("#close-auth");

const loginContainer = document.querySelector("#login-container");
const signupContainer = document.querySelector("#signup-container");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const showSignup = document.querySelector("#show-signup");
const showLogin = document.querySelector("#show-login");

const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");


/* ---------------------------------------------------------
   CLÉS LOCALSTORAGE
--------------------------------------------------------- */

const USERS_STORAGE_KEY = "andal_users";
const CURRENT_USER_STORAGE_KEY = "andal_current_user";


/* ---------------------------------------------------------
   RÉCUPÉRER LES UTILISATEURS
--------------------------------------------------------- */

function getUsers() {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);

        if (!users) {
            return [];
        }

        const parsedUsers = JSON.parse(users);

        return Array.isArray(parsedUsers)
            ? parsedUsers
            : [];

    } catch (error) {
        console.error(
            "Impossible de récupérer les utilisateurs :",
            error
        );

        return [];
    }
}


/* ---------------------------------------------------------
   SAUVEGARDER LES UTILISATEURS
--------------------------------------------------------- */

function saveUsers(users) {
    localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
    );
}


/* ---------------------------------------------------------
   UTILITAIRE : ÉCHAPPER LE HTML
--------------------------------------------------------- */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ---------------------------------------------------------
   OUVRIR LE MODAL
--------------------------------------------------------- */

function openAuth() {
    if (!authOverlay) return;

    authOverlay.classList.add("active");

    document.body.classList.add("auth-open");
}


/* ---------------------------------------------------------
   FERMER LE MODAL
--------------------------------------------------------- */

function closeAuthModal() {
    if (!authOverlay) return;

    authOverlay.classList.remove("active");

    document.body.classList.remove("auth-open");

    clearAuthMessages();
}


/* ---------------------------------------------------------
   AFFICHER LA CONNEXION
--------------------------------------------------------- */

function showLoginForm() {
    if (loginContainer) {
        loginContainer.style.display = "block";
    }

    if (signupContainer) {
        signupContainer.style.display = "none";
    }

    clearAuthMessages();
}


/* ---------------------------------------------------------
   AFFICHER L'INSCRIPTION
--------------------------------------------------------- */

function showSignupForm() {
    if (loginContainer) {
        loginContainer.style.display = "none";
    }

    if (signupContainer) {
        signupContainer.style.display = "block";
    }

    clearAuthMessages();
}


/* ---------------------------------------------------------
   EFFACER LES MESSAGES
--------------------------------------------------------- */

function clearAuthMessages() {
    if (loginMessage) {
        loginMessage.textContent = "";
        loginMessage.removeAttribute("style");
    }

    if (signupMessage) {
        signupMessage.textContent = "";
        signupMessage.removeAttribute("style");
    }
}


/* ---------------------------------------------------------
   AFFICHER UN MESSAGE
--------------------------------------------------------- */

function displayAuthMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;

    if (type === "success") {
        element.style.color = "green";
    } else {
        element.style.color = "#d33";
    }
}


/* ---------------------------------------------------------
   VALIDATION EMAIL
--------------------------------------------------------- */

function isValidEmail(email) {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}


/* ---------------------------------------------------------
   INSCRIPTION
--------------------------------------------------------- */

if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name =
            document.querySelector("#signup-name")?.value.trim() || "";

        const email =
            document.querySelector("#signup-email")?.value.trim().toLowerCase() || "";

        const password =
            document.querySelector("#signup-password")?.value || "";

        const confirmPassword =
            document.querySelector("#signup-confirm-password")?.value || "";


        /* Validation du nom */

        if (!name) {
            displayAuthMessage(
                signupMessage,
                "Veuillez entrer votre nom.",
                "error"
            );

            return;
        }


        /* Validation de l'email */

        if (!email) {
            displayAuthMessage(
                signupMessage,
                "Veuillez entrer votre adresse email.",
                "error"
            );

            return;
        }


        if (!isValidEmail(email)) {
            displayAuthMessage(
                signupMessage,
                "Veuillez entrer une adresse email valide.",
                "error"
            );

            return;
        }


        /* Validation du mot de passe */

        if (password.length < 6) {
            displayAuthMessage(
                signupMessage,
                "Le mot de passe doit contenir au moins 6 caractères.",
                "error"
            );

            return;
        }


        /* Confirmation du mot de passe */

        if (password !== confirmPassword) {
            displayAuthMessage(
                signupMessage,
                "Les mots de passe ne correspondent pas.",
                "error"
            );

            return;
        }


        /* Récupérer les utilisateurs */

        const users = getUsers();


        /* Vérifier si l'email existe déjà */

        const existingUser = users.find(
            (user) => user.email === email
        );

        if (existingUser) {
            displayAuthMessage(
                signupMessage,
                "Un compte existe déjà avec cette adresse email.",
                "error"
            );

            return;
        }


        /* Créer le compte */

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };


        users.push(newUser);

        saveUsers(users);


        /* Message de succès */

        displayAuthMessage(
            signupMessage,
            "Votre compte a été créé avec succès.",
            "success"
        );


        /* Réinitialiser le formulaire */

        signupForm.reset();


        /*
         * Passer automatiquement à la connexion
         * après un court délai.
         */

        setTimeout(() => {
            showLoginForm();

            const loginEmail =
                document.querySelector("#login-email");

            if (loginEmail) {
                loginEmail.value = email;
                loginEmail.focus();
            }

            displayAuthMessage(
                loginMessage,
                "Compte créé. Vous pouvez maintenant vous connecter.",
                "success"
            );
        }, 1000);
    });
}


/* ---------------------------------------------------------
   CONNEXION
--------------------------------------------------------- */

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email =
            document.querySelector("#login-email")?.value.trim().toLowerCase() || "";

        const password =
            document.querySelector("#login-password")?.value || "";


        /* Vérification des champs */

        if (!email || !password) {
            displayAuthMessage(
                loginMessage,
                "Veuillez remplir tous les champs.",
                "error"
            );

            return;
        }


        /* Vérification de l'email */

        if (!isValidEmail(email)) {
            displayAuthMessage(
                loginMessage,
                "Veuillez entrer une adresse email valide.",
                "error"
            );

            return;
        }


        /* Récupérer les utilisateurs */

        const users = getUsers();


        /* Rechercher le compte */

        const user = users.find(
            (item) =>
                item.email === email &&
                item.password === password
        );


        /* Identifiants incorrects */

        if (!user) {
            displayAuthMessage(
                loginMessage,
                "Email ou mot de passe incorrect.",
                "error"
            );

            return;
        }


        /* Créer la session */

        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        localStorage.setItem(
            CURRENT_USER_STORAGE_KEY,
            JSON.stringify(currentUser)
        );


        /* Message */

        displayAuthMessage(
            loginMessage,
            `Bienvenue ${user.name} !`,
            "success"
        );


        /* Réinitialiser */

        loginForm.reset();


        /*
         * Fermer le modal après connexion
         */

        setTimeout(() => {
            closeAuthModal();
            updateAuthUI();
        }, 700);
    });
}


/* ---------------------------------------------------------
   AFFICHER LE FORMULAIRE D'INSCRIPTION
--------------------------------------------------------- */

if (showSignup) {
    showSignup.addEventListener("click", () => {
        showSignupForm();
    });
}


/* ---------------------------------------------------------
   AFFICHER LE FORMULAIRE DE CONNEXION
--------------------------------------------------------- */

if (showLogin) {
    showLogin.addEventListener("click", () => {
        showLoginForm();
    });
}


/* ---------------------------------------------------------
   BOUTON "SE CONNECTER"
--------------------------------------------------------- */

if (loginButton) {
    loginButton.addEventListener("click", () => {
        showLoginForm();
        openAuth();
    });
}


/* ---------------------------------------------------------
   BOUTON "S'INSCRIRE"
--------------------------------------------------------- */

if (signupButton) {
    signupButton.addEventListener("click", () => {
        showSignupForm();
        openAuth();
    });
}


/* ---------------------------------------------------------
   FERMER L'AUTHENTIFICATION
--------------------------------------------------------- */

if (closeAuth) {
    closeAuth.addEventListener("click", () => {
        closeAuthModal();
    });
}


/* ---------------------------------------------------------
   FERMER EN CLIQUANT À L'EXTÉRIEUR
--------------------------------------------------------- */

if (authOverlay) {
    authOverlay.addEventListener("click", (event) => {
        if (event.target === authOverlay) {
            closeAuthModal();
        }
    });
}


/* ---------------------------------------------------------
   FERMER AVEC LA TOUCHE ÉCHAP
--------------------------------------------------------- */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (
            authOverlay &&
            authOverlay.classList.contains("active")
        ) {
            closeAuthModal();
        }

        if (
            cartOverlay &&
            cartOverlay.classList.contains("active")
        ) {
            cartOverlay.classList.remove("active");
        }
    }
});


/* ---------------------------------------------------------
   RÉCUPÉRER L'UTILISATEUR CONNECTÉ
--------------------------------------------------------- */

function getCurrentUser() {
    try {
        const user = localStorage.getItem(
            CURRENT_USER_STORAGE_KEY
        );

        if (!user) {
            return null;
        }

        return JSON.parse(user);

    } catch (error) {
        console.error(
            "Impossible de récupérer la session :",
            error
        );

        return null;
    }
}


/* ---------------------------------------------------------
   DÉCONNEXION
--------------------------------------------------------- */

function logout() {
    localStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );

    updateAuthUI();

    alert("Vous êtes maintenant déconnecté.");
}


/* ---------------------------------------------------------
   METTRE À JOUR L'INTERFACE
--------------------------------------------------------- */

function updateAuthUI() {
    const currentUser = getCurrentUser();

    /*
     * Si aucun utilisateur n'est connecté,
     * on garde les boutons normaux.
     */

    if (!currentUser) {
        if (loginButton) {
            loginButton.textContent = "Se connecter";
            loginButton.style.display = "";
        }

        if (signupButton) {
            signupButton.textContent = "S'inscrire";
            signupButton.style.display = "";
        }

        return;
    }


    /*
     * Utilisateur connecté :
     *
     * On transforme le bouton inscription
     * en bouton de déconnexion.
     */

    if (loginButton) {
        loginButton.textContent =
            `Bonjour ${currentUser.name}`;

        loginButton.disabled = true;
        loginButton.style.cursor = "default";
    }

    if (signupButton) {
        signupButton.textContent = "Se déconnecter";

        signupButton.disabled = false;
        signupButton.style.cursor = "pointer";


        /*
         * Éviter d'ajouter plusieurs listeners
         * lorsque updateAuthUI() est appelée.
         */

        signupButton.onclick = logout;
    }
}


/* =========================================================
   DARK MODE
========================================================= */

const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const icon = themeToggle.querySelector("i");

        if (!icon) return;

        const isDarkMode =
            document.body.classList.contains("dark-mode");

        if (isDarkMode) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    });
}


/* =========================================================
   RETOUR EN HAUT
========================================================= */

const backToTop = document.querySelector("#back-to-top");

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   INITIALISATION
========================================================= */

updateCart();
filterBooks();
updateAuthUI();