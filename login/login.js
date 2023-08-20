import { signUp, login } from "../firebase.js";


const form = document.getElementById('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    signUp(email, password)
    form.reset()
    return false
})

const genLoginForm = document.getElementById('genLoginForm')
genLoginForm.addEventListener('click', renderLogin)

function renderLogin(){
    document.body.innerHTML = `
    <body class="login">
        <div class="container">
            <h2 class="text-center">Login</h2>
            <div id="loginError" class="error-message"></div>
            <div id="loginSuccess" class=""></div>
            <form id="loginForm" class="loginForm">
                <div class="input-group">
                    <label for="loginEmail" class="label">Username</label>
                    <input type="text" id="loginEmail" class="input">
                    <span class="error-message"></span>
                </div>
                <br>
                <div class="input-group">
                    <label for="loginPassword" class="label">Password</label>
                    <input type="password" id="loginPassword" class="input">
                    <span class="error-message"></span>
                </div>
                <br>
                <button class="button" type="submit">Login</button>
            </form>
            <a class="loginHere" href="./login.html">Don't have an account? Sign up here</a>

        </div>

        <div class="container">
        <h1>Test account:</h1>
        <p>Username: IamATestAccount@example.com</p>
        <p>Password: p12345</p>
    </div>
    `
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        login(email, password);
    });
}
