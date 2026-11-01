"use strict";
/* SportConnect: alle code van de website.
   Onderdelen: gegevens · hulpfuncties · activiteiten · pagina's · organiseren · account · keuzehulp · knoppen · start */

const $ = (s, p = document) => p.querySelector(s), $$ = (s, p = document) => [...p.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

// ---------- Gegevens ----------
const ICONS = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1m-8 3h1"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4"/>',
  level: '<path d="M5 20v-5m7 5V9m7 11V3"/>', check: '<path d="m5 12 4 4L19 6"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  spark: '<path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8ZM20 2v4m-2-2h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  share: '<path d="M12 15V3m-4 4 4-4 4 4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
  wandelen: '<circle cx="14" cy="4" r="2"/><path d="m7 12 3-4 5 1 2 4h4M11 8l-1 7 5 2 1 5m-6-7-4 7"/>',
  voetbal: '<circle cx="12" cy="12" r="9"/><path d="m12 8 4 3-1.5 4h-5L8 11Zm0 0V3m4 8 4-2m-5.5 6 3 4M9.5 15l-3 4M8 11 4 9"/>',
  hardlopen: '<circle cx="16" cy="4" r="2"/><path d="m4 11 4-3 5 2 3 4h5m-8-4-3 5 5 3 1 4m-6-7-3 3H2"/>',
  fietsen: '<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 4-9 5 9H5m9 0 3-9h3M7 8h4m4-4h3l1 4"/>',
  yoga: '<circle cx="12" cy="4" r="2"/><path d="m6 12 4-4h4l4 4h4M6 12H2m8-4v7l-6 4 8 2 8-2-6-4V8m-6 9 4 4 4-4"/>',
  badminton: '<ellipse cx="15" cy="8" rx="5" ry="6" transform="rotate(35 15 8)"/><path d="m11 13-8 9m6-6-2-2m8-11 2 9m-5-7 7 3"/>'
};
const ic = n => `<svg class="icon" viewBox="0 0 24 24">${ICONS[n]}</svg>`;
const SPORTS = {
  wandelen: { name: "Wandelen", note: "Rustig bewegen · Tijd voor een gesprek", intensity: "rustig", goals: ["sociaal", "ontspannen"] },
  voetbal: { name: "Voetbal", note: "Samen spelen · Iedereen hoort erbij", intensity: "actief", goals: ["sociaal", "fit"] },
  hardlopen: { name: "Hardlopen", note: "Samen op pad · Op jouw tempo", intensity: "actief", goals: ["fit"] },
  fietsen: { name: "Fietsen", note: "De buurt ontdekken · Samen onderweg", intensity: "gemiddeld", goals: ["fit", "sociaal"] },
  yoga: { name: "Yoga", note: "Rust en beweging · Even tijd voor jezelf", intensity: "rustig", goals: ["ontspannen"] },
  badminton: { name: "Badminton", note: "Actief samenspelen · Wissel van partner", intensity: "gemiddeld", goals: ["fit", "sociaal"] }
};
const DISTRICTS = { centrum: "Tilburg Centrum", west: "Tilburg West", noord: "Tilburg Noord", oost: "Tilburg Oost", zuid: "Tilburg Zuid", reeshof: "Reeshof" };
const LEVELS = { beginner: "Beginners", gemiddeld: "Enige ervaring", alle: "Alle niveaus" };
const QUESTIONS = [
  { key: "goal", title: "Wat zoek je in een activiteit?", sub: "Kies wat voor jou op dit moment het belangrijkste is.", options: [
    ["sociaal", "Nieuwe mensen ontmoeten", "Samen iets doen en een gesprek beginnen."], ["fit", "Actief bewegen", "Sporten en aan mijn conditie werken."], ["ontspannen", "Ontspannen", "Rustig bewegen en even mijn hoofd leegmaken."]] },
  { key: "intensity", title: "Hoe actief wil je bewegen?", sub: "Kies het tempo waar jij je prettig bij voelt.", options: [
    ["rustig", "Rustig", "Bijvoorbeeld wandelen of yoga."], ["gemiddeld", "Gemiddeld", "Bijvoorbeeld fietsen of badminton."], ["actief", "Lekker actief", "Bijvoorbeeld hardlopen of voetbal."]] },
  { key: "level", title: "Hoeveel ervaring heb je?", sub: "Je hoeft geen ervaren sporter te zijn om mee te doen.", options: [
    ["beginner", "Ik begin net", "Ik zoek een activiteit voor beginners."], ["gemiddeld", "Ik heb al wat ervaring", "Ik sport vaker en ken de basis."], ["alle", "Dat maakt me niet uit", "Laat activiteiten van alle niveaus zien."]] },
  { key: "district", title: "Waar wil je sporten?", sub: "Kies een wijk of bekijk activiteiten in heel Tilburg.", options: [
    ["", "Heel Tilburg", "Ik sta open voor alle wijken."], ...Object.entries(DISTRICTS).map(([k, n]) => [k, n, ""])] }
];
const S = { user: null, acts: [], detail: null, editing: null, quiz: null, answers: {}, step: 0, ticket: 0, ready: false };
const dlg = $("#dlg");

