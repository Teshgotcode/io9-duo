/* =====================================================================
   PRICES: the only place prices and dates live. Everything on the page
   and everything the chat bot knows is rendered from this object.
   checked  = date the number was last seen in the shop (YYYY-MM-DD)
   verified = true when checked on the shop's own page on that date.
   Unverified numbers are marked "sjekk i butikk" on the page.
   ===================================================================== */
const PRICES = {
  checked: "2026-11-17",                 // shown as "Priser sjekket ..."
  campaign: {                            // Power Black Weeks
    name: "Black Weeks hos Power",
    start: "2026-11-09",
    end: "2026-11-30",
  },
  io9Duo: {                              // Black Onyx + Rose Quartz, Power.no
    name: "iO9 Duo",
    price: 2999,
    before: 5399,                        // Power's "før"-pris
    store: "Power",
    headsIncluded: 3,
    checked: "2026-11-17",
    verified: true,
  },
  io9Single: {                           // Black Onyx, Power.no
    name: "iO9 enkel",
    price: 1999,
    before: 3199,
    store: "Power",
    headsIncluded: 2,
    checked: "2026-11-17",
    verified: true,
  },
  extraCharger: {                        // SiGN uoriginal magnetlader, 2-pin
    price: 179,
    store: "SiGN",
    checked: "2026-11-09",
    verified: false,
  },
  chargerOriginal: { price: 399, checked: "2026-11-09", verified: false },
  headsGentle8: {                        // iO Gentle Care 8-pk, laveste på Prisjakt
    price: 449,
    count: 8,
    store: "Prisjakt",
    checked: "2026-11-09",
    verified: false,
  },
  headsGentle8Elkjop: { price: 559, checked: "2026-11-09", verified: false },
  headsGentle8Full:   { price: 699, checked: "2026-11-09", verified: false },
  headsGentle6Clas:   { price: 299, count: 6, checked: "2026-11-09", verified: false },
  headsUltimate8: {                      // iO Ultimate Clean 8-pk, Power
    price: 399,
    count: 8,
    store: "Power",
    until: "2027-01-10",                 // kampanjen varer til
    checked: "2026-11-17",
    verified: true,
  },
  io5Duo: {                              // chatten sa både 1 399 og 1 499
    name: "iO5 Duo",
    price: 1499,
    store: "butikk ikke notert",
    headsIncluded: 2,                    // antatt, esken er ikke sjekket
    checked: "2026-11-11",
    verified: false,
  },
  io3Duo:      { price: 999,  checked: "2026-11-09", verified: false },
  io3Single:   { price: 700,  checked: "2026-11-09", verified: false },
  io10Single:  { price: 2399, checked: "2026-11-09", verified: false },
  io6Single:   { price: 1399, checked: "2026-11-09", verified: false },
  elkjopDuo:   { price: 4319, checked: "2026-11-09", verified: false },
  komplettDuo: { price: 2990, checked: "2026-11-09", verified: false },
  philips9900:     { price: 2799, checked: "2026-11-09", verified: false },
  philipsDC9000:   { price: 1999, checked: "2026-11-09", verified: false },
  philipsDC9000Duo:{ price: 2299, checked: "2026-11-09", verified: false },
  philips4100:     { price: 499,  checked: "2026-11-09", verified: false },
  parts: {                               // løse deler, for "hva får man ekstra"
    holder: 103,
    caseNoChargeMin: 89,
    caseNoChargeMax: 193,
    checked: "2026-11-09",
  },
  manualPerPersonYear: { min: 120, max: 200 },
  cashback: {                            // ingen aktiv norsk kampanje funnet
    active: false,
    checked: "2026-11-17",
  },
};

