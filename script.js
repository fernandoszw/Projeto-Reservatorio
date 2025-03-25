import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const database = getDatabase(app); 

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; 
    }
});

window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; 
    });
};

function verificarVazamento() {
    const nivelAtual = document.getElementById('nivelAtual').value;
    const capacidadeTotal = 1000;

    if (nivelAtual === "" || nivelAtual < 0 || nivelAtual > capacidadeTotal) {
        alert("Por favor, insira um valor válido entre 0 e 1000 litros.");
        return;
    }

    const nivelAtualNum = parseInt(nivelAtual);
    const aguaPerdida = capacidadeTotal - nivelAtualNum;

    let mensagem = "";

    if (aguaPerdida > 500) {
        mensagem = "Atenção: O reservatório perdeu mais de metade de sua capacidade! Reparos imediatos são necessários!";
        document.getElementById('resultado').classList.remove("success", "warning");
        document.getElementById('resultado').classList.add("alert");
    } 

    else if (aguaPerdida > 200) {
        mensagem = "Possível vazamento: O reservatório perdeu uma quantidade significativa de água. Verifique a situação!";
        document.getElementById('resultado').classList.remove("success", "alert");
        document.getElementById('resultado').classList.add("warning");
    }

    else if (nivelAtualNum === capacidadeTotal) {
        mensagem = "Reservatório cheio, sem vazamento detectado!";
        document.getElementById('resultado').classList.remove("alert", "warning");
        document.getElementById('resultado').classList.add("success");
    } 

    else {
        mensagem = `O nível de água é ${nivelAtualNum} litros. Nenhum vazamento significativo detectado.`;
        document.getElementById('resultado').classList.remove("alert", "warning");
        document.getElementById('resultado').classList.add("success");
    }

    document.getElementById('resultado').textContent = mensagem;
    document.getElementById('resultado').style.opacity = 1;

    salvarNoFirebase(nivelAtualNum, mensagem);
}

function salvarNoFirebase(nivelAtual, mensagem) {

    const registroId = push(ref(database, 'registros')).key;

    const dados = {
        nivel: nivelAtual,
        mensagem: mensagem,
        timestamp: new Date().toISOString() 
    };

    const updates = {};
    updates['/registros/' + registroId] = dados;

    update(ref(database), updates)
        .then(() => {
            console.log("Dados salvos com sucesso no Firebase!");
        })
        .catch((error) => {
            console.error("Erro ao salvar no Firebase: ", error);
        });
}

window.verificarVazamento = verificarVazamento;
document.querySelector("button").addEventListener("click", verificarVazamento);

document.getElementById("logout-btn").addEventListener("click", function() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; 
    }).catch((error) => {
        console.error("Erro ao fazer logout: ", error);
    });
});