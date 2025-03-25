
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDytoV7Kq6iyWbl9qNBv-MFW5oZFC5Wd2M",
    authDomain: "reservatorio---senai.firebaseapp.com",
    databaseURL: "https://reservatorio---senai-default-rtdb.firebaseio.com",
    projectId: "reservatorio---senai",
    storageBucket: "reservatorio---senai.firebasestorage.app",
    messagingSenderId: "19550143906",
    appId: "1:19550143906:web:2e05cc12350116a5931efb",
    measurementId: "G-2JVTDZB0NW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensagem = document.getElementById("mensagem");

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            mensagem.innerHTML = "Login bem-sucedido! Redirecionando...";
            mensagem.style.color = "green";
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 2000);
        })
        .catch((error) => {
            mensagem.innerHTML = "Erro no login: " + error.message;
            mensagem.style.color = "red";
        });
};

window.mostrarCadastro = function() {
    document.getElementById("cadastro-form").style.display = "block"; 
};

window.cadastrar = function() {
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;
    const mensagem = document.getElementById("cadastro-mensagem");

    if (email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                mensagem.innerHTML = "Cadastro bem-sucedido! Redirecionando...";
                mensagem.style.color = "green";
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 2000);
            })
            .catch((error) => {
                mensagem.innerHTML = "Erro no cadastro: " + error.message;
                mensagem.style.color = "red";
            });
    } else {
        mensagem.innerHTML = "Por favor, preencha todos os campos.";
        mensagem.style.color = "red";
    }
};

window.esqueciSenha = function() {
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem");

    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                mensagem.innerHTML = "Email de recuperação enviado!";
                mensagem.style.color = "green";
            })
            .catch((error) => {
                mensagem.innerHTML = "Erro: " + error.message;
                mensagem.style.color = "red";
            });
    } else {
        mensagem.innerHTML = "Por favor, insira seu email para recuperação de senha.";
        mensagem.style.color = "red";
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html"; 
    }
});

