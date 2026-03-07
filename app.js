document.addEventListener("DOMContentLoaded", () => {

const SHOPEE_AFFILIATE_LINK = "https://s.shopee.ph/AABBJBucdn";
const TIKTOK_AFFILIATE_LINK = "https://vt.tiktok.com/PHLCCP7L9B/";

const firebaseConfig = {
  apiKey: "AIzaSyDp_G_ObIUrq9gExn4vC-2ktVzAlzK7Mn8",
  authDomain: "cashback-app-13a58.firebaseapp.com",
  projectId: "cashback-app-13a58",
  storageBucket: "cashback-app-13a58.firebasestorage.app",
  messagingSenderId: "66383755540",
  appId: "1:66383755540:web:b99e5314c14e63d11fea01",
  measurementId: "G-42JB55KZEQ"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const linkInput = document.getElementById("linkInput");
const convertBtn = document.getElementById("convertBtn");
const convertResult = document.getElementById("convertedLink");
const cashbackEl = document.getElementById("cashback");
const withdrawBtn = document.getElementById("withdrawBtn");
const withdrawMsg = document.getElementById("withdrawMessage");
const userEl = document.getElementById("user");
const clicksEl = document.getElementById("clicks");

let currentUser = null;

function updateDashboard(){
  cashbackEl.textContent = currentUser ? currentUser.balance : 0;
  clicksEl.textContent = currentUser ? currentUser.clicks : 0;
}

auth.onAuthStateChanged(user => {
  if(user){
    const uid = user.uid;
    currentUser = { id: uid, name: user.displayName, balance:0, clicks:0 };
    userEl.textContent = "Welcome " + user.displayName;
    loginBtn.style.display="none";
    logoutBtn.style.display="inline";

    db.collection("users").doc(uid).get().then(doc=>{
      if(doc.exists){
        currentUser = doc.data();
      }
      updateDashboard();
    });
  } else {
    loginBtn.style.display="inline";
    logoutBtn.style.display="none";
    userEl.textContent="";
    currentUser=null;
    updateDashboard();
  }
});

loginBtn.addEventListener("click",()=>{
  auth.signInWithPopup(provider)
    .catch(err=>{
      console.error(err);
      alert("Login failed: " + err.message);
    });
});

logoutBtn.addEventListener("click",()=>{
  auth.signOut();
});

convertBtn.addEventListener("click",()=>{
  if(!currentUser){ alert("Login first"); return; }

  const link = linkInput.value.trim().toLowerCase();
  if(!link){ alert("Paste link"); return; }

  let converted="";
  if(link.includes("shopee")) converted = SHOPEE_AFFILIATE_LINK;
  else if(link.includes("tiktok")) converted = TIKTOK_AFFILIATE_LINK;
  else { alert("Shopee or TikTok only"); return; }

  currentUser.clicks += 1;
  currentUser.balance += 10;

  updateDashboard();
  db.collection("users").doc(currentUser.id).set(currentUser, {merge:true});

  convertResult.innerHTML = `<a href="${converted}" target="_blank">Open Affiliate Link</a>`;
});

withdrawBtn.addEventListener("click",()=>{
  if(!currentUser){ alert("Login first"); return; }
  if(currentUser.balance <= 0){ withdrawMsg.textContent="No balance"; return; }

  const code = prompt("Enter admin code");
  if(code !== "1234"){ alert("Wrong code"); return; }

  currentUser.balance = 0;
  updateDashboard();
  withdrawMsg.textContent="Withdraw approved";
  db.collection("users").doc(currentUser.id).set(currentUser, {merge:true});
});

updateDashboard();
});
