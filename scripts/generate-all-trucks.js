const fs   = require('fs');
const path = require('path');
const { trucks, APPSYNC_URL, API_KEY } = require('./trucks-data');

const ROOT = path.join(__dirname, '..', 'Food');

// ─────────────────────────────────────────────────────────────────────────────
// INDEX.HTML
// ─────────────────────────────────────────────────────────────────────────────
function genIndex(t) {
  const menuPreviewItems = t.menu.slice(0, 6).map(i =>
    `<div class="menu-card"><div class="mc-header"><span class="mc-name">${i.name}</span><span class="mc-price">$${i.price.toFixed(2)}</span></div><p>${i.description}</p></div>`
  ).join('\n            ');

  const hourRows = t.hours.map(([day, time]) =>
    `<li><span class="day">${day}</span><span class="time">${time}</span></li>`
  ).join('\n                    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.name} | ${t.tagline}</title>
  <meta name="description" content="${t.heroDesc}">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{
      --p:${t.primary};--pd:${t.primaryDark};--a:${t.accent};
      --dark:#111;--dark2:#1a1a1a;--dark3:#242424;
      --light:#f8f8f8;--white:#fff;--muted:rgba(255,255,255,0.55);
      --border:rgba(255,255,255,0.1);
    }
    html{scroll-behavior:smooth}
    body{font-family:'Outfit',sans-serif;background:var(--dark);color:#f0f0f0;overflow-x:hidden;line-height:1.6}

    /* NAV */
    header{position:fixed;top:0;width:100%;background:rgba(17,17,17,0.95);backdrop-filter:blur(12px);border-bottom:2px solid var(--p);z-index:100}
    nav{max-width:1200px;margin:0 auto;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}
    .logo{font-family:'Bebas Neue',cursive;font-size:1.8rem;color:#fff;text-decoration:none;letter-spacing:1px}
    .logo span{color:var(--p)}
    .nav-links{display:flex;gap:1.5rem;list-style:none;align-items:center}
    .nav-links a{color:rgba(255,255,255,0.65);text-decoration:none;font-size:.9rem;font-weight:500;transition:color .2s}
    .nav-links a:hover{color:var(--a)}
    .nav-cta{background:var(--p)!important;color:#fff!important;padding:.55rem 1.3rem!important;border-radius:6px!important;font-weight:700!important}
    .nav-cta:hover{background:var(--pd)!important;opacity:.9}

    /* HERO */
    .hero{margin-top:68px;min-height:90vh;background:linear-gradient(135deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.6) 50%,rgba(0,0,0,.8) 100%),linear-gradient(135deg,var(--pd) 0%,var(--dark) 60%);display:flex;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;position:relative;overflow:hidden}
    .hero::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;border:1px solid rgba(255,255,255,0.05);top:50%;left:50%;transform:translate(-50%,-50%)}
    .hero-inner{position:relative;z-index:1;max-width:700px}
    .hero-badge{display:inline-block;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);font-size:.75rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:.5rem 1.3rem;border-radius:50px;margin-bottom:1.5rem}
    .hero h1{font-family:'Bebas Neue',cursive;font-size:5rem;color:#fff;line-height:1;margin-bottom:.5rem;letter-spacing:2px}
    .hero h1 span{color:var(--a)}
    .hero-sub{font-size:1.1rem;color:rgba(255,255,255,.65);max-width:500px;margin:1rem auto 2.5rem;line-height:1.75}
    .hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
    .btn-main{background:var(--p);color:#fff;padding:.9rem 2rem;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem;transition:all .25s;box-shadow:0 6px 25px rgba(0,0,0,.35)}
    .btn-main:hover{background:var(--pd);transform:translateY(-2px)}
    .btn-ghost{border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.7);padding:.9rem 2rem;border-radius:6px;text-decoration:none;font-weight:600;font-size:1rem;transition:all .25s}
    .btn-ghost:hover{border-color:var(--a);color:var(--a)}

    /* FEATURES STRIP */
    .features{background:var(--p);padding:0}
    .feat-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(${t.features.length},1fr)}
    .feat-item{padding:1.6rem 2rem;border-right:1px solid rgba(0,0,0,.12);display:flex;align-items:center;gap:.8rem}
    .feat-item:last-child{border-right:none}
    .feat-item h3{color:#000;font-size:.88rem;font-weight:800;margin-bottom:.1rem}
    .feat-item p{color:rgba(0,0,0,.55);font-size:.78rem}
    .feat-icon{font-size:1.5rem;flex-shrink:0}

    /* MENU PREVIEW */
    .menu-sec{padding:5rem 2rem;background:var(--dark2)}
    .menu-sec .inner{max-width:1100px;margin:0 auto}
    .sec-label{font-size:.72rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:.6rem;display:block}
    .sec-title{font-family:'Bebas Neue',cursive;font-size:2.8rem;color:#fff;letter-spacing:1px;margin-bottom;margin-bottom:.5rem}
    .menu-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem}
    .view-all{color:var(--a);text-decoration:none;font-weight:600;font-size:.9rem;border-bottom:1px solid transparent;transition:border-color .2s}
    .view-all:hover{border-bottom-color:var(--a)}
    .menu-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .menu-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-left:3px solid var(--p);border-radius:10px;padding:1.2rem;transition:all .2s}
    .menu-card:hover{background:rgba(255,255,255,.07);transform:translateY(-2px)}
    .mc-header{display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.4rem}
    .mc-name{font-size:.95rem;font-weight:700;color:#fff;line-height:1.3}
    .mc-price{font-size:1rem;font-weight:800;color:var(--a);white-space:nowrap}
    .menu-card p{color:rgba(255,255,255,.45);font-size:.82rem;line-height:1.5}
    .order-banner{margin-top:2.5rem;background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.02) 100%);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:2.5rem 3rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap}
    .order-banner h3{font-family:'Bebas Neue',cursive;font-size:1.8rem;color:#fff;letter-spacing:1px}
    .order-banner p{color:var(--muted);margin-top:.2rem;font-size:.9rem}

    /* ABOUT */
    .about{padding:5rem 2rem;background:var(--dark3)}
    .about .inner{max-width:800px;margin:0 auto;text-align:center}
    .about p{color:rgba(255,255,255,.7);font-size:1.05rem;line-height:1.85;margin-bottom:1rem}
    .pills{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:1.5rem}
    .pill{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);padding:.45rem 1rem;border-radius:4px;font-size:.82rem;font-weight:600;color:rgba(255,255,255,.7)}

    /* LOCATION */
    .location{padding:5rem 2rem;background:var(--dark2)}
    .location .inner{max-width:1000px;margin:0 auto}
    .loc-head{text-align:center;margin-bottom:3rem}
    .loc-grid{display:grid;grid-template-columns:1fr 1.3fr;gap:2.5rem;align-items:start}
    .loc-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:2rem}
    .info-block{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.06)}
    .info-block:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
    .info-block h4{font-size:.7rem;text-transform:uppercase;letter-spacing:2px;color:var(--a);font-weight:700;margin-bottom:.5rem}
    .info-block p,.info-block a{color:rgba(255,255,255,.75);text-decoration:none;font-size:.95rem;font-weight:500}
    .info-block a:hover{color:var(--a)}
    .hours-list{list-style:none}
    .hours-list li{display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.85rem}
    .hours-list li:last-child{border-bottom:none}
    .day{font-weight:600;color:rgba(255,255,255,.8)}
    .time{color:var(--muted)}
    .map-frame{border-radius:14px;overflow:hidden;height:360px;box-shadow:0 8px 30px rgba(0,0,0,.4)}
    .map-frame iframe{width:100%;height:100%;border:none}

    /* FOOTER */
    footer{background:var(--dark);border-top:1px solid rgba(255,255,255,.06);padding:2.5rem 2rem}
    .foot-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
    .foot-logo{font-family:'Bebas Neue',cursive;font-size:1.4rem;color:#fff;letter-spacing:1px}
    .foot-logo span{color:var(--p)}
    .foot-copy{color:rgba(255,255,255,.25);font-size:.8rem}

    @media(max-width:768px){
      .feat-grid{grid-template-columns:1fr 1fr}
      .feat-item{border-right:none;border-bottom:1px solid rgba(0,0,0,.1)}
      .menu-grid{grid-template-columns:1fr}
      .menu-head{flex-direction:column;align-items:flex-start}
      .order-banner{flex-direction:column;text-align:center;padding:2rem}
      .loc-grid{grid-template-columns:1fr}
      .hero h1{font-size:3.5rem}
      nav .nav-links{display:none}
    }
  </style>
</head>
<body>

<header>
  <nav>
    <a href="index.html" class="logo">${t.emoji} <span>${t.name}</span></a>
    <ul class="nav-links">
      <li><a href="#menu">Menu</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#location">Hours &amp; Location</a></li>
      <li><a href="order.html" class="nav-cta">${t.emoji} Order Now</a></li>
    </ul>
  </nav>
</header>

<section class="hero" id="home">
  <div class="hero-inner">
    <div class="hero-badge">📍 Salado, TX · Demo</div>
    <h1>${t.name.toUpperCase().replace("'","&#39;")}<span>.</span></h1>
    <p class="hero-sub">${t.heroDesc}</p>
    <div class="hero-btns">
      <a href="order.html" class="btn-main">${t.emoji} Order Now</a>
      <a href="#menu" class="btn-ghost">View Menu</a>
    </div>
  </div>
</section>

<div class="features">
  <div class="feat-grid">
    ${t.features.map(f => `<div class="feat-item"><span class="feat-icon">✓</span><div><h3>${f}</h3></div></div>`).join('\n    ')}
  </div>
</div>

<section class="menu-sec" id="menu">
  <div class="inner">
    <div class="menu-head">
      <div>
        <span class="sec-label">What We're Serving</span>
        <h2 class="sec-title">Menu Highlights</h2>
      </div>
      <a href="order.html" class="view-all">Order the Full Menu →</a>
    </div>
    <div class="menu-grid">
      ${menuPreviewItems}
    </div>
    <div class="order-banner">
      <div>
        <h3>Order for Pickup</h3>
        <p>Order ahead — we'll have it ready when you arrive</p>
      </div>
      <a href="order.html" class="btn-main">${t.emoji} Order Now</a>
    </div>
  </div>
</section>

<section class="about" id="about">
  <div class="inner">
    <span class="sec-label">Our Story</span>
    <h2 class="sec-title">About ${t.name}</h2>
    <p>${t.about}</p>
    <div class="pills">
      ${t.features.map(f => `<span class="pill">${f}</span>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="location" id="location">
  <div class="inner">
    <div class="loc-head">
      <span class="sec-label">Find Us</span>
      <h2 class="sec-title">Hours &amp; Location</h2>
    </div>
    <div class="loc-grid">
      <div class="loc-card">
        <div class="info-block">
          <h4>📍 Address</h4>
          <p>${t.address}</p>
        </div>
        ${t.phone ? `<div class="info-block"><h4>📞 Phone</h4><a href="tel:${t.phone.replace(/\D/g,'')}">${t.phone}</a></div>` : ''}
        <div class="info-block">
          <h4>🕐 Hours</h4>
          <ul class="hours-list">
            ${hourRows}
          </ul>
        </div>
        <div class="info-block">
          <a href="order.html" class="btn-main" style="display:inline-block">${t.emoji} Order for Pickup</a>
        </div>
      </div>
      <div class="map-frame">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27417.9!2d-97.535!3d30.9527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865b0440b84d!2sSalado%2C+TX+76571!5e0!3m2!1sen!2sus!4v1700000000000" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="foot-inner">
    <div class="foot-logo">${t.emoji} <span>${t.name}</span></div>
    <p class="foot-copy">&copy; 2026 ${t.name} &mdash; <a href="staff-dashboard.html" style="color:rgba(255,255,255,.15);text-decoration:none;font-size:.75rem">Staff</a></p>
  </div>
</footer>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER.HTML
// ─────────────────────────────────────────────────────────────────────────────
function genOrder(t) {
  const cats = JSON.stringify(t.categories);
  const itemPrefix = t.menu[0].itemId.split('-')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order for Pickup — ${t.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--p:${t.primary};--pd:${t.primaryDark};--a:${t.accent};--bg:#0f0f0f;--bg2:#1a1a1a;--bg3:#242424;--border:#333;--text:#f0f0f0;--muted:#888}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
    header{background:var(--bg2);border-bottom:3px solid var(--p);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
    .logo{font-family:'Bebas Neue',cursive;font-size:1.8rem;color:#fff;text-decoration:none;letter-spacing:2px}
    .logo span{color:var(--p)}
    .cart-badge{background:var(--p);color:#fff;padding:.5rem 1.2rem;border-radius:50px;font-weight:600;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:.5rem;transition:background .2s;border:none}
    .cart-badge:hover{background:var(--pd)}
    .cart-count{background:#fff;color:var(--p);width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800}
    .main-layout{display:grid;grid-template-columns:1fr 340px;gap:2rem;max-width:1200px;margin:2rem auto;padding:0 2rem}
    .cat-tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .cat-tab{padding:.45rem 1.1rem;border-radius:6px;font-size:.82rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .2s;font-family:'Outfit',sans-serif}
    .cat-tab.active,.cat-tab:hover{background:var(--p);color:#fff;border-color:var(--p)}
    .menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
    .menu-item{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1.2rem;transition:all .2s}
    .menu-item:hover{border-color:var(--p);transform:translateY(-1px)}
    .item-name{font-weight:700;color:#fff;margin-bottom:.3rem;font-size:.95rem}
    .item-desc{color:var(--muted);font-size:.8rem;line-height:1.5;margin-bottom:.8rem}
    .item-footer{display:flex;justify-content:space-between;align-items:center}
    .item-price{font-weight:800;color:var(--a);font-size:1rem}
    .add-btn{background:var(--p);color:#fff;border:none;padding:.4rem 1rem;border-radius:6px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.85rem;transition:background .2s}
    .add-btn:hover{background:var(--pd)}
    .customize-select{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:.4rem .6rem;border-radius:6px;font-family:'Outfit',sans-serif;font-size:.8rem;margin-bottom:.6rem}
    .cart-section{background:var(--bg2);border-radius:14px;padding:1.5rem;position:sticky;top:90px;height:fit-content;border:1px solid var(--border)}
    .cart-title{font-family:'Bebas Neue',cursive;font-size:1.6rem;color:#fff;letter-spacing:1px;margin-bottom:1rem;border-bottom:2px solid var(--p);padding-bottom:.5rem}
    .cart-empty{text-align:center;padding:2rem;color:var(--muted)}
    .cart-empty .emoji{font-size:2.5rem;display:block;margin-bottom:.5rem}
    .cart-item{display:flex;align-items:flex-start;gap:.8rem;padding:.6rem 0;border-bottom:1px solid var(--border)}
    .cart-item-info{flex:1}
    .cart-item-name{font-size:.88rem;font-weight:600;color:#fff}
    .cart-item-customization{font-size:.75rem;color:var(--muted)}
    .cart-item-price{font-weight:700;color:var(--a);font-size:.9rem;white-space:nowrap}
    .remove-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.85rem;padding:.1rem .3rem;transition:color .2s}
    .remove-btn:hover{color:#ff6b6b}
    .cart-total-row{display:flex;justify-content:space-between;font-weight:800;padding:.8rem 0 0;color:#fff;font-size:1rem}
    .total-amount{color:var(--a);font-size:1.1rem}
    .customer-form{margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:.6rem}
    .form-input{background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:.65rem .9rem;border-radius:8px;font-family:'Outfit',sans-serif;font-size:.9rem}
    .form-input:focus{outline:none;border-color:var(--p)}
    .place-order-btn{background:var(--p);color:#fff;border:none;padding:.9rem;border-radius:8px;font-family:'Bebas Neue',cursive;font-size:1.2rem;letter-spacing:1px;cursor:pointer;width:100%;margin-top:.4rem;transition:background .2s}
    .place-order-btn:hover:not(:disabled){background:var(--pd)}
    .place-order-btn:disabled{opacity:.5;cursor:not-allowed}
    .error-msg{text-align:center;padding:2rem;color:#ff8888}
    #confirmationScreen{display:none;max-width:600px;margin:4rem auto;text-align:center;padding:2rem}
    .confirm-icon{font-size:4rem;margin-bottom:1rem}
    .confirm-title{font-family:'Bebas Neue',cursive;font-size:2.5rem;color:var(--a);letter-spacing:1px;margin-bottom:.5rem}
    .order-number{background:var(--bg2);border:2px solid var(--p);border-radius:10px;padding:1.2rem;margin:1.5rem 0;font-size:1.1rem;font-weight:700;color:#fff}
    .window-notice{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:1rem 1.5rem;margin:1rem 0;color:rgba(255,255,255,.8);font-size:.95rem}
    .track-link,.new-order-btn{display:inline-block;margin-top:1rem;padding:.75rem 1.8rem;border-radius:8px;font-weight:700;text-decoration:none;font-size:.95rem}
    .track-link{background:var(--p);color:#fff;margin-right:.5rem}
    .new-order-btn{background:var(--bg2);border:1px solid var(--border);color:var(--text);cursor:pointer;font-family:'Outfit',sans-serif}
    @media(max-width:768px){.main-layout{grid-template-columns:1fr}.cart-section{position:static}}
  </style>
</head>
<body>
<header>
  <a href="index.html" class="logo">${t.emoji} <span>${t.name}</span></a>
  <button class="cart-badge" onclick="scrollToCart()">
    🛒 Cart <span class="cart-count" id="cartCount">0</span>
  </button>
</header>

<div id="mainContent">
  <div class="main-layout">
    <div>
      <div id="catTabs" class="cat-tabs"></div>
      <div id="menuContainer"><p style="color:var(--muted);text-align:center;padding:3rem">Loading menu...</p></div>
    </div>
    <div class="cart-section" id="cartSection">
      <div class="cart-title">Your Order</div>
      <div id="cartContent"><div class="cart-empty"><span class="emoji">${t.emoji}</span><p>Add items to get started!</p></div></div>
      <div class="customer-form">
        <input class="form-input" id="customerName" type="text" placeholder="Your name *" required>
        <input class="form-input" id="customerPhone" type="tel" placeholder="Phone (optional)">
        <textarea class="form-input" id="specialInstructions" rows="2" placeholder="Special instructions..." style="resize:none"></textarea>
        <button class="place-order-btn" id="placeOrderBtn" disabled onclick="placeOrder()">PLACE PICKUP ORDER</button>
      </div>
    </div>
  </div>
</div>

<div id="confirmationScreen">
  <div class="confirm-icon">✅</div>
  <div class="confirm-title">Order Placed!</div>
  <div class="order-number">Order #<span id="confirmOrderNumber"></span></div>
  <div class="window-notice">📍 Pick up at: ${t.address}</div>
  <a href="" id="trackOrderLink" class="track-link">📍 Track Your Order</a>
  <button class="new-order-btn" onclick="location.reload()">Place Another Order</button>
</div>

<script type="module">
  const APPSYNC_URL="${APPSYNC_URL}";
  const API_KEY="${API_KEY}";
  async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
  let allMenuItems=[],cart=[],activeCategory="All";
  const CATEGORIES=["All",...${cats}];
  async function loadMenu(){try{const d=await gql('query{listMenuItems(limit:200,filter:{itemId:{beginsWith:"${itemPrefix}-"}}){items{id itemId name description price category available customizationOptions}}}');allMenuItems=(d.listMenuItems.items||[]).filter(i=>i.available!==false).sort((a,b)=>a.name.localeCompare(b.name));renderTabs();renderMenu()}catch(e){document.getElementById("menuContainer").innerHTML='<div class="error-msg">⚠️ Could not load menu.<br><small>'+e.message+'</small></div>'}}
  function renderTabs(){const counts={};allMenuItems.forEach(i=>{counts[i.category]=(counts[i.category]||0)+1});document.getElementById("catTabs").innerHTML=CATEGORIES.filter(c=>c==="All"||counts[c]).map(c=>{const n=c==="All"?allMenuItems.length:(counts[c]||0);return\`<button class="cat-tab \${c===activeCategory?"active":""}" onclick="window.setCategory('\${c}')">\${c} (\${n})</button>\`}).join("")}
  function renderMenu(){const items=activeCategory==="All"?allMenuItems:allMenuItems.filter(i=>i.category===activeCategory);if(!items.length){document.getElementById("menuContainer").innerHTML='<p style="color:var(--muted);text-align:center;padding:2rem">No items.</p>';return}document.getElementById("menuContainer").innerHTML='<div class="menu-grid">'+items.map(item=>{let opts=[];try{opts=JSON.parse(item.customizationOptions||"[]")}catch(e){}const sid='opt_'+item.itemId;return\`<div class="menu-item"><div class="item-name">\${item.name}</div><div class="item-desc">\${item.description||""}</div>\${opts.length?'<select class="customize-select" id="'+sid+'"><option value="">Choose option...</option>'+opts.map(o=>'<option value="'+o+'">'+o+'</option>').join("")+'</select>':""}<div class="item-footer"><span class="item-price">$\${parseFloat(item.price).toFixed(2)}</span><button class="add-btn" onclick="window.addToCart('\${item.itemId}','\${item.name.replace(/'/g,"\\\\'")}',\${item.price},'\${sid}',\${opts.length>0})">+ Add</button></div></div>\`}).join("")+"</div>"}
  window.addToCart=function(id,name,price,sid,hasOpts){if(hasOpts){const s=document.getElementById(sid);if(!s||!s.value){s.style.borderColor="var(--p)";s.focus();setTimeout(()=>{s.style.borderColor=""},2000);return}cart.push({itemId:id,name,price:parseFloat(price),customization:s.value})}else{cart.push({itemId:id,name,price:parseFloat(price),customization:""})}renderCart()};
  window.removeFromCart=function(i){cart.splice(i,1);renderCart()};
  function renderCart(){const total=cart.reduce((s,i)=>s+i.price,0);document.getElementById("cartCount").textContent=cart.length;document.getElementById("placeOrderBtn").disabled=cart.length===0;if(!cart.length){document.getElementById("cartContent").innerHTML='<div class="cart-empty"><span class="emoji">${t.emoji}</span><p>Add items to get started!</p></div>';return}document.getElementById("cartContent").innerHTML=cart.map((item,i)=>'<div class="cart-item"><div class="cart-item-info"><div class="cart-item-name">'+item.name+'</div>'+(item.customization?'<div class="cart-item-customization">'+item.customization+'</div>':'')+'</div><span class="cart-item-price">$'+item.price.toFixed(2)+'</span><button class="remove-btn" onclick="window.removeFromCart('+i+')">✕</button></div>').join("")+'<div class="cart-total-row"><span>Total</span><span class="total-amount">$'+total.toFixed(2)+'</span></div>'}
  window.placeOrder=async function(){const name=document.getElementById("customerName").value.trim();if(!name){alert("Please enter your name.");return}if(!cart.length){alert("Your cart is empty!");return}const btn=document.getElementById("placeOrderBtn");btn.disabled=true;btn.textContent="Placing Order...";const orderId='ORD-'+Date.now();try{await gql('mutation CreateOrder($input:CreateOrderInput!){createOrder(input:$input){id orderId}}',{input:{orderId,customerName:name,customerPhone:document.getElementById("customerPhone").value.trim()||null,orderType:"Pickup",tableNumber:null,items:JSON.stringify(cart),totalPrice:cart.reduce((s,i)=>s+i.price,0),specialInstructions:document.getElementById("specialInstructions").value.trim(),status:"Pending",assignedServer:"Window",source:"${t.source}",timestamp:new Date().toISOString()}});document.getElementById("mainContent").style.display="none";document.getElementById("confirmationScreen").style.display="block";document.getElementById("confirmOrderNumber").textContent=orderId;document.getElementById("trackOrderLink").href="track-order.html?orderId="+orderId}catch(e){alert("Error: "+e.message);btn.disabled=false;btn.textContent="PLACE PICKUP ORDER"}};
  window.setCategory=function(cat){activeCategory=cat;renderTabs();renderMenu()};
  window.scrollToCart=function(){document.getElementById("cartSection").scrollIntoView({behavior:"smooth"})};
  loadMenu();
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK-ORDER.HTML
// ─────────────────────────────────────────────────────────────────────────────
function genTrack(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Track Your Order — ${t.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--p:${t.primary};--pd:${t.primaryDark};--a:${t.accent};--bg:#0f0f0f;--bg2:#1a1a1a;--bg3:#242424;--border:#333;--text:#f0f0f0;--muted:#888}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
    header{background:var(--bg2);border-bottom:3px solid var(--p);padding:1rem 2rem;display:flex;align-items:center;gap:1rem}
    .logo{font-family:'Bebas Neue',cursive;font-size:1.8rem;color:#fff;text-decoration:none;letter-spacing:2px}
    .logo span{color:var(--p)}
    .tracker{max-width:600px;margin:3rem auto;padding:0 1.5rem}
    .search-box{background:var(--bg2);border-radius:14px;padding:2rem;margin-bottom:2rem;border:1px solid var(--border)}
    .search-box h2{font-family:'Bebas Neue',cursive;font-size:1.8rem;color:#fff;letter-spacing:1px;margin-bottom:1rem}
    .search-row{display:flex;gap:.75rem}
    .search-input{flex:1;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:.7rem 1rem;border-radius:8px;font-family:'Outfit',sans-serif;font-size:.9rem}
    .search-input:focus{outline:none;border-color:var(--p)}
    .search-btn{background:var(--p);color:#fff;border:none;padding:.7rem 1.5rem;border-radius:8px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;transition:background .2s}
    .search-btn:hover{background:var(--pd)}
    .order-card{background:var(--bg2);border-radius:14px;padding:2rem;border:1px solid var(--border);display:none}
    .order-card.visible{display:block}
    .order-id{font-size:.8rem;color:var(--muted);margin-bottom:.3rem}
    .customer-name{font-size:1.3rem;font-weight:700;color:#fff;margin-bottom:1.5rem}
    .status-display{text-align:center;padding:2rem 1rem;background:var(--bg3);border-radius:12px;margin-bottom:1.5rem}
    .status-emoji{font-size:3rem;margin-bottom:.5rem}
    .status-label{font-family:'Bebas Neue',cursive;font-size:1.8rem;letter-spacing:1px}
    .status-Pending{color:#F59E0B}
    .status-Preparing{color:var(--p)}
    .status-Ready{color:#34D399}
    .status-Completed{color:var(--muted)}
    .status-msg{color:var(--muted);font-size:.9rem;margin-top:.5rem}
    .window-notice{background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.25);border-radius:10px;padding:1rem;text-align:center;color:#34D399;font-weight:600;margin-bottom:1rem;display:none}
    .order-items{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border)}
    .order-items h4{color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:2px;margin-bottom:.8rem}
    .order-item-row{display:flex;justify-content:space-between;padding:.3rem 0;font-size:.88rem;color:rgba(255,255,255,.7)}
    .order-total{display:flex;justify-content:space-between;padding:.6rem 0 0;font-weight:700;color:#fff;border-top:1px solid var(--border);margin-top:.5rem}
    .order-total span:last-child{color:var(--a)}
    .refresh-btn{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:.7rem;border-radius:8px;cursor:pointer;font-family:'Outfit',sans-serif;margin-top:1rem;transition:all .2s}
    .refresh-btn:hover{border-color:var(--p);color:var(--p)}
    .error-card{background:var(--bg2);border-radius:14px;padding:2rem;text-align:center;display:none}
    .error-card.visible{display:block}
  </style>
</head>
<body>
<header>
  <a href="index.html" class="logo">${t.emoji} <span>${t.name}</span></a>
</header>
<div class="tracker">
  <div class="search-box">
    <h2>Track Your Order</h2>
    <div class="search-row">
      <input class="search-input" id="orderInput" type="text" placeholder="Enter order ID (e.g. ORD-1234567890)">
      <button class="search-btn" onclick="lookupOrder()">Track</button>
    </div>
  </div>
  <div class="order-card" id="orderCard">
    <div class="order-id" id="displayOrderId"></div>
    <div class="customer-name" id="displayName"></div>
    <div class="status-display">
      <div class="status-emoji" id="statusEmoji"></div>
      <div class="status-label" id="statusLabel"></div>
      <div class="status-msg" id="statusMsg"></div>
    </div>
    <div class="window-notice" id="windowNotice">🎉 Your order is ready! Please pick up at: ${t.address}</div>
    <div class="order-items">
      <h4>Your Items</h4>
      <div id="itemsList"></div>
      <div class="order-total"><span>Total</span><span id="orderTotal"></span></div>
    </div>
    <button class="refresh-btn" onclick="lookupOrder()">↻ Refresh Status</button>
  </div>
  <div class="error-card" id="errorCard">
    <p style="color:#ff8888;font-size:1.1rem">Order not found. Check your order ID and try again.</p>
  </div>
</div>
<script>
  const APPSYNC_URL="${APPSYNC_URL}",API_KEY="${API_KEY}";
  const STATUS_MAP={Pending:{emoji:"⏳",label:"Order Received",msg:"We've got your order! Preparing soon."},Preparing:{emoji:"🔥",label:"Being Prepared",msg:"Your order is being prepared right now!"},Ready:{emoji:"✅",label:"Ready for Pickup!",msg:"Head to the window — your order is ready!"},Completed:{emoji:"🎉",label:"Order Complete",msg:"Thanks for your order. See you next time!"}};
  async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
  async function lookupOrder(){
    const id=(document.getElementById("orderInput").value||"").trim();
    if(!id){alert("Enter an order ID");return}
    document.getElementById("orderCard").classList.remove("visible");
    document.getElementById("errorCard").classList.remove("visible");
    try{
      const d=await gql('query ListOrders($filter:ModelOrderFilterInput){listOrders(filter:$filter,limit:5){items{id orderId customerName items totalPrice status timestamp}}}',{filter:{orderId:{eq:id}}});
      const orders=d.listOrders?.items||[];
      if(!orders.length){document.getElementById("errorCard").classList.add("visible");return}
      const o=orders[0];
      const s=STATUS_MAP[o.status]||{emoji:"❓",label:o.status,msg:""};
      document.getElementById("displayOrderId").textContent="Order #"+o.orderId;
      document.getElementById("displayName").textContent=o.customerName;
      document.getElementById("statusEmoji").textContent=s.emoji;
      document.getElementById("statusLabel").textContent=s.label;
      document.getElementById("statusLabel").className="status-label status-"+o.status;
      document.getElementById("statusMsg").textContent=s.msg;
      document.getElementById("windowNotice").style.display=o.status==="Ready"?"block":"none";
      let items=[];try{items=JSON.parse(o.items||"[]")}catch(e){}
      document.getElementById("itemsList").innerHTML=items.map(i=>'<div class="order-item-row"><span>'+i.name+(i.customization?' ('+i.customization+')':'')+'</span><span>$'+parseFloat(i.price).toFixed(2)+'</span></div>').join("");
      document.getElementById("orderTotal").textContent="$"+parseFloat(o.totalPrice).toFixed(2);
      document.getElementById("orderCard").classList.add("visible");
    }catch(e){document.getElementById("errorCard").classList.add("visible")}
  }
  const params=new URLSearchParams(location.search);
  if(params.get("orderId")){document.getElementById("orderInput").value=params.get("orderId");lookupOrder()}
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF-DASHBOARD.HTML
// ─────────────────────────────────────────────────────────────────────────────
function genStaff(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staff Dashboard — ${t.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--p:${t.primary};--pd:${t.primaryDark};--a:${t.accent};--bg:#0f0f0f;--bg2:#1a1a1a;--bg3:#242424;--border:#333;--text:#f0f0f0;--muted:#888;--green:#34D399;--blue:#4da6ff;--orange:#F59E0B}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
    /* LOGIN */
    #loginScreen{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg)}
    .login-box{background:var(--bg2);border:1px solid var(--border);border-top:4px solid var(--p);border-radius:16px;padding:2.5rem;width:100%;max-width:400px;text-align:center}
    .login-logo{font-family:'Bebas Neue',cursive;font-size:2rem;color:#fff;letter-spacing:2px;margin-bottom:.25rem}
    .login-logo span{color:var(--p)}
    .login-subtitle{color:var(--muted);font-size:.85rem;margin-bottom:2rem}
    .login-input{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:.8rem 1rem;border-radius:8px;font-size:1rem;font-family:'Outfit',sans-serif;margin-bottom:1rem}
    .login-input:focus{outline:none;border-color:var(--p)}
    .login-btn{width:100%;background:var(--p);color:#fff;border:none;padding:.9rem;border-radius:8px;font-family:'Bebas Neue',cursive;font-size:1.3rem;letter-spacing:1px;cursor:pointer;transition:background .2s}
    .login-btn:hover{background:var(--pd)}
    .login-error{color:#ff8888;font-size:.85rem;margin-top:.5rem;display:none}
    /* DASHBOARD */
    #dashboardScreen{display:none}
    .dash-header{background:var(--bg2);border-bottom:3px solid var(--p);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between}
    .dash-logo{font-family:'Bebas Neue',cursive;font-size:1.6rem;color:#fff;letter-spacing:1px}
    .dash-logo span{color:var(--p)}
    .header-right{display:flex;align-items:center;gap:1rem}
    .new-order-alert{background:var(--orange);color:#000;padding:.4rem 1rem;border-radius:6px;font-weight:700;font-size:.85rem;display:none;animation:blink 1s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.5}}
    .staff-badge{display:flex;align-items:center;gap:.4rem;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);padding:.4rem .9rem;border-radius:6px;font-size:.8rem;color:var(--green);font-weight:700}
    .staff-dot{width:7px;height:7px;background:var(--green);border-radius:50%;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    .logout-btn{background:var(--bg3);border:1px solid var(--border);color:var(--muted);padding:.4rem .9rem;border-radius:6px;cursor:pointer;font-size:.82rem;font-family:'Outfit',sans-serif;transition:all .2s}
    .logout-btn:hover{border-color:var(--p);color:var(--p)}
    .stats-bar{background:var(--bg2);border-bottom:1px solid var(--border);padding:.75rem 2rem;display:flex;gap:.5rem;flex-wrap:wrap}
    .stat-chip{background:var(--bg3);border:1px solid var(--border);padding:.4rem 1rem;border-radius:6px;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.4rem}
    .stat-chip:hover,.stat-chip.active{border-color:var(--p);color:var(--p)}
    .chip-count{background:var(--bg);padding:.1rem .45rem;border-radius:4px;font-size:.75rem;font-weight:700}
    .chip-count.urgent{color:#ff8888}
    .dashboard-main{padding:1.5rem 2rem;max-width:1400px;margin:0 auto}
    .refresh-info{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;color:var(--muted);font-size:.82rem}
    .refresh-btn{background:var(--bg2);border:1px solid var(--border);color:var(--muted);padding:.35rem .8rem;border-radius:6px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.8rem;transition:all .2s}
    .refresh-btn:hover{border-color:var(--p);color:var(--p)}
    .refresh-btn.spinning{animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .orders-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
    .order-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.3rem;border-left:4px solid var(--border)}
    .order-card.status-Pending{border-left-color:var(--orange)}
    .order-card.status-Preparing{border-left-color:var(--p)}
    .order-card.status-Ready{border-left-color:var(--green)}
    .order-card.status-Completed{border-left-color:var(--border);opacity:.6}
    .oc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.8rem}
    .oc-id{font-weight:700;color:#fff;font-size:.95rem}
    .oc-time{font-size:.75rem;color:var(--muted)}
    .oc-customer{font-size:.9rem;font-weight:600;color:var(--a);margin-bottom:.6rem}
    .oc-items{font-size:.82rem;color:var(--muted);margin-bottom:.8rem;line-height:1.5}
    .oc-total{font-weight:700;color:#fff;font-size:.9rem;margin-bottom:.8rem}
    .oc-special{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);border-radius:6px;padding:.4rem .6rem;font-size:.78rem;color:var(--orange);margin-bottom:.8rem}
    .status-badge{display:inline-block;padding:.2rem .7rem;border-radius:4px;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:.8rem}
    .badge-Pending{background:rgba(245,158,11,.12);color:var(--orange);border:1px solid rgba(245,158,11,.25)}
    .badge-Preparing{background:rgba(${hexToRgb(t.primary)},.12);color:var(--p);border:1px solid rgba(${hexToRgb(t.primary)},.25)}
    .badge-Ready{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.25)}
    .badge-Completed{background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--border)}
    .action-btns{display:flex;gap:.5rem;flex-wrap:wrap}
    .action-btn{border:none;padding:.5rem 1rem;border-radius:6px;font-weight:700;cursor:pointer;font-size:.82rem;font-family:'Outfit',sans-serif;transition:all .2s}
    .btn-start{background:var(--p);color:#fff}
    .btn-start:hover{background:var(--pd)}
    .btn-ready{background:var(--green);color:#000}
    .btn-ready:hover{opacity:.85}
    .btn-complete{background:var(--bg3);border:1px solid var(--border);color:var(--muted)}
    .btn-complete:hover{border-color:var(--green);color:var(--green)}
    .empty-state{text-align:center;padding:4rem;color:var(--muted);grid-column:1/-1}
    .empty-icon{font-size:3rem;margin-bottom:1rem}
    .loading-overlay{text-align:center;padding:3rem;color:var(--muted);grid-column:1/-1}
    .spinner{width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--p);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 1rem}
  </style>
</head>
<body>

<!-- LOGIN -->
<div id="loginScreen">
  <div class="login-box">
    <div class="login-logo">${t.emoji} <span>${t.name}</span></div>
    <div class="login-subtitle">Staff Dashboard</div>
    <form id="loginForm" onsubmit="handleLogin(event)">
      <input class="login-input" type="password" id="loginPassword" placeholder="Staff password" autocomplete="current-password">
      <button type="submit" class="login-btn">Sign In</button>
      <div class="login-error" id="loginError"></div>
    </form>
  </div>
</div>

<!-- DASHBOARD -->
<div id="dashboardScreen">
  <header class="dash-header">
    <div class="dash-logo">${t.emoji} <span>${t.name}</span> — Orders</div>
    <div class="header-right">
      <div class="new-order-alert" id="newOrderAlert">🔔 New Order!</div>
      <div class="staff-badge"><div class="staff-dot"></div><span>Live</span></div>
      <button class="logout-btn" onclick="handleLogout()">Sign Out</button>
    </div>
  </header>
  <div class="stats-bar">
    <div class="stat-chip active" id="chip-active" onclick="setFilter('active')">Active <span class="chip-count" id="count-active">0</span></div>
    <div class="stat-chip" id="chip-Pending" onclick="setFilter('Pending')">⏳ Pending <span class="chip-count urgent" id="count-Pending">0</span></div>
    <div class="stat-chip" id="chip-Preparing" onclick="setFilter('Preparing')">🔥 Preparing <span class="chip-count" id="count-Preparing">0</span></div>
    <div class="stat-chip" id="chip-Ready" onclick="setFilter('Ready')">✅ Ready <span class="chip-count" id="count-Ready">0</span></div>
    <div class="stat-chip" id="chip-Completed" onclick="setFilter('Completed')">📦 Picked Up <span class="chip-count" id="count-Completed">0</span></div>
  </div>
  <div class="dashboard-main">
    <div class="refresh-info">
      <span id="lastRefreshText">Loading...</span>
      <button class="refresh-btn" id="refreshBtn" onclick="loadOrders()">↻ Refresh</button>
    </div>
    <div class="orders-grid" id="ordersGrid">
      <div class="loading-overlay"><div class="spinner"></div><p>Loading orders...</p></div>
    </div>
  </div>
</div>

<script>
const APPSYNC_URL="${APPSYNC_URL}",API_KEY="${API_KEY}",STAFF_PASSWORD="${t.password}";
function handleLogin(e){e.preventDefault();if(document.getElementById("loginPassword").value!==STAFF_PASSWORD){const el=document.getElementById("loginError");el.textContent="Incorrect password.";el.style.display="block";document.getElementById("loginPassword").value="";return}sessionStorage.setItem("staffAuth_${t.source}","1");showDashboard()}
function handleLogout(){sessionStorage.removeItem("staffAuth_${t.source}");document.getElementById("dashboardScreen").style.display="none";document.getElementById("loginScreen").style.display="flex";clearInterval(refreshInterval);document.getElementById("loginForm").reset()}
window.onload=function(){sessionStorage.getItem("staffAuth_${t.source}")==="1"?showDashboard():(document.getElementById("loginScreen").style.display="flex")}
function showDashboard(){document.getElementById("loginScreen").style.display="none";document.getElementById("dashboardScreen").style.display="block";startDashboard()}
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
let allOrders=[],activeFilter="active",refreshInterval=null,prevPendingIds=new Set();
async function loadOrders(){
  const btn=document.getElementById("refreshBtn");btn.classList.add("spinning");
  try{
    const d=await gql(\`query{listOrders(limit:200,filter:{source:{eq:"${t.source}"}}){items{id orderId customerName orderType tableNumber items totalPrice specialInstructions status assignedServer timestamp source}}}\`);
    const orders=d.listOrders.items||[];
    const rank={Pending:0,Preparing:1,Ready:2,Completed:3};
    orders.sort((a,b)=>{const r=(rank[a.status]??4)-(rank[b.status]??4);return r!==0?r:new Date(a.timestamp)-new Date(b.timestamp)});
    const newIds=new Set(orders.filter(o=>o.status==="Pending").map(o=>o.id));
    if([...newIds].some(id=>!prevPendingIds.has(id))&&prevPendingIds.size>0)flashNewOrder();
    prevPendingIds=newIds;allOrders=orders;updateCounts();renderOrders();
    document.getElementById("lastRefreshText").textContent="Last refreshed at "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  }catch(e){document.getElementById("ordersGrid").innerHTML='<div class="empty-state"><div class="empty-icon">⚠️</div><p style="color:#ff8888">'+e.message+'</p></div>'}
  finally{btn.classList.remove("spinning")}
}
function flashNewOrder(){const el=document.getElementById("newOrderAlert");el.style.display="block";setTimeout(()=>{el.style.display="none"},5000)}
function updateCounts(){const today=new Date().toDateString();const c={Pending:0,Preparing:0,Ready:0,Completed:0};allOrders.forEach(o=>{if(o.status==="Completed"){if(new Date(o.timestamp).toDateString()===today)c.Completed++}else{c[o.status]=(c[o.status]||0)+1}});document.getElementById("count-active").textContent=c.Pending+c.Preparing+c.Ready;["Pending","Preparing","Ready","Completed"].forEach(s=>{document.getElementById("count-"+s).textContent=c[s]})}
function setFilter(f){activeFilter=f;document.querySelectorAll(".stat-chip").forEach(c=>c.classList.remove("active"));document.getElementById("chip-"+f).classList.add("active");renderOrders()}
function renderOrders(){
  const today=new Date().toDateString();
  const filtered=activeFilter==="active"?allOrders.filter(o=>o.status!=="Completed"):activeFilter==="Completed"?allOrders.filter(o=>o.status==="Completed"&&new Date(o.timestamp).toDateString()===today):allOrders.filter(o=>o.status===activeFilter);
  if(!filtered.length){document.getElementById("ordersGrid").innerHTML='<div class="empty-state"><div class="empty-icon">${t.emoji}</div><p>No orders here.</p></div>';return}
  document.getElementById("ordersGrid").innerHTML=filtered.map(o=>{
    let items=[];try{items=JSON.parse(o.items||"[]")}catch(e){}
    const t2=new Date(o.timestamp);const elapsed=Math.floor((Date.now()-t2)/60000);
    return \`<div class="order-card status-\${o.status}">
      <div class="oc-header"><span class="oc-id">#\${o.orderId}</span><span class="oc-time">\${elapsed}m ago</span></div>
      <div class="oc-customer">\${o.customerName}</div>
      <span class="status-badge badge-\${o.status}">\${o.status}</span>
      <div class="oc-items">\${items.map(i=>i.name+(i.customization?" — "+i.customization:"")).join("<br>")}</div>
      <div class="oc-total">$\${parseFloat(o.totalPrice).toFixed(2)}</div>
      \${o.specialInstructions?'<div class="oc-special">📝 '+o.specialInstructions+'</div>':""}
      <div class="action-btns">
        \${o.status==="Pending"?'<button class="action-btn btn-start" onclick="updateStatus(\\''+o.id+'\\',\\'Preparing\\')">🔥 Start</button>':""}
        \${o.status==="Preparing"?'<button class="action-btn btn-ready" onclick="updateStatus(\\''+o.id+'\\',\\'Ready\\')">✅ Mark Ready</button>':""}
        \${o.status==="Ready"?'<button class="action-btn btn-complete" onclick="updateStatus(\\''+o.id+'\\',\\'Completed\\')">📦 Picked Up</button>':""}
      </div>
    </div>\`;
  }).join("");
}
async function updateStatus(id,status){try{await gql(\`mutation UpdateOrder($input:UpdateOrderInput!){updateOrder(input:$input){id status}}\`,{input:{id,status}});loadOrders()}catch(e){alert("Error: "+e.message)}}
function startDashboard(){loadOrders();refreshInterval=setInterval(loadOrders,15000)}
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// POPULATE-MENU.JS
// ─────────────────────────────────────────────────────────────────────────────
function genPopulate(t) {
  return `// Populate ${t.name} menu — run: node scripts/populate-menu.js
const APPSYNC_URL="${APPSYNC_URL}";
const API_KEY="${API_KEY}";
const menuItems=${JSON.stringify(t.menu, null, 2)};
const mutation=\`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}\`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating ${t.name} menu...\\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
`;
}

// Helpers
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE ALL FILES
// ─────────────────────────────────────────────────────────────────────────────
let count = 0;
for (const t of trucks) {
  const webDir     = path.join(ROOT, t.id, 'website');
  const scriptsDir = path.join(ROOT, t.id, 'scripts');
  fs.mkdirSync(webDir, { recursive: true });
  fs.mkdirSync(scriptsDir, { recursive: true });

  fs.writeFileSync(path.join(webDir, 'index.html'),           genIndex(t));
  fs.writeFileSync(path.join(webDir, 'order.html'),           genOrder(t));
  fs.writeFileSync(path.join(webDir, 'track-order.html'),     genTrack(t));
  fs.writeFileSync(path.join(webDir, 'staff-dashboard.html'), genStaff(t));
  fs.writeFileSync(path.join(scriptsDir, 'populate-menu.js'), genPopulate(t));

  console.log(`✅ ${t.name.padEnd(30)} → ${t.id}/`);
  count++;
}
console.log(`\n🎉 Generated ${count} food truck sites (${count * 5} files total)`);
