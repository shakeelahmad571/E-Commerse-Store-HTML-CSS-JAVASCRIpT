// Selection Elements
let cartProductsContainer = document.querySelector("#cart-products");

// // cart items count label on cart icon
// let cartCountLabel = document.querySelector(".cart-items-count");



// Display cart
function displayCart() {
    // cart array
let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartProductsContainer.innerHTML = "";

        let subTotal = 0;
        let items = 0;
        let subTotalElement = document.querySelector("#subtotal-price");
        let totalItems = document.querySelector("#total-items");
        let taxPrice = document.querySelector("#tax-price");
        orderTotal = document.querySelector("#total-price");

    if (cart.length === 0) {
        cartProductsContainer.textContent = "Your cart is empty.";
    }

    cart.forEach((product, index) => {
        // product card
        let productCard = document.createElement("div");
        productCard.classList.add("cart-product");

        // cart product card 
        let cartProductImgTitle = document.createElement("div");
        cartProductImgTitle.classList.add("cart-product-img-title");

        // product card img-div
        let productCardImgContainer = document.createElement("div");
        productCardImgContainer.classList.add("product-card-img");

        // product card image
        let productCardImg = document.createElement("img");
        productCardImg.src = product.image;
        productCardImg.alt = product.title;

        // adding img to  its container
        productCardImgContainer.appendChild(productCardImg);

        // product card text details
        let productCardTextDeatailsContainer = document.createElement("div");
        productCardTextDeatailsContainer.classList.add("product-card-text-details")

        // product title
        let productTitle = document.createElement("h5");
        productTitle.textContent = product.title;

        // product remove button
        let productRemoveButton = document.createElement("div");
        productRemoveButton.classList.add("remove-btn")
        productRemoveButton.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                aria-hidden="true">
                <path fill="#ffffff" d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
            </svg>`;
        // append product title and remove button to parent conaitner 
        productCardTextDeatailsContainer.append(
            productTitle,
            productRemoveButton
        );
        // append img and text details containers to product card img title
        cartProductImgTitle.append(
            productCardImgContainer,
            productCardTextDeatailsContainer
        );
        // product price
        let productPrice = document.createElement("h5");
        productPrice.textContent = product.price;

        // quantity container
        let quantityContainer = document.createElement("div");
        quantityContainer.classList.add("cart-quantity");

        // quantity increase button
        let quantityDecreaseButton = document.createElement("button");
        quantityDecreaseButton.classList.add("decrease-btn");
        quantityDecreaseButton.type = "button";
        quantityDecreaseButton.textContent = "<";
        // quantity
        let QuantityNumber = document.createElement("h4");
        QuantityNumber.textContent = product.quantity;
        // quantity decrease button
        let quantityIncreaseButton = document.createElement("button");
        quantityIncreaseButton.classList.add("increase-btn");
        quantityIncreaseButton.type = "button";
        quantityIncreaseButton.textContent = ">";

        // append quantuty childs to quantity container
        quantityContainer.append(
            quantityDecreaseButton,
            QuantityNumber,
            quantityIncreaseButton
        )
        // product total
        let productTotal = document.createElement("h4");
        productTotal.textContent = (product.quantity * product.price).toFixed(2);

        // sub total start here
        subTotal = subTotal + product.price * product.quantity;

        // append child to cart product
        productCard.append(
            cartProductImgTitle,
            productPrice,
            quantityContainer,
            productTotal
        )
        // append childs to card product container
        cartProductsContainer.appendChild(productCard);

        // addevent listner on remove button
        productRemoveButton.addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            cartProductsCount();
        });

        // addevent listner on increase decrease buttons
        quantityDecreaseButton.addEventListener("click", () => {
            if (product.quantity === 1) {
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
            } else {
                product.quantity = product.quantity - 1;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
                cartProductsCount();
            }

        });

        quantityIncreaseButton.addEventListener("click", () => {
            product.quantity = product.quantity + 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            cartProductsCount();

            
// tax deduction

        });




        // forEach end here    
    });
//  subtotal
subTotalElement.textContent = (subTotal).toFixed(2);
// total items 
items = Number(cart.length);
totalItems.textContent = items;
// tax price
let tax = subTotal * 5 / 100;
taxPrice.textContent = Number(tax).toFixed(2);
// total
orderTotal.textContent = Number(subTotal + tax).toFixed(2);


// displayCart function end here
};

displayCart();