class UserAuth {
    constructor() {
        this.init();
    }

    init() {
        if (localStorage.getItem('loggedIn') === 'true') {
            window.location.href = '../home.html';
        }

        document.getElementById('loginFormButton').addEventListener('click', (e) => {
            e.preventDefault();
            this.validateLogin();
        });

        document.getElementById('signupFormButton').addEventListener('click', (e) => {
            e.preventDefault();
            this.validateSignUp();
        });
    }

    validateSignUp() {
        const userName = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        let isValid = true;

        this.clearErrors(['nameError', 'phoneError', 'emailError', 'passwordError']);

        if (userName === '') {
            this.setError('nameError', 'Enter your name!');
            isValid = false;
        }

        if (phone === '') {
            this.setError('phoneError', 'Enter your phone number!');
            isValid = false;
        } else if (phone.length !== 11) { 
            this.setError('phoneError', 'Enter a valid phone number!');
            isValid = false;
        }

        if (email === '') {
            this.setError('emailError', 'Enter your email!');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            this.setError('emailError', 'Enter a valid email address!');
            isValid = false;
        }

        if (pass === '') {
            this.setError('passwordError', 'Enter your password!');
            isValid = false;
        } else if (pass.length < 6) { 
            this.setError('passwordError', 'Password must be at least 6 characters!');
            isValid = false;
        }

        if (isValid) {
            document.getElementById('reg-log').checked = false;
        }

        return false; 
    }

    validateLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        
        let isValid = true;

        this.clearErrors(['loginEmailError', 'loginPasswordError']);

        if (email === '') {
            this.setError('loginEmailError', 'Enter your email!');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            this.setError('loginEmailError', 'Enter a valid email address!');
            isValid = false;
        }

        if (pass === '') {
            this.setError('loginPasswordError', 'Enter your password!');
            isValid = false;
        } else if (pass.length < 6) { 
            this.setError('loginPasswordError', 'Password must be at least 6 characters!');
            isValid = false;
        }

        if (isValid) {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = '../home.html'; 
        }

        return false; 
    }

    setError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    clearErrors(errorIds) {
        errorIds.forEach(id => document.getElementById(id).textContent = '');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserAuth();
});