// ---------- Hulpfuncties ----------
async function api(path, method = "GET", body) {
  let res;
  try { res = await fetch("/api" + path, { method, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) }); }
  catch { throw Error("Geen verbinding met de server. Controleer of het venster van SportConnect nog openstaat."); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Error(data.error || "Deze actie is niet gelukt. Probeer het opnieuw.");
  return data;
}
const err = (sel, msg = "") => { const b = $(sel); b.textContent = msg; b.hidden = !msg; };
let toastTimer;
const toast = msg => { clearTimeout(toastTimer); const t = $("#toast"); t.textContent = msg; t.hidden = false; toastTimer = setTimeout(() => t.hidden = true, 6000); };
const busy = async (btn, fn) => {
  if (btn.disabled) return;
  const html = btn.innerHTML;
  btn.disabled = true; btn.textContent = "Even wachten…";
  try { await fn(); } finally { btn.disabled = false; btn.innerHTML = html; }
};
const nowStr = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
const when = (s, short) => `${new Intl.DateTimeFormat("nl-NL", { weekday: short ? "short" : "long", day: "numeric", month: short ? "short" : "long" }).format(new Date(s))} om ${s.slice(11, 16)} uur`;
const spots = a => Math.max(0, a.capacity - a.participants);
const avail = a => `<span class="availability ${spots(a) ? "" : "full"}">${ic("people")}${spots(a) ? `${spots(a)} ${spots(a) === 1 ? "plek" : "plekken"} beschikbaar` : "Volgeboekt"}</span>`;
const art = a => a.sport === "wandelen" ? '<img src="assets/wandelen.png" alt="Samen wandelen in het park" loading="lazy">' : `<div class="sport-art sport-art-${a.sport}">${ic(a.sport)}</div>`;
const refresh = () => api("/activities").then(r => { S.acts = r.activities; }, () => {});
const modal = (html, cls = "") => {
  dlg.className = "modal " + cls;
  dlg.innerHTML = `<button class="icon-button modal-close" data-act="close" aria-label="Venster sluiten">${ic("close")}</button>` + html;
  if (!dlg.open) dlg.showModal();
};
const info = (title, html) => modal(`<h2>${title}</h2>${html}`, "info-modal");
const ask = (title, msg, fn) => {
  S.confirm = fn;
  modal(`<h2>${title}</h2><p>${msg}</p><div class="error-box" id="confirm-error" hidden></div><div class="form-actions"><button class="button" data-act="yes">Bevestigen</button><button class="text-button" data-act="close">Terug</button></div>`);
};
const copy = async (text, ok) => {
  try { await navigator.clipboard.writeText(text); toast(ok); }
  catch { info("Kopieer de link", `<p>Selecteer de link en druk op Ctrl+C om hem te kopiëren.</p><input readonly value="${esc(text)}">`); $("input", dlg).select(); }
};

