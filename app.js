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

// CONFIG
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
const addBtn = document.getElementById("addBtn");
const convertBtn = document.getElementById("convertBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

const userEl = document.getElementById("user");
const cashbackEl = document.getElementById("cashback");
const linkInput = document.getElementById("linkInput");
const convertedLink = document.getElementById("convertedLink");
const withdrawMsg = document.getElementById("withdrawMessage");

let currentUser = null;

// LOGIN
loginBtn.onclick = () => signInWithPopup(auth, provider);

// LOGOUT
logoutBtn.onclick = () => signOut(auth);

// AUTH STATE
onAuthStateChanged(auth, async (user) => {

  if (user) {

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    currentUser = snap.exists() ? snap.data() : {
      id: user.uid,
      name: user.displayName,
      balance: 0
    };

    userEl.innerText = "Welcome " + user.displayName;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

  } else {

    currentUser = null;
    userEl.innerText = "";

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }

  updateUI();
});

// UPDATE UI
function updateUI() {
  cashbackEl.innerText = currentUser ? currentUser.balance : 0;
}

// ADD CASHBACK
addBtn.onclick = async () => {

  if (!currentUser) return alert("Login first");

  currentUser.balance += 10;

  await setDoc(doc(db, "users", currentUser.id), currentUser);
  updateUI();
};

// CONVERT LINK
convertBtn.onclick = () => {

  if (!currentUser) return alert("Login first");

  const link = linkInput.value.toLowerCase();

  let result = "";

  if (link.includes("shopee")) {
    result = "https://s.shopee.ph/AABBJBucdn";
  } else if (link.includes("tiktok")) {
    result = "https://vt.tiktok.com/PHLCCP7L9B/";
  } else if (link.includes("lazada")) {
    result = "https://www.lazada.com.ph/";
  } else {
    return alert("Invalid link");
  }

  convertedLink.innerHTML = `<a href="${result}" target="_blank">👉 Open Link</a>`;
};

// WITHDRAW
withdrawBtn.onclick = async () => {

  if (!currentUser) return alert("Login first");

  if (currentUser.balance <= 0) {
    withdrawMsg.innerText = "No balance";
    return;
  }

  const code = prompt("Enter admin code");

  if (code !== "1234") return alert("Wrong code");

  currentUser.balance = 0;

  await setDoc(doc(db, "users", currentUser.id), currentUser);

  withdrawMsg.innerText = "Withdraw successful";
  updateUI();
};
