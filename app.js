document.addEventListener("DOMContentLoaded", () => {

const firebaseConfig = {
  apiKey: "AIzaSyAxSyj6mPU4oWVmRdH_bUTky7j7A8TMWQw",
  authDomain: "cashbacker-52a60.firebaseapp.com",
  projectId: "cashbacker-52a60",
  storageBucket: "cashbacker-52a60.firebasestorage.app",
  messagingSenderId: "971010772824",
  appId: "1:971010772824:web:27b1a47eaf460d2f94df2d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

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
loginBtn.onclick = () => {
  auth.signInWithPopup(provider);
};

// LOGOUT
logoutBtn.onclick = () => {
  auth.signOut();
};

// AUTH STATE
auth.onAuthStateChanged(user => {

  if (user) {

    currentUser = {
      id: user.uid,
      name: user.displayName,
      balance: 0
    };

    userEl.innerText = "Welcome " + user.displayName;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    db.collection("users").doc(user.uid).get().then(doc => {
      if (doc.exists) currentUser = doc.data();
      updateUI();
    });

  } else {

    currentUser = null;
    userEl.innerText = "";

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";

    updateUI();
  }

});

// UPDATE UI
function updateUI() {
  cashbackEl.innerText = currentUser ? currentUser.balance : 0;
}

// ADD CASHBACK
addBtn.onclick = () => {

  if (!currentUser) return alert("Login first");

  currentUser.balance += 10;

  db.collection("users").doc(currentUser.id).set(currentUser);

  updateUI();
};

// CONVERT
convertBtn.onclick = () => {

  if (!currentUser) return alert("Login first");

  const link = linkInput.value.toLowerCase();

  let result = "";

  if (link.includes("shopee")) {
    result = "https://s.shopee.ph/AABBJBucdn";
  } 
  else if (link.includes("tiktok")) {
    result = "https://vt.tiktok.com/PHLCCP7L9B/";
  } 
  else {
    return alert("Invalid link");
  }

  convertedLink.innerHTML = `<a href="${result}" target="_blank">👉 Open Link</a>`;
};

// WITHDRAW
withdrawBtn.onclick = () => {

  if (!currentUser) return alert("Login first");

  if (currentUser.balance <= 0) {
    withdrawMsg.innerText = "No balance";
    return;
  }

  const code = prompt("Enter admin code");

  if (code !== "1234") return alert("Wrong code");

  currentUser.balance = 0;

  db.collection("users").doc(currentUser.id).set(currentUser);

  withdrawMsg.innerText = "Withdraw success";

  updateUI();
};

});