// ---------- Activiteiten zoeken ----------
function score(a) { // puntentelling van de keuzehulp
  const p = S.quiz, s = SPORTS[a.sport];
  if (p.district && p.district !== a.district || p.level === "beginner" && a.level === "gemiddeld") return -1;
  return (s.goals.includes(p.goal) ? 4 : 0) + (s.intensity === p.intensity ? 4 : 0) + (a.level === p.level || a.level === "alle" || p.level === "alle" ? 2 : 0);
}
function renderList() {
  const f = Object.fromEntries(new FormData($("#filter-form"))), q = f.search.toLowerCase().trim();
  const free = $("#only-available").checked, sort = $("#sort-order").value;
  const list = S.acts.filter(a => (!f.sport || a.sport === f.sport) && (!f.district || a.district === f.district)
    && (!f.level || a.level === f.level || a.level === "alle")
    && (!q || `${a.title} ${a.description} ${a.meeting_point} ${DISTRICTS[a.district]} ${SPORTS[a.sport].name}`.toLowerCase().includes(q))
    && (!free || spots(a)) && (!S.quiz || score(a) >= 4 && spots(a)))
    .sort((a, b) => (S.quiz && score(b) - score(a)) || (sort === "spots" && spots(b) - spots(a)) || a.starts_at.localeCompare(b.starts_at));
  $("#results-count").textContent = list.length;
  $("#results-status").textContent = `${list.length} ${list.length === 1 ? "activiteit gevonden" : "activiteiten gevonden"}`;
  $("#empty-results").hidden = list.length > 0;
  $("#recommendation-banner").hidden = !S.quiz;
  $("#activity-list").innerHTML = list.map(a => `
    <article class="activity-card">
      <a class="card-image" href="#/activiteit/${a.id}">${art(a)}${a.is_example ? '<span class="example-badge">Voorbeeld</span>' : ""}</a>
      <div class="card-copy">
        <div class="card-topline"><span class="tag">${SPORTS[a.sport].name}</span>${S.quiz ? '<span class="match-tag">Past bij je keuzes</span>' : ""}</div>
        <h3><a href="#/activiteit/${a.id}">${esc(a.title)}</a></h3>
        <p class="card-subtitle">${SPORTS[a.sport].note}</p>
        <div class="card-meta"><span>${ic("pin")}${DISTRICTS[a.district]}</span><span>${ic("calendar")}${when(a.starts_at, true)}</span><span>${ic("level")}${LEVELS[a.level]}</span></div>
      </div>
      <div class="card-actions">${avail(a)}<a class="button" href="#/activiteit/${a.id}">Bekijk activiteit ${ic("arrow")}</a></div>
    </article>`).join("");
}
function resetFilters() {
  $("#filter-form").reset(); $("#only-available").checked = false; $("#sort-order").value = "date";
  S.quiz = null; renderList();
}

