import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuração do Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Obtendo referência do Firebase Database

// Configurar Firebase Auth
const auth = getAuth(app);

// Protege a página para usuários logados
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Se não estiver logado, volta para o login
    }
});

// Função para logout
window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; // Redireciona para a tela de login após logout
    });
};

// Função para verificar o nível de água e possível vazamento
function verificarVazamento() {
    const nivelAtual = document.getElementById('nivelAtual').value;
    const capacidadeTotal = 1000; // Capacidade total do reservatório em litros

    // Validando se o campo foi preenchido corretamente
    if (nivelAtual === "" || nivelAtual < 0 || nivelAtual > capacidadeTotal) {
        alert("Por favor, insira um valor válido entre 0 e 1000 litros.");
        return;
    }

    const nivelAtualNum = parseInt(nivelAtual);
    const aguaPerdida = capacidadeTotal - nivelAtualNum;

    let mensagem = "";

    // Caso o reservatório tenha perdido mais de 500 litros
    if (aguaPerdida > 500) {
        mensagem = "Atenção: O reservatório perdeu mais de metade de sua capacidade! Reparos imediatos são necessários!";
        document.getElementById('resultado').classList.remove("success", "warning");
        document.getElementById('resultado').classList.add("alert");
    } 
    // Caso o reservatório tenha perdido mais de 200 litros
    else if (aguaPerdida > 200) {
        mensagem = "Possível vazamento: O reservatório perdeu uma quantidade significativa de água. Verifique a situação!";
        document.getElementById('resultado').classList.remove("success", "alert");
        document.getElementById('resultado').classList.add("warning");
    }
    // Caso o reservatório esteja cheio
    else if (nivelAtualNum === capacidadeTotal) {
        mensagem = "Reservatório cheio, sem vazamento detectado!";
        document.getElementById('resultado').classList.remove("alert", "warning");
        document.getElementById('resultado').classList.add("success");
    } 
    // Caso o nível de água esteja estável
    else {
        mensagem = `O nível de água é ${nivelAtualNum} litros. Nenhum vazamento significativo detectado.`;
        document.getElementById('resultado').classList.remove("alert", "warning");
        document.getElementById('resultado').classList.add("success");
    }

    // Exibindo a mensagem ao usuário com animação suave
    document.getElementById('resultado').textContent = mensagem;
    document.getElementById('resultado').style.opacity = 1;

    // Salvar o nível de água e a mensagem no Firebase
    salvarNoFirebase(nivelAtualNum, mensagem);
}

// Função para salvar os dados no Firebase
function salvarNoFirebase(nivelAtual, mensagem) {
    // Criar um ID único para o registro
    const registroId = push(ref(database, 'registros')).key;

    // Estrutura de dados a ser salva
    const dados = {
        nivel: nivelAtual,
        mensagem: mensagem,
        timestamp: new Date().toISOString() // Data e hora atual no formato ISO
    };

    // Salvar no Firebase Realtime Database
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

// Tornar a função acessível globalmente
window.verificarVazamento = verificarVazamento;
document.querySelector("button").addEventListener("click", verificarVazamento);

document.getElementById("logout-btn").addEventListener("click", function() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; // Redireciona para a página de login após sair
    }).catch((error) => {
        console.error("Erro ao fazer logout: ", error);
    });
});