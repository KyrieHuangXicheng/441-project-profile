let isLoggedIn = false;
let registeredUsers = {}; // 模拟已注册用户数据库
let cart = {};

function toggleFormView(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginHeading = document.getElementById('loginHeading');
    const registerHeading = document.getElementById('registerHeading');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginHeading.style.display = 'block';
        registerHeading.style.display = 'none';
    } else if (formType === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginHeading.style.display = 'none';
        registerHeading.style.display = 'block';
    }
}

document.getElementById('toRegister').addEventListener('click', function(e) {
    e.preventDefault();
    toggleFormView('register');
});

document.getElementById('toLogin').addEventListener('click', function(e) {
    e.preventDefault();
    toggleFormView('login');
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = e.target.elements[0].value;
        const password = e.target.elements[1].value;

        if (username in registeredUsers && registeredUsers[username].password === password) {
            alert(`Login successful for user ${username}!`);
            e.target.reset();
            window.location.href = "shopping.html";
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = e.target.elements[0].value;
        const email = e.target.elements[1].value;
        const password = e.target.elements[2].value;
        const confirmPassword = e.target.elements[3].value;

        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (registeredUsers[username]) {
            alert('Username already exists. Please choose another one.');
        } else {
            registeredUsers[username] = { email, password };
            if (confirm(`Registration successful for user ${username}! Click OK to go back to the login page.`)) {
                e.target.reset();
                toggleFormView('login');
            }
        }
    });

    toggleFormView('login');

    // 购物车功能
    document.getElementById('addToCartBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const courseId = this.dataset.courseId;
        const coursePrice = parseFloat(this.dataset.coursePrice);
        addToCart(courseId, coursePrice);
    });

    document.getElementById('removeItemBtn').addEventListener('click', removeItem);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
});

function addToCart(courseId, coursePrice) {
    if (cart[courseId]) {
        cart[courseId].quantity++;
    } else {
        cart[courseId] = { price: coursePrice, quantity: 1 };
    }
    updateCart();
}

function removeItem() {
    const checkboxes = document.querySelectorAll('.cart-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const courseIdToRemove = parseInt(checkbox.value);
        if (cart.hasOwnProperty(courseIdToRemove)) {
            delete cart[courseIdToRemove];
        }
    });
    updateCart();
}

function clearCart() {
    cart = {};
    updateCart();
}

function checkout() {
    alert('Thank you for your purchase!');
    clearCart();
}

function updateCart() {
    let items = '';
    let total = 0;
    for (let courseId in cart) {
        if (cart.hasOwnProperty(courseId)) {
            total += cart[courseId].price * cart[courseId].quantity;
            items += `
                <li>
                    <input type="checkbox" class="cart-checkbox" value="${courseId}">
                    Course ${courseId} x ${cart[courseId].quantity} = $${cart[courseId].price * cart[courseId].quantity}
                </li>
            `;
        }
    }
    document.getElementById('total').innerHTML = total.toFixed(2);
    document.getElementById('cartItems').innerHTML = items;
}