/* ---------- helpers ---------- */
const P = PRICES;
const kr = n => Math.round(n).toLocaleString("nb-NO") + " kr";
const num = n => Math.round(n).toLocaleString("nb-NO");
const asDate = iso => new Date(iso + "T12:00:00");
const dLong = iso => asDate(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
const dShort = iso => asDate(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long" });
const flag = item => item.verified ? "" : ` <span class="src">(pris fra ${dShort(item.checked)}, sjekk i butikk)</span>`;
const headPrice = key => key === "ultimate" ? P.headsUltimate8.price / P.headsUltimate8.count : P.headsGentle8.price / P.headsGentle8.count;
const campaignOn = () => new Date() <= asDate(P.campaign.end);
const twoSingles = () => 2 * P.io9Single.price;
const duoPlus = () => P.io9Duo.price + P.extraCharger.price;

/* ---------- reviews (scores, not prices) ---------- */
const REVIEWS = [
  { name: "Oral-B iO9 Duo", score: "4,5 / 5", count: "669 vurderinger hos Power, 290 hos Elkjøp", price: () => P.io9Duo },
  { name: "Oral-B iO9 enkel", score: "4,8 / 5", count: "190 vurderinger hos Elkjøp", price: () => P.io9Single },
  { name: "Oral-B iO10", score: "4,7 / 5", count: "34 vurderinger hos Elkjøp", price: () => P.io10Single },
  { name: "Philips Sonicare 9900 Prestige", score: "4,7 / 5", count: "104 hos Elkjøp. 4,2 av 999 hos Philips.no, 81 % anbefaler", price: () => P.philips9900 },
  { name: "Philips DiamondClean 9000", score: "4,7 / 5", count: "302 vurderinger hos Elkjøp", price: () => P.philipsDC9000 },
];
const EXPERT = "test.no samler 155 fagtester. Samlet score: iO10 86, Philips 9400 86, iO9 85, iO6 83, Philips 9900 82. Forskjellene er små.";

/* ---------- FAQ: one source for the page and the bot ---------- */
const FAQ = [
  { group: "Pris og pakke", id: "deal",
    q: () => `Er ${kr(P.io9Duo.price)} en god pris?`,
    k: ["pris", "god", "deal", "billig", "tilbud", "kampanje", "black", "power", "elkjøp", "komplett", "rabatt", "verdt", "kjøpe", "før"],
    a: () => `<p>Ja. Power selger iO9 Duo for ${kr(P.io9Duo.price)} i ${P.campaign.name}, fra ${dShort(P.campaign.start)} til ${dShort(P.campaign.end)}. Før-prisen er ${kr(P.io9Duo.before)}.</p>
<p>Andre butikker: Komplett ${kr(P.komplettDuo.price)}${flag(P.komplettDuo)}, Elkjøp ${kr(P.elkjopDuo.price)}${flag(P.elkjopDuo)}. Den fantes ikke billigere andre steder da prisene ble sjekket.</p>
<p>Delt på to blir det ${kr(P.io9Duo.price / 2)} per person.</p>` },

  { group: "Pris og pakke", id: "separate",
    q: "Vi bor hver for oss. Må vi kjøpe en lader eller et etui i tillegg til Duo?",
    k: ["hver", "bor", "sammen", "separat", "hjemme", "duo", "trenger", "egen", "ekstra", "lader", "etui", "tillegg", "kjøpe", "hus", "leilighet"],
    a: () => `<p>Nei, ikke nødvendigvis. Duo-esken har én magnetlader og ett ladeetui. Du tar magnetladeren, han tar ladeetuiet. Du bor hjemme og har et bad bare familien bruker, så standen kan stå fast der. Han reiser mye og deler bad, så etuiet passer ham best. Det plugges i stikkontakten og lader børsten mens den ligger inni, og børsten ligger trygt når den ikke er i bruk. Når han reiser, tar han bare etuiet med.</p>
<p>Ulempen: den med etuiet har ingen stående lader ved vasken, og ikke noe eget etui å reise med. Vil du ha det, koster en ekstra lader rundt ${kr(P.extraCharger.price)}${flag(P.extraCharger)}.</p>
<ul><li>Duo: ${kr(P.io9Duo.price)}</li><li>Duo + ekstra lader: ${kr(duoPlus())}</li><li>To enkle: ${kr(twoSingles())}</li></ul>
<p>Selv med ekstra lader sparer dere ${kr(twoSingles() - duoPlus())} på Duo.</p>` },

  { group: "Pris og pakke", id: "contents",
    q: "Hva følger med i esken?",
    k: ["følger", "eske", "esken", "innhold", "lader", "etui", "holder", "pakke", "inkluder", "hoder", "med"],
    a: () => `<p><strong>Duo:</strong> 2 håndtak (Black Onyx og Rose Quartz), 3 børstehoder, 1 magnetisk lader, 1 ladeetui til reise, 1 holder til børstehoder.</p>
<p><strong>Enkel:</strong> 1 håndtak, 2 børstehoder, 1 magnetisk lader, 1 ladeetui, 1 holder.</p>
<p>To enkle gir altså én lader, ett etui, ett hode og én holder mer enn Duo. Kjøpt løst koster de: lader ${kr(P.chargerOriginal.price)} original eller ${kr(P.extraCharger.price)} uoriginal, etui uten lading ${num(P.parts.caseNoChargeMin)}-${kr(P.parts.caseNoChargeMax)}, holder ${kr(P.parts.holder)}, hode ca. ${kr(headPrice("gentle"))}. Til sammen er det mindre enn de ${kr(twoSingles() - P.io9Duo.price)} ekstra som to enkle koster. <span class="src">(delepriser fra ${dShort(P.parts.checked)})</span></p>
<p>Laderen bruker rundt tre timer på full lading.</p>` },

  { group: "Pris og pakke", id: "cashback",
    q: "Får vi cashback?",
    k: ["cashback", "penger", "tilbake", "refusjon", "registrer", "strekkode", "bonus"],
    a: () => `<p>Nei. Det fantes ingen aktiv norsk cashback-kampanje fra Oral-B da prisene ble sjekket ${dShort(P.cashback.checked)}. Ikke regn med noe tilbake. Prisene på siden er uten cashback.</p>` },

  { group: "Pris og pakke", id: "color",
    q: "Kan begge få svart børste?",
    k: ["farge", "svart", "sort", "rosa", "rose", "quartz", "onyx", "hvit"],
    a: () => `<p>Ikke med Duo. Den har én Black Onyx og én Rose Quartz. Vil begge ha svart, må dere kjøpe to enkle, og det koster ${kr(twoSingles() - P.io9Duo.price)} mer.</p>` },

  { group: "Er den bra?", id: "reviews",
    q: "Hva sier anmeldelsene?",
    k: ["anmeld", "anmeldelse", "review", "karakter", "test", "score", "klage", "stjerner", "rating", "kunder", "erfaring", "bra"],
    a: () => `<p>Kundene gir iO9 høye karakterer:</p>
<ul class="rv">${REVIEWS.map(r => `<li><span class="n">${r.name}</span><span class="s">${r.score}</span><span class="c">${r.count}. ${kr(r.price().price)}${r.price().verified ? "" : " (pris fra " + dShort(r.price().checked) + ")"}</span></li>`).join("")}</ul>
<p>${EXPERT}</p>
<p>Den vanligste klagen på iO9 er batteriet. Flere skriver at børsten dør etter 12-18 måneder. Oral-B oppgir 12-14 dagers batteritid, mens tester har målt 5-10 dager. iO-hodene koster også omtrent dobbelt så mye som vanlige Oral-B-hoder. Begge de store merkene har klager på børster som dør etter rundt to år.</p>` },

  { group: "Er den bra?", id: "philips",
    q: "Hva med Philips Sonicare?",
    k: ["philips", "sonicare", "sonisk", "konkurrent", "diamondclean", "annen", "merke", "alternativ"],
    a: () => `<p>Philips sin toppmodell 9900 Prestige koster ${kr(P.philips9900.price)}${flag(P.philips9900)} og får 4,7 hos Elkjøp, men 4,2 hos Philips.no. Klagene handler om glasskoppen den lades i, egen kabel, bare ett hode i esken, og feil på knapp og håndtak etter 1,5-2 år.</p>
<p>I Testfakta sin måling fjernet iO10 61 % av plakket, Philips-børstene 44-48 %.</p>
<p>I Cochrane-gjennomgangen ga roterende børster som Oral-B klarest gevinst mot manuell børste. Soniske børster som Philips hadde ikke like tydelige resultater.</p>` },

  { group: "Er den bra?", id: "manual",
    q: "Er elektrisk egentlig bedre enn manuell?",
    k: ["manuell", "vanlig", "elektrisk", "cochrane", "studie", "forskning", "plakk", "bedre", "hjelper"],
    a: () => `<p>Ja, litt. Cochrane gikk gjennom over 40 studier. Elektrisk børste fjernet 11 % mer plakk etter 1-3 måneder og 21 % mer etter over 3 måneder. Tannkjøttbetennelsen gikk ned 6-11 %.</p>
<p>Mye av gevinsten kommer fra totminutters-timeren og trykksensoren. Begge finnes også på de billigere iO-modellene.</p>
<p>Driften koster mer: manuelle børster koster ${num(P.manualPerPersonYear.min)}-${kr(P.manualPerPersonYear.max)} per person i året.</p>` },

  { group: "Er den bra?", id: "models",
    q: "Holder det med iO5 eller iO3?",
    k: ["io5", "io3", "io10", "io6", "billigere", "alternativ", "modell", "forskjell", "spare", "billigst", "rimelig"],
    a: () => `<p>Alle iO-børstene har samme type magnetmotor og trykksensor, og bruker de samme hodene. Rengjøringen blir omtrent den samme, og hodene koster det samme.</p>
<p>iO9 har i tillegg fargeskjerm, sju moduser, sporing av 16 soner i appen (de billigere har 6) og ladeetui.</p>
<ul><li>iO5 Duo: ${kr(P.io5Duo.price)}${flag(P.io5Duo)}</li><li>iO3 Duo: ca. ${kr(P.io3Duo.price)}${flag(P.io3Duo)}</li><li>iO10 enkel: ${kr(P.io10Single.price)}${flag(P.io10Single)}, scorer ett poeng over iO9 hos test.no</li></ul>
<p>Vil dere ha skjermen og full sporing i appen, er iO9 riktig. Holder det med rene tenner og trykksensor, sparer iO5 Duo dere rundt ${kr(Math.round((P.io9Duo.price - P.io5Duo.price) / 100) * 100)}.</p>` },

  { group: "Daglig bruk", id: "sensitive",
    q: "Jeg har sensitivt tannkjøtt. Passer den?",
    k: ["sensitiv", "sensitivt", "ømt", "øm", "tannkjøtt", "blør", "blødning", "myk", "myke", "gentle", "hard", "trykk", "vondt", "smerte", "skånsom"],
    a: () => `<p>Den kan passe godt. Det viktigste er å ikke presse for hardt. Trykksensoren lyser rødt og senker farten når du presser for mye.</p>
<ul><li>Bruk Sensitive-modus.</li><li>Bruk myke hoder, iO Gentle Care.</li><li>Bytt hode oftere, gjerne annenhver måned.</li><li>Mange med ømt tannkjøtt har det bedre med en mild tannkrem uten SLS.</li></ul>
<p>Trykksensor og Sensitive-modus finnes også på iO5 og iO3. Har du plager med tannkjøttet, spør tannlegen eller tannpleieren hva som passer for deg.</p>` },

  { group: "Daglig bruk", id: "heads",
    q: "Hvor mye koster børstehodene i året?",
    k: ["hode", "hoder", "børstehode", "børstehoder", "år", "årlig", "kostnad", "bytte", "refill", "drift", "koster"],
    a: () => {
      const g = P.headsGentle8, perHead = g.price / g.count;
      return `<p>Bytt hode hver tredje måned. Det blir 4 hoder per person i året, 8 for dere to. Én 8-pakning holder et år.</p>
<ul><li>Gentle Care (myke), 8 stk: ${kr(g.price)} hos ${g.store}${flag(g)}. Elkjøp ${kr(P.headsGentle8Elkjop.price)}, full pris ${kr(P.headsGentle8Full.price)}. Clas Ohlson har 6 stk for ${kr(P.headsGentle6Clas.price)}.</li>
<li>Ultimate Clean, 8 stk: ${kr(P.headsUltimate8.price)} hos ${P.headsUltimate8.store}, kampanje til ${dShort(P.headsUltimate8.until)}.</li></ul>
<p>Med Gentle Care blir det rundt ${kr(perHead * 4)} per person i året. Bytter du annenhver måned, rundt ${kr(perHead * 6)}.</p>
<p>Duo-esken har 3 hoder, så første pakning trengs etter omtrent fire og en halv måned.</p>`; } },

  { group: "Daglig bruk", id: "app",
    q: "Hva gjør appen? Har den AI?",
    k: ["app", "appen", "ai", "sporing", "bluetooth", "data", "apple", "health", "soner", "smart", "mobil", "telefon", "skjerm"],
    a: () => `<p>Appen viser hvor i munnen du har pusset. iO9 og iO10 deler munnen inn i 16 soner, de andre iO-modellene i 6. Børsten lagrer øktene selv og synker neste gang appen er åpen. Den kan synke til Apple Health.</p>
<p>Oral-B sier at sporingen bruker AI trent på pussemønstre, og at Smart Adapt justerer børsten underveis. Det er produsentens påstander. Det finnes ingen uavhengige tester av akkurat det i kildene bak denne siden.</p>
<p>Appen er frivillig. Børsten fungerer uten.</p>` },

  { group: "Daglig bruk", id: "battery",
    q: "Hva om batteriet dør?",
    k: ["batteri", "batteriet", "dør", "garanti", "reklamasjon", "reklamere", "ødelagt", "holdbar", "levetid", "kvittering", "slutter"],
    a: () => `<p>Det er den vanligste klagen på iO9: noen opplever at batteriet svikter etter 12-18 måneder.</p>
<p>Forbrukerkjøpsloven gir fem års reklamasjonsfrist på ting som skal vare vesentlig lenger enn to år. Det gjelder normalt en elektrisk tannbørste i denne prisklassen. Ta vare på kvitteringen, så kan en død børste reklameres.</p>` },

  { group: "Lading og reise", id: "usbc",
    q: "Kan jeg lade med USB-C?",
    k: ["usb", "usbc", "lade", "lading", "kabel", "lader", "ladestand", "magnet", "støpsel", "port", "kontakt", "stikkontakt"],
    a: () => `<p>Nei. Børsten har ingen port. Den lades på en magnetisk lader med fast kabel og tostift-støpsel, eller i ladeetuiet, som også står i stikkontakten. Tester bekrefter at det ikke finnes USB-C.</p>
<p>En kabel alene kan ikke lade den. Du trenger laderen eller etuiet.</p>
<p>Trenger du en ekstra lader, koster en uoriginal rundt ${kr(P.extraCharger.price)} og en original rundt ${kr(P.chargerOriginal.price)}${flag(P.chargerOriginal)}.</p>` },

  { group: "Lading og reise", id: "travel",
    q: "Hva gjør jeg når jeg reiser?",
    k: ["reise", "reiser", "ferie", "tur", "fly", "utland", "batteritid", "borte", "helg", "hytte", "koffert"],
    a: () => `<p>Oral-B oppgir 12-14 dager på én lading. Tester har målt 5-10 dager. Regn med rundt en uke.</p>
<p>På en helgetur trenger du ingen lader. Er du borte lenger, ta med den lille magnetladeren eller ladeetuiet. Laderen tåler 100-240 V og har tostift-støpsel, så den passer i veggen i Norden og det meste av Europa. Storbritannia og USA trenger bare en pluggadapter.</p>
<p>Han har ladeetuiet som fast lader, så det er bare å ta det med på tur. Standen din blir stående hjemme. I kulde holder batteriet kortere.</p>` },
];
const OPTIONS = [
  { id: "duo", label: "Duo", buy: () => P.io9Duo.price, heads: () => P.io9Duo.headsIncluded, extra: 0, items: () => [[`iO9 Duo, ${P.io9Duo.store}`, P.io9Duo.price]],
    note: () => "Du får standen hjemme, han får ladeetuiet han reiser med. Etuiet lader fra stikkontakten." },
  { id: "duoPlus", label: "Duo + lader", buy: () => duoPlus(), heads: () => P.io9Duo.headsIncluded, items: () => [[`iO9 Duo, ${P.io9Duo.store}`, P.io9Duo.price], ["Ekstra lader", P.extraCharger.price, !P.extraCharger.verified]],
    note: () => "Begge får en stående lader. Etuiet blir til reise." },
  { id: "two", label: "To enkle", buy: () => twoSingles(), heads: () => 2 * P.io9Single.headsIncluded, items: () => [[`2 × iO9 enkel, ${P.io9Single.store}`, twoSingles()]],
    note: () => "Hver får egen lader, eget etui og egen holder. Begge kan velge svart." },
  { id: "io5", label: "iO5 Duo", buy: () => P.io5Duo.price, heads: () => P.io5Duo.headsIncluded, items: () => [["iO5 Duo", P.io5Duo.price, !P.io5Duo.verified]],
    note: () => `Billigere alternativ med samme hoder og trykksensor, uten skjerm og 16-soners sporing. Prisen er fra ${dShort(P.io5Duo.checked)}, og innholdet i esken er ikke sjekket.` },
];
const state = { opt: "duo", head: "gentle", months: 3, years: 3 };

function calc(o, s) {
  const needed = Math.max(0, 2 * (12 / s.months) * s.years - o.heads());
  const headsCost = needed * headPrice(s.head);
  const total = o.buy() + headsCost;
  return { needed, headsCost, total, perPersonYear: total / 2 / s.years };
}

/* ---------- rendering ---------- */
const $ = s => document.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = () => typeof window.gsap !== "undefined" && !reduceMotion;
const val = v => typeof v === "function" ? v() : v;

/* Numbers count up to their new value. The text is always set to the final value first, so nothing depends on the tween. */
function countTo(el, to, fmt, from) {
  if (el._t) el._t.kill();
  const start = from !== undefined ? from : el._v;
  el._v = to;
  if (!canAnimate() || start === undefined || start === to) { el.textContent = fmt(to); return; }
  const o = { v: start };
  el._t = gsap.to(o, { v: to, duration: 0.9, ease: "power3.out", onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = fmt(to); } });
}

function renderOptions() {
  $("#optRow").innerHTML = OPTIONS.map(o =>
    `<label><input type="radio" name="opt" value="${o.id}"${o.id === state.opt ? " checked" : ""}><span>${o.label}<small>${num(o.buy())} kr</small></span></label>`
  ).join("");
}

function renderBars(all) {
  const box = $("#bars");
  if (!box.dataset.built) {
    box.innerHTML = `<p class="label">Per person per år, alle valg</p>` + OPTIONS.map(x =>
      `<div class="bar" data-id="${x.id}"><span class="name">${x.label}</span><span class="track"><span class="fill"></span></span><span class="val"></span></div>`).join("");
    box.dataset.built = "1";
  }
  const max = Math.max(...all.map(a => a.r.perPersonYear));
  all.forEach(a => {
    const b = box.querySelector(`[data-id="${a.o.id}"]`);
    b.classList.toggle("on", a.o.id === state.opt);
    b.querySelector(".fill").style.transform = `scaleX(${(a.r.perPersonYear / max).toFixed(3)})`;
    countTo(b.querySelector(".val"), a.r.perPersonYear, kr);
  });
}

function renderCalc() {
  const o = OPTIONS.find(x => x.id === state.opt);
  const r = calc(o, state);
  const hp = headPrice(state.head);
  countTo($("#perPerson"), r.perPersonYear, kr);
  countTo($("#totalNum"), r.total, kr);
  $("#totalYears").textContent = state.years;
  $("#liveSum").textContent = `${kr(r.perPersonYear)} per person per år, ${kr(r.total)} totalt over ${state.years} år`;
  $("#optNote").textContent = o.note();
  const rows = o.items().map(([k, v, unv]) => `<li><span class="k">${k}${unv ? ' <span class="unv">*</span>' : ""}</span><span class="dots"></span><span class="v">${kr(v)}</span></li>`);
  rows.push(`<li><span class="k">${num(r.needed)} hoder à ${num(hp)} kr</span><span class="dots"></span><span class="v">${kr(r.headsCost)}</span></li>`);
  rows.push(`<li class="sum"><span class="k">Sum ${state.years} år</span><span class="dots"></span><span class="v">${kr(r.total)}</span></li>`);
  rows.push(`<li><span class="k">Per person</span><span class="dots"></span><span class="v">${kr(r.total / 2)}</span></li>`);
  if (o.items().some(i => i[2])) rows.push(`<li><span class="k"><span class="unv">*</span> pris ikke sjekket i dag</span></li>`);
  $("#receipt").innerHTML = rows.join("");
  if (canAnimate()) gsap.from("#receipt li", { y: 8, opacity: 0, duration: 0.45, stagger: 0.04, ease: "power3.out", clearProps: "opacity,transform" });
  renderBars(OPTIONS.map(x => ({ o: x, r: calc(x, state) })));
  $("#yearsOut").textContent = state.years + " år";
}

const BRUSH = (body, edge, head, tuft, ring, screen) => `<svg viewBox="0 0 120 520" aria-hidden="true"><use href="#brush" width="120" height="520" style="--body:${body};--edge:${edge};--head:${head};--tuft:${tuft};--ring:${ring};--screen:${screen}"/></svg>`;

function renderVerdict() {
  const saved = twoSingles() - P.io9Duo.price;
  const offer = campaignOn()
    ? `Tilbudet hos Power gjelder til ${dShort(P.campaign.end)}.`
    : `Kampanjen hos Power sluttet ${dShort(P.campaign.end)}. Sjekk prisen før du kjøper.`;
  const her = BRUSH("#efc4c2", "#cf9ea1", "#f4f4f1", "#cfd5d9", "#fff", "#4a2a30");
  const him = BRUSH("#1b1c20", "#4a4c54", "#ecece8", "#c4cace", "#efc4c2", "#08080a");
  $("#verdictBody").innerHTML =
    `<p>Duo-pakken til ${kr(P.io9Duo.price)} er billigst, ${kr(P.io9Duo.price / 2)} per person. Hver av dere får en børste.</p>
<div class="homes">
<div class="home her" data-r>${her}<div><span class="tag">Standen</span><p>Du tar magnetladeren, siden du har eget bad hjemme.</p></div></div>
<div class="home him" data-r>${him}<div><span class="tag">Etuiet</span><p>Han tar ladeetuiet, siden han reiser mye og deler bad. Etuiet lader fra stikkontakten, så han trenger ingen ekstra lader.</p></div></div>
</div>
<p>To enkle koster ${kr(saved)} mer.</p>
<p>Vil du ha stående lader på vasken i stedet for etuiet, legg til en ekstra lader til ca. ${kr(P.extraCharger.price)}. ${offer}</p>`;
  $("#duel").innerHTML = [
    ["Duo", P.io9Duo.price, true],
    ["Duo + ekstra lader", duoPlus(), false],
    ["To enkle", twoSingles(), false],
  ].map(([t, v, w]) => `<div class="row${w ? " win" : ""}" data-r><dt>${t}</dt><dd><span data-v="${v}">${kr(v)}</span></dd></div>`).join("");
  $("#stamp").textContent = `Priser sjekket ${dLong(P.checked)}. Ingen cashback å regne med nå.`;
  $("#footStamp").textContent = `Priser sjekket ${dLong(P.checked)} hos ${P.io9Duo.store}. Tall merket «sjekk i butikk» er eldre. Prisene kan endre seg.`;
}

function renderFaq() {
  const groups = [...new Set(FAQ.map(f => f.group))];
  $("#faqList").innerHTML = groups.map(g =>
    `<div class="group" data-r><p class="label">${g}</p>${FAQ.filter(f => f.group === g).map(f =>
      `<details id="faq-${f.id}"><summary><span>${val(f.q)}</span><span class="pm" aria-hidden="true"></span></summary><div class="a-wrap"><div class="a">${val(f.a)}</div></div></details>`
    ).join("")}</div>`
  ).join("");
}

/* The accordion animates height with GSAP when it can. Without it the native details element still works. */
function wireFaq() {
  $("#faqList").addEventListener("click", e => {
    const s = e.target.closest("summary");
    if (!s || !canAnimate()) return;
    e.preventDefault();
    const d = s.parentElement, wrap = d.querySelector(".a-wrap");
    gsap.killTweensOf(wrap);
    if (!d.open || d.dataset.s === "closed") {
      d.open = true; d.dataset.s = "open";
      gsap.fromTo(wrap, { height: wrap.offsetHeight }, { height: "auto", duration: 0.5, ease: "power3.out", clearProps: "height" });
      gsap.from(d.querySelector(".a"), { y: -8, opacity: 0, duration: 0.5, ease: "power3.out", clearProps: "opacity,transform" });
    } else {
      d.dataset.s = "closed";
      gsap.to(wrap, { height: 0, duration: 0.32, ease: "power3.inOut", onComplete: () => { d.open = false; gsap.set(wrap, { clearProps: "height" }); } });
    }
  });
}

const STOP = new Set("jeg du vi er det en et å og i på til med for som kan hva hvor hvordan om den de har vel da eller må skal meg oss seg av at ikke noe sånn io9 oral b ob iO9 dere deg min mitt mine din får blir bli hvis når så".split(" "));
const tokens = s => s.toLowerCase().replace(/[^a-zæøå0-9\s-]/g, " ").replace(/-/g, "").split(/\s+/).filter(t => t && !STOP.has(t));
const hit = (t, k) => t === k || (k.length >= 3 && t.startsWith(k)) || (t.length >= 4 && k.startsWith(t));
function localAnswer(q) {
  const qt = tokens(q);
  let best = null, bestScore = 0;
  for (const f of FAQ) {
    const qw = tokens(val(f.q));
    let s = 0;
    for (const t of qt) {
      if (f.k.some(k => hit(t, k))) s += 2;
      if (qw.some(w => hit(t, w))) s += 1;
    }
    if (s > bestScore) { bestScore = s; best = f; }
  }
  return bestScore >= 2 ? best : null;
}

/* ---------- chat ---------- */
const SUGGEST = [
  "Trenger vi Duo når vi bor hver for oss?",
  "Kan jeg lade med USB-C?",
  "Passer den for sensitivt tannkjøtt?",
  "Hva koster hodene i året?",
];
const OFF_LINE = "Live-svar er av akkurat nå, her er det nærmeste svaret";
const BUSY_LINE = "Litt mange spørsmål på kort tid, prøv igjen om litt.";
const NGROK = { "ngrok-skip-browser-warning": "1" };
const $log = $("#log"), $q = $("#q"), $send = $("#send"), $status = $("#status"), $form = $("#ask");
let API = "", live = null, busy = false, ctl = null, coolUntil = 0;
const turns = [];

/* bot.json holds the backend address. Empty or unreachable means the local FAQ matcher answers. */
const botReady = (async () => {
  try {
    const r = await fetch("bot.json", { cache: "no-store" });
    API = String((await r.json()).api || "").replace(/\/+$/, "");
  } catch (e) { API = ""; }
  if (!API) { live = false; $status.textContent = OFF_LINE; return; }
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4000);
  try {
    const r = await fetch(API + "/api/health", { headers: NGROK, signal: c.signal });
    live = r.ok;
  } catch (e) { live = false; }
  clearTimeout(t);
  if (!live) $status.textContent = OFF_LINE;
})();

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function md(text) {
  return esc(text).split(/\n{2,}/).map(block => {
    const lines = block.split("\n");
    if (lines.every(l => /^\s*[-*•]\s+/.test(l))) return "<ul>" + lines.map(l => "<li>" + l.replace(/^\s*[-*•]\s+/, "") + "</li>").join("") + "</ul>";
    return "<p>" + lines.join("<br>") + "</p>";
  }).join("").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function addMsg(cls, html) {
  const el = document.createElement("div");
  el.className = "msg " + cls;
  el.innerHTML = html;
  $log.appendChild(el);
  return el;
}
function showLocal(el, q, note) {
  const f = localAnswer(q);
  el.innerHTML = f
    ? `${val(f.a)}<p class="from">Fra: ${val(f.q)}</p>`
    : `<p>Det finner jeg ikke noe svar på her. Prøv å spørre om pris, lading, hoder, appen eller reise.</p>`;
  if (note) el.insertAdjacentHTML("beforeend", `<p class="note">${note}</p>`);
}
function setBusy(b) {
  busy = b;
  $send.textContent = b ? "Stopp" : "Send";
  $send.type = b ? "button" : "submit";
  document.querySelectorAll(".chip").forEach(c => { c.disabled = b; });
}
function cooldown(sec) {
  coolUntil = Date.now() + sec * 1000;
  $send.disabled = true;
  setTimeout(() => { $send.disabled = false; coolUntil = 0; }, sec * 1000);
}

/* Typewriter: streamed text lands in a buffer and is revealed a few characters per frame, faster when the backlog grows. */
const CARET = '<span class="caret" aria-hidden="true"></span>';
function typer(el) {
  let target = "", shown = 0, done = false, raf = 0, finish;
  const paint = last => {
    let html = md(target.slice(0, shown));
    if (!last) html = html.replace(/(<\/p>|<\/li><\/ul>)$/, CARET + "$1");
    el.innerHTML = html;
  };
  const tick = () => {
    const back = target.length - shown;
    if (back > 0) {
      shown = Math.min(target.length, shown + (reduceMotion ? back : Math.max(1, Math.ceil(back / 16))));
      paint(false);
      el.scrollIntoView({ block: "nearest" });
    }
    if (done && shown >= target.length) { paint(true); finish(); return; }
    raf = requestAnimationFrame(tick);
  };
  return {
    push(t) { target += t; if (!raf) raf = requestAnimationFrame(tick); },
    end() { done = true; return new Promise(res => { finish = res; if (!raf) raf = requestAnimationFrame(tick); }); },
    cut() { cancelAnimationFrame(raf); target = target.slice(0, shown); paint(true); },
    get text() { return target; },
  };
}

async function ask(q) {
  q = q.trim();
  if (!q || busy || Date.now() < coolUntil) return;
  addMsg("me", esc(q));
  $q.value = ""; autosize();
  const el = addMsg("bot", '<span class="typing" aria-label="Tenker"><i></i><i></i><i></i></span>');
  el.setAttribute("aria-busy", "true");
  setBusy(true);
  await botReady;
  if (!live) {
    showLocal(el, q);
    el.removeAttribute("aria-busy"); setBusy(false);
    el.scrollIntoView({ block: "nearest" });
    return;
  }
  turns.push({ role: "user", content: q });
  while (turns.length > 12) turns.shift();
  while (turns.length && turns[0].role !== "user") turns.shift();
  ctl = new AbortController();
  const tw = typer(el);
  let got = false;
  try {
    const res = await fetch(API + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...NGROK },
      body: JSON.stringify({ messages: turns }),
      signal: ctl.signal,
    });
    if (res.status === 429) {
      turns.pop();
      el.innerHTML = `<p>${BUSY_LINE}</p>`;
      cooldown(20);
      return;
    }
    if (!res.ok || !res.body) throw new Error("bad response");
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = dec.decode(value, { stream: true });
      if (chunk) { got = true; tw.push(chunk); }
    }
    if (!got) throw new Error("empty");
    await tw.end();
    turns.push({ role: "assistant", content: tw.text });
  } catch (e) {
    turns.pop();
    if (e && e.name === "AbortError") {
      tw.cut();
      el.insertAdjacentHTML("beforeend", '<p class="note">Stoppet.</p>');
    } else if (got) {
      tw.cut();
      el.insertAdjacentHTML("beforeend", '<p class="note">Svaret ble avbrutt. Send spørsmålet på nytt om du vil.</p>');
    } else {
      live = false;
      $status.textContent = OFF_LINE;
      showLocal(el, q, OFF_LINE);
    }
  } finally {
    ctl = null;
    el.removeAttribute("aria-busy");
    setBusy(false);
    if (coolUntil) $send.disabled = true;
  }
}

