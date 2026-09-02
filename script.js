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
const cartTotal = document.querySelector("#cart-total-price");


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
                    <strong>${item.title}</strong>
                    <p>
                        ${item.price.toLocaleString("fr-FR")} FCFA
                    </p>
                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    aria-label="Supprimer ${item.title}"
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