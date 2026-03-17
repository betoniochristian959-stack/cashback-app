import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIG MO
const firebaseConfig = {
  apiKey: "AIzaSyAxSyj6mPU4oWVmRdH_bUTky7j7A8TMWQw",
  authDomain: "cashbacker-52a60.firebaseapp.com",
  projectId: "cashbacker-52a60",
  storageBucket: "cashbacker-52a60.firebasestorage.app",
  messagingSenderId: "971010772824",
  appId: "1:971010772824:web:27b1a47eaf460d2f94df2d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ELEMENTS
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEl = document.getElementById("user");

const linkInput = document.getElementById("linkInput");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");

const clicksEl = document.getElementById("clicks");
const balanceEl = document.getElementById("balance");

const withdrawBtn = document.getElementById("withdrawBtn");
const msg = document.getElementById("msg");

let currentUser = null;

// LOGIN
loginBtn.onclick = () => {
  signInWithPopup(auth, provider);
};

// LOGOUT
logoutBtn.onclick = () => {
  signOut(auth);
};

// AUTH STATE
onAuthStateChanged(auth, async (user) => {

  if (user) {
    currentUser = {
      id: user.uid,
      name: user.displayName,
      clicks: 0,
      balance: 0
    };

    userEl.innerText = "Welcome " + user.displayName;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      currentUser = snap.data();
    }

    updateUI();

  } else {

    currentUser = null;
    userEl.innerText = "";

    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";

    updateUI();
  }
});

// UPDATE UI
function updateUI() {
  clicksEl.innerText = currentUser ? currentUser.clicks : 0;
  balanceEl.innerText = currentUser ? currentUser.balance : 0;
}

// CONVERT
convertBtn.onclick = async () => {

  if (!currentUser) return alert("Login first");

  let link = linkInput.value.toLowerCase();

  let converted = "";

  if (link.includes("shopee")) {
    converted = "https://s.shopee.ph/AABBJBucdn";
  } else if (link.includes("tiktok")) {
    converted = "https://vt.tiktok.com/PHLCCP7L9B/";
  } else {
    return alert("Shopee/TikTok only");
  }

  currentUser.clicks++;
  currentUser.balance += 10;

  updateUI();

  await setDoc(doc(db, "users", currentUser.id), currentUser);

  result.innerHTML = `<a href="${converted}" target="_blank">👉 Open Link</a>`;
};

// WITHDRAW
withdrawBtn.onclick = async () => {

  if (!currentUser) return alert("Login first");

  if (currentUser.balance <= 0) {
    msg.innerText = "No balance";
    return;
  }

  let code = prompt("Enter admin code");

  if (code !== "1234") return alert("Wrong code");

  currentUser.balance = 0;

  updateUI();

  msg.innerText = "Withdraw approved";

  await setDoc(doc(db, "users", currentUser.id), currentUser);
};