function autosize() { $q.style.height = "auto"; $q.style.height = Math.min($q.scrollHeight, 160) + "px"; }

function wire() {
  $("#chips").innerHTML = SUGGEST.map(s => `<button type="button" class="chip">${s}</button>`).join("");
  $("#chips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) ask(b.textContent); });
  $form.addEventListener("submit", e => { e.preventDefault(); ask($q.value); });
  $send.addEventListener("click", () => { if (busy && ctl) ctl.abort(); });
  $q.addEventListener("input", autosize);
  $q.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask($q.value); } });
  $("#optRow").addEventListener("change", e => { state.opt = e.target.value; renderCalc(); });
  document.querySelectorAll('input[name="head"]').forEach(i => i.addEventListener("change", () => { state.head = i.value; renderCalc(); }));
  document.querySelectorAll('input[name="months"]').forEach(i => i.addEventListener("change", () => { state.months = Number(i.value); renderCalc(); }));
  $("#years").addEventListener("input", e => { state.years = Number(e.target.value); renderCalc(); });
  $("#theme").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("io9-theme", next); } catch (e) { /* storage blocked */ }
  });
}

/* ---------- motion ---------- */
/* One idea: her brush stays on the stand, his travels in the case. The rail charges the travelling one as you scroll. */
function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js");
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    /* load moment */
    const orbit = $(".orbit");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".room", { yPercent: 8, autoAlpha: 0, duration: 1.1, stagger: 0.14, ease: "expo.out" }, 0)
      .from(orbit, { strokeDashoffset: 1, duration: 1.8, ease: "power2.inOut" }, 0.3)
      .from("#b1", { y: 150, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.45)
      .from("#case", { y: 90, autoAlpha: 0, duration: 1, ease: "expo.out" }, 0.55)
      .from("#b2", { y: -200, rotation: 24, autoAlpha: 0, transformOrigin: "50% 100%", duration: 1.5, ease: "back.out(1.3)" }, 0.7)
      .from(".hero h1 .ln > span", { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.2)
      .from(".kicker, .lede, .btn", { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.75)
      .from(".nav", { y: -40, autoAlpha: 0, duration: 0.9 }, 0.9);

    /* hero scroll: his brush lifts out of the case and leaves, hers stays put */
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 } })
      .to("#b2g", { y: -70, rotation: 16, svgOrigin: "345 488", ease: "none" }, 0)
      .to(".art", { yPercent: -6, ease: "none" }, 0)
      .to(".hero-glow", { yPercent: -18, ease: "none" }, 0);

    /* the rail: charge level follows the page */
    const rail = $("#rail"), railCase = $(".rail-case"), fill = $(".rail-fill"), pct = $("#railPct");
    const wide = matchMedia("(min-width: 900px)");
    ScrollTrigger.create({
      trigger: document.body, start: "top top", end: "bottom bottom",
      onUpdate: self => {
        const p = self.progress;
        const len = wide.matches ? rail.clientHeight - 34 : rail.clientWidth - 22;
        gsap.set(railCase, wide.matches ? { y: p * len, x: 0 } : { x: p * len, y: 0 });
        gsap.set(fill, wide.matches ? { scaleY: p, scaleX: 1 } : { scaleX: p, scaleY: 1 });
        pct.textContent = Math.round(p * 100);
      },
    });

    /* verdict: homes, the case slides out, numbers count */
    gsap.fromTo(".home.him svg", { y: 22, rotation: -5 }, { y: -8, rotation: 9, ease: "none", scrollTrigger: { trigger: ".homes", start: "top 85%", end: "bottom 30%", scrub: 0.6 } });
    ScrollTrigger.batch("#duel [data-v]", {
      start: "top 92%", once: true,
      onEnter: els => els.forEach((el, i) => gsap.delayedCall(i * 0.12, () => countTo(el, Number(el.dataset.v), kr, 0))),
    });

    /* band scrubs sideways */
    gsap.to("#bandTrack", { xPercent: -38, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.8 } });
    gsap.from("#answer .ln > span", { yPercent: 115, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: "#answer", start: "top 88%", once: true } });

    /* generic reveal */
    const items = gsap.utils.toArray("[data-r]").filter(e => !e.matches("#answer"));
    gsap.set(items, { autoAlpha: 0, y: 30 });
    ScrollTrigger.batch(items, {
      start: "top 90%", once: true,
      onEnter: els => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true, clearProps: "transform" }),
    });

    /* pointer parallax, fine pointers only, after the intro */
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    if (fine.matches) {
      tl.eventCallback("onComplete", () => {
        const qx1 = gsap.quickTo("#b1g", "x", { duration: 0.8, ease: "power3" });
        const qx2 = gsap.quickTo("#b2g", "x", { duration: 0.8, ease: "power3" });
        $(".hero").addEventListener("pointermove", e => {
          const k = e.clientX / innerWidth - 0.5;
          qx1(k * -14); qx2(k * 22);
        });
      });
    }
    return () => { gsap.set("[data-r]", { clearProps: "all" }); };
  });
  const refresh = () => ScrollTrigger.refresh();
  addEventListener("load", refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
}

renderVerdict();
renderOptions();
renderCalc();
renderFaq();
wireFaq();
wire();
try { if (window.gsap && window.ScrollTrigger) initMotion(); } catch (e) {
  if (window.gsap) gsap.set("[data-r], .hero *", { clearProps: "all" });
}
