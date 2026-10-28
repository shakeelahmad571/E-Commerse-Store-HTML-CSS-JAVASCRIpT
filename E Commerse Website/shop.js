let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-btn");
let noResults = document.querySelector("#no-results");

// cart items count label on cart icon
let cartCountLabel = document.querySelector(".cart-items-count");


// // -------------------fecthing products API-----------------------

// products container element
let productsContainer = document.querySelector(".products-grid");

// all products recieved from the API
let allProducts = [];

// all products after seach and filter
let filterdProducts = [];

// pagination setting
let productsPerPage = 12;
let currentPage = 1;

// pagination container element
let pagination = document.querySelector(".product-pagination");

// sorting products quantity show text
let productsCountText = document.querySelector("#products-count-text");

function updateProductCount() {
    let startIndex = (currentPage - 1) * productsPerPage;
    let endIndex = startIndex + productsPerPage;

    productsCountText.textContent = `Showing ${startIndex + 1}-${endIndex} of ${filterdProducts.length}`;

}
// Categories filter
let categoriesFilter = document.querySelectorAll(
    'input[name="category"]'
);
// price range input
let priceRange = document.querySelector("#price-range");

// price range text span
let priceMax = document.querySelector("#price-max-value");


// filter inputs check boxes
let filterBrands = document.querySelectorAll(
    `input[name="brand"]`
);


let categories = [
    "laptops",
    "smartphones",
    "tablets",
    "mobile-accessories"
];

// // -------------------Get Data Function----------------------
async function GetData() {
    try {
        // fecth all catogories
        let requests = categories.map(async (category) => {
            let response = await fetch(`https://dummyjson.com/products/category/${category}`);

            // through error if api response unsuccefull 
            if (!response.ok) {
                throw new Error(`Failed to fetch ${category}`);
            }

            let data = await response.json();

            return data.products;
        });

        // wait for all request to finish
        let results = await Promise.all(requests);

        // combine all categories products into one array
        allProducts = results.flat();
        // adding all products to filterd products array
        filterdProducts = [...allProducts];

        displayProducts();
        updatePagination();
    } catch (error) {
        console.log("Error", error.message);
        productsContainer.textContent = "Unable to loads products"
    };
};

// get data function call
GetData();

// -------------------------------------------------------------
// -------------------Add to cart Function----------------------
// -------------------------------------------------------------
// cart products count
function cartProductsCount() {
    // getting cart array from local Storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = cart.reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0)

    if (totalItems > 0) {
        cartCountLabel.style.display = "block";
        cartCountLabel.innerHTML =
            `<p>${Number(totalItems)}</p>`;
    } else {
        cartCountLabel.style.display = "none";
        cartCountLabel.textContent = "";
    }

}
cartProductsCount();

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // check if the product is in cart
    let existingProduct = cart.find((item) => {
        return item.id === product.id;
    });

    if (existingProduct) {
        // increase quantity if exist
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.thumbnail,
            quantity: 1
        }
        );
    }

    //    save updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    cartProductsCount();
}

// -------------------Display products Function----------------------

function displayProducts() {
    // clear existing Products
    productsContainer.innerHTML = "";

    let startIndex = (currentPage - 1) * productsPerPage;
    let endIndex = startIndex + productsPerPage;

    let productsToShow = filterdProducts.slice(startIndex, endIndex);
    productsToShow.forEach((product) => {
        //    create product card
        let productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // create product Image
        let productImage = document.createElement("img");
        productImage.src = product.thumbnail;
        product.alt = product.title;

        // create product name
        let productTitle = document.createElement("h3");
        productTitle.textContent = product.title;

        // create product price
        let productPrice = document.createElement("p");
        productPrice.textContent = `$${product.price}`;

        // create product rating
        let productRating = document.createElement("p");
        productRating.textContent = `Ratings: ${product.rating}`;
        productRating.style.color = "#6C63FF";
        // create product stock
        let productStock = document.createElement("p");
        productStock.textContent = `Stock: ${product.stock} Pieces`;
        productStock.style.color = "#10B981";

        // create product button
        let productButton = document.createElement("button");
        productButton.textContent = "Add To Cart";
        productButton.classList.add("product-card-button");

        // add elements to the card
        productCard.append(
            productImage,
            productTitle,
            productPrice,
            productRating,
            productStock,
            productButton
        )
        // add product card to products grid
        productsContainer.appendChild(productCard);

        // add event listner to add to cart button
        productButton.addEventListener("click", () => {
            addToCart(product);

        })

    });
    updateProductCount();
}