// ---------- Pagina's (de adresbalk bepaalt welke pagina je ziet) ----------
function show(view) {
  $$("[data-view]").forEach(v => v.hidden = v.dataset.view !== view);
  $$("[data-nav]").forEach(l => l.classList.toggle("active", l.dataset.nav === view || view === "detail" && l.dataset.nav === "activities"));
  $("#main-nav").classList.remove("open"); $("#account-menu").open = false; scrollTo(0, 0);
}
async function route() {
  if (!S.ready) return;
  const t = ++S.ticket, [page, id, token] = location.hash.replace(/^#\/?/, "").split("/");
  try {
    if (page === "activiteit") {
      show("detail"); $("#detail-content").innerHTML = '<div class="loading-state">Activiteit laden…</div>';
      const a = (await api("/activities/" + encodeURIComponent(id))).activity;
      if (t !== S.ticket) return;
      S.detail = a; renderDetail(a); document.title = `${a.title} | SportConnect`;
    } else if (page === "organiseren" || page === "bewerken") {
      show("organize"); const f = $("#organize-form"); f.reset(); S.editing = null; err("#organize-error");
      let a = null;
      if (page === "bewerken") {
        a = (await api("/activities/" + encodeURIComponent(id))).activity;
        if (t !== S.ticket) return;
        if (!S.user || a.organizer_id !== S.user.id) throw Error("Log in met het account waarmee je deze activiteit hebt gemaakt.");
        S.editing = a.id;
        for (const k of ["title", "sport", "district", "level", "meeting_point", "capacity", "description"]) f.elements[k].value = a[k];
        f.elements.date.value = a.starts_at.slice(0, 10); f.elements.time.value = a.starts_at.slice(11, 16);
      }
      $("#organize-title").textContent = a ? "Bewerk je activiteit" : "Organiseer een activiteit";
      $("#publish-button").innerHTML = a ? `Wijzigingen opslaan ${ic("check")}` : `Activiteit publiceren ${ic("arrow")}`;
      preview(); document.title = `${a ? "Activiteit bewerken" : "Organiseren"} | SportConnect`;
    } else if (page === "mijn-activiteiten") {
      show("account"); await renderAccount(); document.title = "Mijn activiteiten | SportConnect";
    } else if (page === "afmelden") {
      show("cancel"); err("#cancel-error"); S.cancel = { id, token };
      $("#cancel-description").textContent = "Kun je toch niet? Meld je hieronder af. Je plek komt dan vrij voor iemand anders.";
      $("#cancel-button").hidden = false; document.title = "Afmelden | SportConnect";
    } else {
      show("activities"); renderList(); document.title = "SportConnect | Samen sporten in Tilburg";
    }
  } catch (x) {
    if (t !== S.ticket) return;
    if (page === "activiteit") $("#detail-content").innerHTML = `<div class="empty-state"><h1>Activiteit niet beschikbaar</h1><p>${esc(x.message)}</p><a class="button" href="#/activiteiten">Bekijk andere activiteiten</a></div>`;
    else { toast(x.message); if (page === "bewerken") location.hash = "/mijn-activiteiten"; }
  }
}
function renderDetail(a, done) {
  const past = a.starts_at <= nowStr(), open = a.status === "active" && !past && a.participants < a.capacity;
  const join = done
    ? `<div class="success-card"><span class="success-mark">${ic("check")}</span><h2>Je staat op de lijst!</h2><p>Je deelname aan ${esc(a.title)} is opgeslagen.</p><p>Bewaar hieronder je persoonlijke afmeldlink. Daarmee kun je je later afmelden.</p><label>Jouw afmeldlink<input class="cancel-link-input" id="cancel-link" readonly value="${esc(done.cancel_url)}"></label><button class="button button-outline" data-act="copy">Kopieer afmeldlink ${ic("share")}</button>${a.is_example ? '<p class="field-hint">Dit is een voorbeeldactiviteit. Er vindt geen echte bijeenkomst plaats.</p>' : ""}</div>`
    : !open
    ? `<div class="join-card"><h2>${a.status === "cancelled" ? "Deze activiteit is geannuleerd" : past ? "Deze activiteit is afgelopen" : "Deze activiteit zit vol"}</h2><p>Bekijk het overzicht voor een andere activiteit die bij je past.</p><a class="button button-full" href="#/activiteiten">Bekijk activiteiten ${ic("arrow")}</a></div>`
    : `<form id="join-form" class="join-card" data-id="${a.id}"><h2>Doe je mee?</h2><p>Vul je gegevens in en reserveer jouw plek.</p>
        <label>Naam<input name="name" autocomplete="name" minlength="2" maxlength="80" value="${esc(S.user?.name)}" required></label>
        <label>E-mailadres<input name="email" type="email" autocomplete="email" maxlength="254" value="${esc(S.user?.email)}" required></label>
        <label class="checkbox-label"><input name="consent" type="checkbox" required><span>Mijn naam en e-mailadres mogen worden opgeslagen en met de organisator worden gedeeld voor deze activiteit.</span></label>
        <div class="error-box" id="join-error" hidden></div>
        <button class="button button-full">Bevestig deelname ${ic("arrow")}</button><p class="quiet-note">${ic("check")} Ook welkom zonder account</p></form>`;
  $("#detail-content").innerHTML = `
    <div class="detail-grid">
      <div class="detail-image">${art(a)}${a.is_example ? '<span class="example-badge">Voorbeeldactiviteit</span>' : ""}</div>
      <div class="detail-about"><h2>Wat gaan we doen?</h2><p class="detail-description">${esc(a.description)}</p>
        <div class="host-card"><span class="avatar">${esc(a.organizer_name[0].toUpperCase())}</span><div><strong>${esc(a.organizer_name)}</strong><p>Organisator van deze activiteit</p></div></div></div>
      <div class="detail-sidebar"><span class="tag">${SPORTS[a.sport].name}</span><h1>${esc(a.title)}</h1>
        <div class="detail-meta">
          <p>${ic("pin")}<span>${DISTRICTS[a.district]}<small>${esc(a.meeting_point)}</small></span></p>
          <p>${ic("calendar")}<span>${when(a.starts_at)}<small>Alle tijden zijn Nederlandse tijd.</small></span></p>
          <p>${ic("level")}<span>Niveau: ${LEVELS[a.level].toLowerCase()}</span></p>${avail(a)}</div>
        ${a.is_example ? `<div class="example-note">${ic("info")}<span>Voorbeeldactiviteit voor het project. Er is geen echte bijeenkomst gepland.</span></div>` : ""}
        <div id="join-area">${join}</div>
        <div class="detail-share"><button class="text-button" data-act="share" data-id="${a.id}">${ic("share")} Activiteit delen</button></div>
        ${S.user && a.organizer_id === S.user.id && a.status === "active" ? `<a class="button button-outline button-full" href="#/bewerken/${a.id}">Mijn activiteit bewerken</a>` : ""}
      </div></div>`;
}
const join = e => {
  const f = e.target;
  return busy($("button", f), async () => {
    err("#join-error");
    try {
      const r = await api(`/activities/${f.dataset.id}/join`, "POST", { ...Object.fromEntries(new FormData(f)), consent: f.elements.consent.checked });
      S.detail = r.activity; renderDetail(r.activity, r);
      $("#join-area").scrollIntoView({ block: "nearest", behavior: "smooth" });
      await refresh();
    } catch (x) { err("#join-error", x.message); }
  });
};

// ---------- Organiseren (het voorbeeldkaartje verandert mee) ----------
function preview() {
  const f = $("#organize-form").elements, sp = f.sport.value || "wandelen";
  $("#preview-art").className = `sport-art sport-art-${sp}`; $("#preview-art").innerHTML = ic(sp);
  $("#preview-sport").textContent = f.sport.value ? SPORTS[sp].name : "Jouw sport";
  $("#preview-title").textContent = f.title.value || "De naam van je activiteit";
  $("#preview-location").innerHTML = ic("pin") + (DISTRICTS[f.district.value] || "Jouw wijk in Tilburg");
  $("#preview-date").innerHTML = ic("calendar") + (f.date.value ? when(`${f.date.value}T${f.time.value || "12:00"}`, true) : "Datum en tijd");
}
async function organize(e) {
  const f = e.target;
  if (!S.user) return authDialog("login", () => f.requestSubmit());
  const editing = S.editing;
  await busy($("#publish-button"), async () => {
    err("#organize-error");
    try {
      const v = Object.fromEntries(new FormData(f));
      v.capacity = Number(v.capacity); v.starts_at = `${v.date}T${v.time}`;
      const r = await api(editing ? "/activities/" + editing : "/activities", editing ? "PUT" : "POST", v);
      await refresh(); location.hash = "/activiteit/" + r.activity.id;
      toast(editing ? "Je wijzigingen zijn opgeslagen." : "Je activiteit staat in het overzicht!");
    } catch (x) { err("#organize-error", x.message); }
  });
}

// ---------- Account ----------
function updateAuth() {
  $("#login-button").hidden = !!S.user; $("#account-menu").hidden = !S.user; $("#organize-login-hint").hidden = !!S.user;
  if (S.user) { $("#account-name").textContent = S.user.name.split(" ")[0]; $("#account-initial").textContent = S.user.name[0].toUpperCase(); }
}
function authDialog(mode = "login", then) {
  S.then = then; const reg = mode === "register";
  modal(`<span class="modal-symbol">${ic("user")}</span><h2>${reg ? "Doe mee met je buurt" : "Welkom terug"}</h2>
    <p class="modal-subtitle">${reg ? "Maak een account en organiseer je eigen activiteiten." : "Log in en organiseer iets voor jouw buurt."}</p>
    <div class="segmented-control"><button type="button" data-act="tab" data-mode="login" aria-pressed="${!reg}">Inloggen</button><button type="button" data-act="tab" data-mode="register" aria-pressed="${reg}">Account maken</button></div>
    <form id="auth-form" data-mode="${mode}">
      ${reg ? '<label style="margin-bottom:17px">Je naam<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>' : ""}
      <label style="margin-bottom:17px">E-mailadres<input name="email" type="email" autocomplete="username" required maxlength="254"></label>
      <label>Wachtwoord<span class="password-field"><input name="password" type="password" autocomplete="${reg ? "new" : "current"}-password" required minlength="${reg ? 10 : 1}" maxlength="128"><button type="button" data-act="pw">Toon</button></span></label>
      ${reg ? '<p class="field-hint" style="margin-top:7px">Gebruik minimaal 10 tekens.</p>' : ""}
      <div class="error-box" id="auth-error" hidden></div>
      <button class="button button-full" id="auth-submit">${reg ? "Account maken" : "Inloggen"} ${ic("arrow")}</button>
      <p class="auth-footer">Je kunt ook zonder account deelnemen aan een activiteit.</p></form>`);
}
async function auth(e) {
  const f = e.target;
  await busy($("#auth-submit"), async () => {
    err("#auth-error");
    try {
      S.user = (await api("/" + f.dataset.mode, "POST", Object.fromEntries(new FormData(f)))).user;
      updateAuth(); dlg.close(); toast(`Welkom, ${S.user.name.split(" ")[0]}!`);
      const then = S.then; S.then = null;
      if (then) then(); else if (/^#\/(mijn|activiteit\/)/.test(location.hash)) route();
    } catch (x) { err("#auth-error", x.message); }
  });
}
async function renderAccount() {
  const box = $("#account-content");
  if (!S.user) { box.innerHTML = `<div class="empty-state"><span class="empty-icon">${ic("user")}</span><h2>Jouw activiteiten op één plek</h2><p>Log in om je activiteiten en aanmeldingen te bekijken.</p><button class="button" data-act="login">Inloggen ${ic("arrow")}</button></div>`; return; }
  box.innerHTML = '<div class="loading-state">Je activiteiten laden…</div>';
  try {
    const r = await api("/my-activities"), off = a => a.status === "cancelled" ? ' · <span class="danger-text">Geannuleerd</span>' : "";
    const hosted = r.hosted.map(a => `<article class="management-card"><div><h3><a href="#/activiteit/${a.id}">${esc(a.title)}</a></h3><p>${when(a.starts_at, true)} · ${a.participants} aanmeldingen${off(a)}</p></div><div class="management-actions"><button class="text-button" data-act="participants" data-id="${a.id}">Deelnemers</button>${a.status === "active" ? `<a class="text-button" href="#/bewerken/${a.id}">Bewerken</a><button class="text-button danger-text" data-act="cancel-activity" data-id="${a.id}">Annuleren</button>` : ""}</div></article>`).join("");
    const joined = r.joined.map(a => `<article class="management-card"><div><h3><a href="#/activiteit/${a.id}">${esc(a.title)}</a></h3><p>${DISTRICTS[a.district]} · ${when(a.starts_at, true)}${off(a)}</p></div><button class="text-button danger-text" data-act="cancel-registration" data-id="${a.registration_id}">Afmelden</button></article>`).join("");
    box.innerHTML = `<section class="account-section"><div class="section-heading"><h2>Door jou georganiseerd</h2><a class="text-button" href="#/organiseren">${ic("plus")} Nieuwe activiteit</a></div>${hosted || '<div class="empty-state"><h3>Jouw eerste activiteit begint hier</h3><p>Organiseer bijvoorbeeld een wandeling of een potje voetbal.</p><a class="button" href="#/organiseren">Activiteit organiseren</a></div>'}</section>
      <section class="account-section"><h2>Mijn aanmeldingen</h2>${joined || '<div class="empty-state"><h3>Waar sluit jij aan?</h3><p>Hier verschijnen aanmeldingen die je doet terwijl je bent ingelogd.</p><a class="button button-outline" href="#/activiteiten">Activiteiten ontdekken</a></div>'}</section>`;
  } catch (x) { box.innerHTML = `<div class="error-box">${esc(x.message)}</div>`; }
}

// ---------- Keuzehulp ----------
function quiz() {
  const q = QUESTIONS[S.step];
  modal(`<p class="eyebrow">JOUW KEUZEHULP</p><div class="quiz-progress-label"><span>Vraag ${S.step + 1} van 4</span><span>Ongeveer 1 minuut</span></div><progress max="4" value="${S.step + 1}"></progress>
    <form id="quiz-form"><h2>${q.title}</h2><p class="quiz-question-text">${q.sub}</p>
      <fieldset class="quiz-options">${q.options.map(([v, l, x]) => `<label class="quiz-option"><input type="radio" name="answer" value="${v}" ${S.answers[q.key] === v ? "checked" : ""}><span>${l}${x ? `<small>${x}</small>` : ""}</span></label>`).join("")}</fieldset>
      <div class="error-box" id="quiz-error" hidden></div>
      <div class="quiz-actions">${S.step ? '<button class="text-button" type="button" data-act="quiz-back">Vorige</button>' : ""}<button class="button">${S.step === 3 ? "Bekijk mijn activiteiten" : "Volgende"} ${ic("arrow")}</button></div></form>`, "quiz-modal");
}
function quizNext() {
  const pick = $("input:checked", dlg);
  if (!pick) return err("#quiz-error", "Kies eerst een antwoord om verder te gaan.");
  S.answers[QUESTIONS[S.step].key] = pick.value;
  if (S.step < 3) { S.step++; return quiz(); }
  S.quiz = { ...S.answers };
  $("#filter-form").reset(); $("#only-available").checked = false; $("#sort-order").value = "date";
  $("#recommendation-summary").textContent = QUESTIONS.map(q => q.options.find(o => o[0] === S.answers[q.key])[1]).join(" · ");
  dlg.close(); location.hash = "/activiteiten"; renderList();
  requestAnimationFrame(() => $("#recommendation-banner").scrollIntoView({ block: "start", behavior: "smooth" }));
}

// ---------- Knoppen: elke knop met data-act komt hier terecht ----------
const ACT = {
  close: () => dlg.close(),
  login: () => authDialog(),
  tab: t => authDialog(t.dataset.mode, S.then),
  pw: t => { const i = $("[name=password]", dlg); i.type = i.type === "password" ? "text" : "password"; t.textContent = i.type === "password" ? "Toon" : "Verberg"; },
  logout: async () => {
    try {
      await api("/logout", "POST"); S.user = null; updateAuth();
      if (/^#\/(mijn|bewerken)/.test(location.hash)) location.hash = "/activiteiten"; else if (location.hash.startsWith("#/activiteit/")) route();
      toast("Je bent uitgelogd.");
    } catch (x) { toast(x.message); }
  },
  quiz: () => { S.step = 0; quiz(); },
  "quiz-back": () => { const p = $("input:checked", dlg); if (p) S.answers[QUESTIONS[S.step].key] = p.value; S.step--; quiz(); },
  reset: resetFilters,
  "clear-quiz": () => { S.quiz = null; renderList(); },
  copy: () => copy($("#cancel-link").value, "Je afmeldlink is gekopieerd."),
  share: t => copy(`${location.origin}${location.pathname}#/activiteit/${t.dataset.id}`, "De link naar deze activiteit is gekopieerd."),
  yes: t => busy(t, async () => { try { await S.confirm(); dlg.close(); } catch (x) { err("#confirm-error", x.message); } }),
  "cancel-activity": t => ask("Activiteit annuleren?", "De activiteit is daarna niet meer boekbaar. Informeer je deelnemers zelf over de annulering via de deelnemerslijst.", async () => {
    await api(`/activities/${t.dataset.id}/cancel`, "POST"); await refresh(); await renderAccount(); toast("Je activiteit is geannuleerd.");
  }),
  "cancel-registration": t => ask("Wil je je afmelden?", "Je aanmelding wordt verwijderd en je plek komt vrij voor iemand anders.", async () => {
    await api(`/registrations/${t.dataset.id}/cancel`, "POST"); await refresh(); await renderAccount(); toast("Je bent afgemeld.");
  }),
  participants: async t => {
    try {
      const r = await api(`/activities/${t.dataset.id}/participants`);
      info("Deelnemers", `<p>${esc(r.title)}</p>` + (r.participants.map(p => `<div class="participant-row"><strong>${esc(p.name)}</strong><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div>`).join("") || "<p>Er zijn nog geen aanmeldingen voor deze activiteit.</p>"));
    } catch (x) { toast(x.message); }
  },
  about: () => info("Samen sporten in Tilburg", `<p>SportConnect brengt mensen uit dezelfde omgeving bij elkaar via sport en beweging. Je vindt hier activiteiten om aan deel te nemen en kunt zelf iets organiseren.</p><h3>Je kunt alleen komen</h3><p>Een wandeling, een potje voetbal of samen fietsen. Kies een activiteit die bij jouw interesse en niveau past. In de beschrijving lees je wat je kunt verwachten.</p><h3>Zelf iets organiseren</h3><p>Met een account zet je een activiteit in het overzicht. Je kiest de datum, het verzamelpunt en het aantal deelnemers. Via Mijn activiteiten beheer je de aanmeldingen.</p><h3>Over dit project</h3><p>SportConnect is een HBO-ICT-project rond samen sporten en sociaal contact. Activiteiten met het label Voorbeeld zijn voorbeeldgegevens. Daarvoor is geen echte bijeenkomst gepland.</p>`),
  privacy: () => info("Hoe we je gegevens gebruiken", `<p>SportConnect is een schoolprototype. Gebruik voor deze demonstratie alleen testgegevens. Vul geen gevoelige of vertrouwelijke informatie in.</p><p>Bij een aanmelding bewaren we je naam, e-mailadres en gekozen activiteit. De organisator kan de deelnemerslijst van de eigen activiteit bekijken.</p><h3>Je account</h3><p>Een account bewaart je naam, e-mailadres en een beveiligde afgeleide van je wachtwoord. Je browser gebruikt een noodzakelijke sessiecookie om je ingelogd te houden. We gebruiken geen advertentietrackers.</p><h3>Afmelden</h3><p>Gebruik je persoonlijke afmeldlink of Mijn activiteiten. Je aanmelding met naam en e-mailadres wordt dan uit de deelnemerslijst en database verwijderd.</p><h3>Je voorkeuren</h3><p>Antwoorden in de keuzehulp blijven alleen in deze geopende pagina. Ze worden niet naar de server verstuurd.</p>`)
};
document.addEventListener("click", e => { const t = e.target.closest("[data-act]"); if (t) ACT[t.dataset.act]?.(t); });
document.addEventListener("submit", e => { e.preventDefault(); ({ "join-form": join, "organize-form": organize, "auth-form": auth, "quiz-form": quizNext })[e.target.id]?.(e); });
$("[data-view=activities]").oninput = renderList;
$("#organize-form").oninput = preview;
$("#menu-toggle").onclick = () => $("#main-nav").classList.toggle("open");
$("#cancel-button").onclick = () => busy($("#cancel-button"), async () => {
  err("#cancel-error");
  try {
    await api(`/registrations/${S.cancel.id}/cancel`, "POST", { token: S.cancel.token });
    $("#cancel-description").textContent = "Je bent afgemeld. Je aanmelding is verwijderd en de plek is weer beschikbaar.";
    $("#cancel-button").hidden = true; await refresh();
  } catch (x) { err("#cancel-error", x.message); }
});
addEventListener("hashchange", route);

// ---------- Start ----------
(async function init() {
  $$("svg[data-i]").forEach(s => { s.setAttribute("viewBox", "0 0 24 24"); s.innerHTML = ICONS[s.dataset.i]; });
  for (const p of ["filter", "organize"]) for (const [k, list] of [["sport", SPORTS], ["district", DISTRICTS], ["level", LEVELS]])
    for (const [key, v] of Object.entries(list)) $(`#${p}-${k}`).add(new Option(v.name || v, key));
  $("#organize-date").min = nowStr().slice(0, 10);
  preview();
  try {
    if (location.protocol === "file:") throw Error("Start SportConnect via de startinstructies. De server is nodig om activiteiten en aanmeldingen op te slaan.");
    S.user = (await api("/session")).user; updateAuth();
    S.acts = (await api("/activities")).activities; S.ready = true;
    await route();
  } catch (x) { err("#connection-error", x.message); $("#results-status").textContent = "Geen verbinding met de server"; }
})();
