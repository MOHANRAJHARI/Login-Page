
// ========================================
// COMPANY PORTAL - MAIN JAVASCRIPT
// ========================================


// Get registered users from localStorage

function getUsers() {

    try {

        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        return Array.isArray(users) ? users : [];

    } catch (error) {

        return [];

    }

}


// Display message

function showMessage(element, text, type) {

    if (!element) return;

    element.textContent = text;
    element.className = "message " + type;

}


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        const passwordInput = document.getElementById("password");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "Show";

        }

    });

}


// ========================================
// USER REGISTRATION
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();

        const employeeId = document.getElementById("employeeId")
            .value.trim();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const message = document.getElementById("registerMessage");

        // Validate fields

        if (!name || !employeeId || !email || !password) {

            showMessage(
                message,
                "Please fill in all fields.",
                "error"
            );

            return;

        }

        // Validate email

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                message,
                "Please enter a valid email address.",
                "error"
            );

            return;

        }

        // Validate password

        if (password.length < 8) {

            showMessage(
                message,
                "Password must contain at least 8 characters.",
                "error"
            );

            return;

        }

        // Get existing users

        const users = getUsers();

        // Check duplicate email

        const emailExists = users.some(
            user => user.email.toLowerCase() === email
        );

        if (emailExists) {

            showMessage(
                message,
                "This email is already registered.",
                "error"
            );

            return;

        }

        // Check duplicate Employee ID

        const idExists = users.some(
            user => user.employeeId.toLowerCase() ===
                    employeeId.toLowerCase()
        );

        if (idExists) {

            showMessage(
                message,
                "This Employee ID is already registered.",
                "error"
            );

            return;

        }

        // Create account

        const newUser = {

            name: name,

            employeeId: employeeId,

            email: email,

            // Demo only: Never store plaintext passwords
            // in a real application.
            password: password

        };

        users.push(newUser);

        // Save details

        try {

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            showMessage(
                message,
                "Account created successfully! Redirecting to login...",
                "success"
            );

            registerForm.reset();

            setTimeout(function () {

                window.location.href = "index.html";

            }, 1500);

        } catch (error) {

            showMessage(
                message,
                "Unable to save account details.",
                "error"
            );

        }

    });

}


// ========================================
// USER LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const loginMessage = document.getElementById("loginMessage");

    // Remember email

    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {

        document.getElementById("email").value = savedEmail;

        document.getElementById("rememberMe").checked = true;

    }

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const rememberMe = document.getElementById("rememberMe").checked;

        const users = getUsers();

        // Verify credentials

        const user = users.find(function (account) {

            return account.email.toLowerCase() === email &&
                   account.password === password;

        });

        if (!user) {

            showMessage(
                loginMessage,
                "Invalid Mail ID or Password.",
                "error"
            );

            return;

        }

        // Remember email only

        if (rememberMe) {

            localStorage.setItem("rememberedEmail", email);

        } else {

            localStorage.removeItem("rememberedEmail");

        }

        // Create session

        const sessionUser = {

            name: user.name,

            employeeId: user.employeeId,

            email: user.email

        };

        sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify(sessionUser)
        );

        showMessage(
            loginMessage,
            "Login successful! Redirecting...",
            "success"
        );

        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 1000);

    });

}


// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            document.getElementById("loginMessage"),
            "Please contact your company administrator to reset your password.",
            "error"
        );

    });

}


// ========================================
// PERSONALIZED WELCOME DASHBOARD
// ========================================

const welcomeName = document.getElementById("welcomeName");

if (welcomeName) {

    let user;

    try {

        user = JSON.parse(
            sessionStorage.getItem("loggedInUser") || "null"
        );

    } catch (error) {

        user = null;

    }

    // Check session

    if (!user) {

        window.location.replace("index.html");

    } else {

        welcomeName.textContent = "Welcome, " + user.name + "!";

    }

}


// ========================================
// LOGOUT
// ========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        sessionStorage.removeItem("loggedInUser");

        window.location.replace("index.html");

    });

}
