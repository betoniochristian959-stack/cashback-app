import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxSyj6mPU4oWVmRdH_bUTky7j7A8TMWQw",
  authDomain: "cashbacker-52a60.firebaseapp.com",
  projectId: "cashbacker-52a60",
  storageBucket: "cashbacker-52a60.firebasestorage.app",
  messagingSenderId: "971010772824",
  appId: "1:971010772824:web:27b1a47eaf460d2f94df2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Button
const loginBtn = document.getElementById("loginBtn");

// Login function
loginBtn.addEventListener("click", () => {

  signInWithPopup(auth, provider)
    .then((result) => {
      alert("✅ Login success: " + result.user.email);
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
      console.error(error);
    });

});
