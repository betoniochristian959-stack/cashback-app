convertBtn.onclick = () => {

  if (!currentUser) return alert("Login first");

  const link = linkInput.value.trim().toLowerCase();

  if (!link) return alert("Paste a link");

  let result = "";

  if (link.includes("shopee.ph")) {
    result = "https://s.shopee.ph/AABBJBucdn";
  } 
  else if (link.includes("tiktok.com") || link.includes("vt.tiktok.com")) {
    result = "https://vt.tiktok.com/PHLCCP7L9B/";
  } 
  else if (link.includes("lazada.com")) {
    result = "https://www.lazada.com.ph/";
  } 
  else {
    return alert("Invalid link (Shopee, TikTok, Lazada only)");
  }

  convertedLink.innerHTML = `
    <a href="${result}" target="_blank">
      👉 Open Affiliate Link
    </a>
  `;
};
