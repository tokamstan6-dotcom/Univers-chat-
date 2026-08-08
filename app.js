// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDskOrlsXNEkcQlGO4jdC5LMPcWICEF04",
  authDomain: "univers-chat-a6303.firebaseapp.com",
  projectId: "univers-chat-a6303",
  storageBucket: "univers-chat-a6303.firebasestorage.app",
  messagingSenderId: "1019876595261",
  appId: "1:1019876595261:web:7c67c74bc1426b1ca2bc54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

let pseudo = "";

// Éléments DOM
const loginScreen = document.getElementById("loginScreen");
const chatScreen = document.getElementById("chatScreen");
const pseudoInput = document.getElementById("pseudoInput");
const phoneInput = document.getElementById("phoneInput");
const btnConnexion = document.getElementById("btnConnexion");
const btnDeconnexion = document.getElementById("btnDeconnexion");
const btnEnvoyer = document.getElementById("btnEnvoyer");
const messageInput = document.getElementById("messageInput");
const messagesWrapper = document.getElementById("messagesWrapper");
const userInfo = document.getElementById("userInfo");

// Connexion
btnConnexion.addEventListener("click", () => {
  pseudo = pseudoInput.value.trim();
  const phone = phoneInput.value.trim();
  
  if (!pseudo || !phone) {
    alert("Remplis pseudo et numéro");
    return;
  }
  
  loginScreen.classList.remove("active");
  chatScreen.classList.add("active");
  userInfo.textContent = pseudo;
  ecouterMessages();
});

// Déconnexion
btnDeconnexion.addEventListener("click", () => {
  chatScreen.classList.remove("active");
  loginScreen.classList.add("active");
  messagesWrapper.innerHTML = "";
});

// Envoyer message
btnEnvoyer.addEventListener("click", envoyerMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") envoyerMessage();
});

async function envoyerMessage() {
  const texte = messageInput.value.trim();
  if (!texte) return;
  
  await push(messagesRef, {
    pseudo: pseudo,
    texte: texte,
    created_at: Date.now()
  });
  messageInput.value = "";
}

// Écouter messages en temps réel
function ecouterMessages() {
  onChildAdded(messagesRef, (snapshot) => {
    afficherMessage(snapshot.val());
  });
}

// Afficher message
function afficherMessage(data) {
  const div = document.createElement("div");
  div.className = "message" + (data.pseudo === pseudo ? " moi" : "");
  const date = new Date(data.created_at);
  const heure = `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  div.innerHTML = `<div class="pseudo">${data.pseudo}</div><div>${data.texte}</div><span class="message-time">${heure}</span>`;
  messagesWrapper.appendChild(div);
  messagesWrapper.scrollTop