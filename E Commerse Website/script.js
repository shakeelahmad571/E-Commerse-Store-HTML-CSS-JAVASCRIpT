// navbar links all catogories
let arrow = document.querySelector("#arrow-icon");
let dropdownList = document.querySelector(".dropdown-list");

// // hamburger

let hamburgerIcon = document.querySelector("#nav-link-hamburger");
let navLinks = document.querySelector(".navlinks");

hamburgerIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


arrow.addEventListener("click", () => {
    dropdownList.classList.toggle("active");
});

// close dropdown when click outside
window.addEventListener("click", (event) => {
    if (!dropdownList.contains(event.target) &&
        !arrow.contains(event.target)) {
        dropdownList.classList.remove("active");
    }
})

// search input

// theme toggle button

let themeToggle = document.querySelector("#theme-toggle");
let btnContainer = document.querySelector(".btn-background");
let btnCircle = document.querySelector(".btn-circle");

// load saved them for local Storage
let savedTheme = localStorage.getItem("theme") || "light";

// apply the saved theme
document.documentElement.dataset.theme = savedTheme;

// Match toggle position and circle color with the theme
if (savedTheme === "light") {
    btnContainer.style.justifyContent = "flex-start"
    btnCircle.style.backgroundColor = "#ffffff"
    btnCircle.textContent = "☀️";
} else {
    btnContainer.style.justifyContent = "flex-end";
    btnCircle.style.backgroundColor = "#000000"
    btnCircle.textContent = "🌙";
}

// add event listner to toggle theme button
themeToggle.addEventListener("click", () => {
    if (document.documentElement.dataset.theme === "light") {
        document.documentElement.dataset.theme = "dark";
        btnContainer.style.justifyContent = "flex-end";
        btnCircle.style.backgroundColor = "#000000"
        btnCircle.textContent = "🌙";
    } else {
        document.documentElement.dataset.theme = "light";
        btnContainer.style.justifyContent = "flex-start"
        btnCircle.style.backgroundColor = "#ffffff";
        btnCircle.textContent = "☀️";
    }
    // save the selected theme to local storage

    localStorage.setItem("theme",
        document.documentElement.dataset.theme
    )

});

// redirect to cart page 
let cartBtn = document.querySelector("#cart-icon");

cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
});

// featured cards fethcing

let featuredCards = document.querySelector(".featured-cards");

async function getFeaturedProducts() {
    try {
        let response = await fetch("https://dummyjson.com/products/category/smartphones?limit=5");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        let data = await response.json();

        featuredCards.innerHTML = "";

        data.products.forEach((product) => {
            let card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p> $${product.price}</p>
                <p id="rating-text">Ratings: ${product.rating}</p>
                <p id="stock-text">Stock: ${product.stock}</p>
                <button class="product-card-button">Add to Cart</button>
            `;
            featuredCards.appendChild(card);
        });

    } catch (error) {
        console.log("Error:", error.message);
        featuredCards.textContent = "Unable to load featured products.";
    }
}

getFeaturedProducts();




// dropdown list redirect to shop category show products
let categoriesdropDown = document.querySelectorAll(".dropdown-list");

categoriesdropDown.forEach((category) => {
    category.addEventListener("click", () => {
        window.location.href = "shop.html"
    });

});

let shopNowBtn = document.querySelector("#shop-now-btn");
shopNowBtn.addEventListener("click", () => {
    window.location.href = "shop.html";
});

// sale counter
function Salecounter() {

    let daysContainer = document.querySelector("#saleCounterDays");
    let hoursContainer = document.querySelector("#saleCounterHours");
    let minutesConatiner = document.querySelector("#saleCounterMinutes");
    let secondsConatiner = document.querySelector("#saleCounterSeconds");
    let dealCounterConatiner = document.querySelector(".dealCounter");


    // the current time
    let currentTime = new Date().getTime();
    // the sale end date
    let saleEndDate = new Date("2026-10-27T23:59:00").getTime();
    // culculating remaining time
    let remainingTime = saleEndDate - currentTime;
    // convert milisecond to second
    let totalSeconds = Math.floor(remainingTime / 1000)
    // stop when the sale end
    if (remainingTime <= 0) {
        dealCounterConatiner.textContent = "Sale has ended!"
        clearInterval(saleTimer);
        return;
    }
    // culculates hours minutes and seconds
    let Days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds % 1000) / 60);
    let seconds = totalSeconds % 60;

    // displying values
    daysContainer.textContent = String(Days).padStart(2, "0");
    hoursContainer.textContent = String(hours).padStart(2, "0");
    minutesConatiner.textContent = String(minutes).padStart(2, "0");
    secondsConatiner.textContent = String(seconds).padStart(2, "0");

}

Salecounter();
let saleTimer = setInterval(Salecounter, 1000);