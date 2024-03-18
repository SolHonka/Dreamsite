console.log("asdf");

// Function to check if user is logged in
function checkLoggedIn() {
    const token = sessionStorage.getItem('token');
    if (token) {
        window.location.href = 'mydreams.html'; // Redirect to My Dreams page if logged in
    }
}

// Check if user is already logged in
checkLoggedIn();

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get username and password from form fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make AJAX request to login endpoint
    const response = await fetch('http://127.0.0.1:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        // Login successful, save token and redirect to mydreams.html
        sessionStorage.setItem('token', data.token); // Save token in session storage
        window.location.href = 'mydreams.html';
    } else {
        // Login failed, display error message
        console.error('Login failed:', data.message);
        alert('Login failed. Please check your username and password.');
    }
});

document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get username and password from form fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make AJAX request to registration endpoint
    const response = await fetch('http://127.0.0.1:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        // Registration successful, inform the user
        console.log('Registration successful');
        alert('Registration successful. You can now login.');
    } else {
        // Registration failed, display error message
        console.error('Registration failed:', data.message);
        alert('Registration failed. Please try again.');
    }
});
