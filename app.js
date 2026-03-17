// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 PALITAN MO ITO NG REAL CONFIG MO
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "cashbacker-52a60.firebaseapp.com",
  projectId: "cashbacker-52a60",
  storageBucket: "cashbacker-52a60.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Button
const loginBtn = document.getElementById("loginBtn");

// Login
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Login success: " + result.user.email);
    })
    .catch((error) => {
      alert("Error: " + error.message);
      console.error(error);
    });
});