// -------------------update pagination Function----------------------
function updatePagination() {
    let pageNumbers = pagination.querySelector(".page-numbers")
    let previousButton = pagination.querySelector(`[data-action="previous"]`);
    let nextButton = pagination.querySelector(`[data-action="next"]`);

    let totalPages = Math.ceil(filterdProducts.length / productsPerPage);
    pageNumbers.innerHTML = "";
    // for loop on total pages
    for (let page = 1; page <= totalPages; page++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = page;
        pageButton.dataset.page = page;
        pageButton.classList.add("pagination-button");

        if (page === currentPage) {
            pageButton.classList.add("pagination-active");
        }
        pageNumbers.appendChild(pageButton);
        // disabled previous button on first page
        if (currentPage === 1) {
            previousButton.disabled = true;
        } else {
            previousButton.disabled = false;
        }

        // disabled next button on last page
        if (currentPage == totalPages) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    };

};
// Add event listner on pagination
pagination.addEventListener("click", (event) => {
    let clickedButton = event.target.closest("button");

    if (clickedButton.dataset.action === "previous") {
        currentPage--;
    } else if (clickedButton.dataset.action === "next") {
        currentPage++;
    } else if (clickedButton.dataset.page) {
        currentPage = Number(clickedButton.dataset.page);
    } else {
        return
    }


    displayProducts();
    updatePagination();
});

// ------------------------------------------------------
// ------------------Categories filter-------------------
// -------------------------------------------------------
categoriesFilter.forEach((input) => {

    input.addEventListener("change", () => {

        if (input.value === "all") {
            filterdProducts = [...allProducts];
        } else {
            filterdProducts = allProducts.filter((product) => {
                return product.category === input.value;
            })
        }

        currentPage = 1;

        displayProducts();
        updatePagination();
    });

});

// ----------------------Price Range-----------------------

// filter by price range
priceRange.addEventListener("change", () => {
    priceMax.textContent = `$ ${priceRange.value}`;
    filterdProducts = allProducts.filter((product) => {
        return priceRange.value <= number(product.price);
    })

    currentPage = 1;
    displayProducts();
    updatePagination();
});

// filter by brands
filterBrands.forEach((input) => {
    input.addEventListener("change", () => {

        if (input.value === "all") {
            filterdProducts = [...allProducts];
        } else {
            filterdProducts = allProducts.filter((product) => {
                return product.brand === input.value;
            })
        }
        currentPage = 1;
        displayProducts();
        updatePagination();
    });

});

// sorting products by select price low to hight and high to low
let SortingSelect = document.querySelector(`select[name="sort"]`);
SortingSelect.addEventListener("change", () => {
    if (SortingSelect.value === "price-low") {
        filterdProducts.sort((a, b) => {
            return a.price - b.price;
        })
    } else if (SortingSelect.value === "price-high") {
        filterdProducts.sort((a, b) => {
            return b.price - a.price;
        })

    }
    currentPage = 1;
    displayProducts();
    updatePagination();
});

// Function to search products
function searchProducts() {
    let searchText = searchInput.value.trim().toLowerCase();
    filterdProducts = allProducts.filter((product) => {
        return (
            product.category.toLowerCase().includes(searchText) ||
            product.title.toLowerCase().includes(searchText)
        );
        // searchText === product.title;
    })
    displayProducts();
    updatePagination();
    sortingDetails.innerHTML = "";
}
// Search when the user clicks the button
searchBtn.addEventListener("click", searchProducts);

// Search while the user types
searchInput.addEventListener("input", searchProducts);


