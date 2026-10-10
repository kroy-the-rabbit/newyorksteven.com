const steveFacts = [
  "Steve can parallel park a browser window.",
  "Steve once fixed a printer by giving it a confident nod.",
  "Steve's favorite loading bar is already complete.",
  "Steve keeps spare ZIP disks for emotional support.",
  "Steve types HTML tags with dramatic timing.",
  "Steve knows which floppy disk has the good fonts.",
  "Steve can make a screensaver feel seen.",
  "Steve once received a citation and treated it like a championship belt.",
  "Steve's Mets hat has its own emergency broadcast system.",
  "Steve can turn a bowling alley microphone into municipal infrastructure."
];

const ringSites = [
  "Steve's Cool Links",
  "The Radical Steve Archive",
  "Steve Fan Club HQ",
  "Steve's Midi Mansion",
  "Totally Steve Top 8"
];

const factButton = document.querySelector("#factButton");
const factText = document.querySelector("#steveFact");
const guestbookForm = document.querySelector("#guestbookForm");
const guestbookEntries = document.querySelector("#guestbookEntries");
const guestbookStatus = document.querySelector("#guestbookStatus");
const visitorLabel = document.querySelector("#visitorLabel");
const prevRing = document.querySelector("#prevRing");
const nextRing = document.querySelector("#nextRing");
const ringName = document.querySelector("#ringName");
const spotlightImage = document.querySelector("#spotlightImage");
const spotlightCaption = document.querySelector("#spotlightCaption");
const photoGrid = document.querySelector(".photo-grid");
const photoTiles = Array.from(document.querySelectorAll(".photo-tile"));

let factIndex = 0;
let ringIndex = 0;

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function formatEntryDate(createdAt) {
  // D1 stores UTC as "YYYY-MM-DD HH:MM:SS"; show it as a New York calendar date.
  const date = new Date(`${createdAt.replace(" ", "T")}Z`);

  return date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

function createGuestbookEntry({ name, message, created_at: createdAt }) {
  const entry = document.createElement("article");
  const entryHeader = document.createElement("header");
  const entryName = document.createElement("strong");
  const entryDate = document.createElement("time");
  const entryMessage = document.createElement("p");

  entryName.textContent = name;
  entryDate.dateTime = `${createdAt.replace(" ", "T")}Z`;
  entryDate.textContent = formatEntryDate(createdAt);
  entryMessage.textContent = message;
  entryHeader.append(entryName, entryDate);
  entry.append(entryHeader, entryMessage);

  return entry;
}

function selectPhotoTile(tile) {
  photoTiles.forEach((otherTile) => otherTile.classList.remove("is-active"));
  tile.classList.add("is-active");
  spotlightImage.src = tile.dataset.photo;
  spotlightImage.alt = tile.dataset.alt;
  spotlightCaption.textContent = tile.dataset.caption;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

function renderGuestbook(entries) {
  const fragment = document.createDocumentFragment();

  entries.forEach((entry) => {
    fragment.append(createGuestbookEntry(entry));
  });

  guestbookEntries.replaceChildren(fragment);
}

async function loadGuestbook() {
  try {
    const { entries } = await api("/api/guestbook");
    renderGuestbook(entries);
  } catch {
    guestbookStatus.textContent = "Guestbook is offline. Steve is rebooting the modem.";
  }
}

function showVisits(visits) {
  visitorLabel.textContent = String(visits);

  document.querySelectorAll(".counter span").forEach((digit, index, digits) => {
    const padded = String(visits).padStart(digits.length, "0").slice(-digits.length);
    digit.textContent = padded[index];
  });
}

function sessionFlag(key, value) {
  try {
    if (value === undefined) {
      return sessionStorage.getItem(key);
    }
    sessionStorage.setItem(key, value);
  } catch {
    return null;
  }
  return value;
}

async function loadVisits() {
  // Count each browser session once so refreshing doesn't pump the counter.
  const alreadyCounted = sessionFlag("steveVisitCounted") === "1";

  try {
    const { visits } = await api("/api/visit", { method: alreadyCounted ? "GET" : "POST" });
    sessionFlag("steveVisitCounted", "1");
    showVisits(visits);
  } catch {
    // API unreachable (e.g. index.html opened from disk): keep the HTML default.
  }
}

loadVisits();

const coolPanel = document.querySelector(".meter-panel");
const coolMeter = document.querySelector(".meter");
const coolReading = document.querySelector("#coolReading");
const coolVerdict = document.querySelector("#coolVerdict");
const detonationThreshold = 90;
const coolVerdicts = [
  { min: 90, text: "Scientific result: recurring detonation." },
  { min: 70, text: "Mets hat at full broadcast power." },
  { min: 45, text: "Solidly radical. Roomba is impressed." },
  { min: 20, text: "Running on dial-up. Steve is buffering." },
  { min: 0, text: "Jets-level slump. Please send snacks." }
];

const coolIntervalMinutes = 5;

function steveCoolKey(date) {
  // Everyone sees the same reading: the clock is pinned to New York.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type).value;
  const slot = Math.floor(Number(part("minute")) / coolIntervalMinutes) * coolIntervalMinutes;

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${String(slot).padStart(2, "0")}`;
}

function fnv1a(text) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  // Murmur3 finalizer: neighboring hours otherwise produce evenly spaced readings.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;
}

let currentCoolKey = "";

function updateCoolMeter() {
  const coolKey = steveCoolKey(new Date());

  if (coolKey === currentCoolKey) {
    return;
  }

  currentCoolKey = coolKey;
  const reading = fnv1a(`steve-cool:${coolKey}`) % 101;
  const detonating = reading >= detonationThreshold;

  coolMeter.style.setProperty("--cool", String(reading / 100));
  coolMeter.setAttribute("aria-valuenow", String(reading));
  coolPanel.classList.toggle("is-detonating", detonating);
  coolReading.textContent = `${reading}%`;
  coolVerdict.textContent = coolVerdicts.find(({ min }) => reading >= min).text;
}

updateCoolMeter();
setInterval(updateCoolMeter, 10 * 1000);

factButton.addEventListener("click", () => {
  factIndex = (factIndex + 1) % steveFacts.length;
  factText.textContent = steveFacts[factIndex];
});

const randomizedPhotoTiles = shuffleItems(photoTiles);

randomizedPhotoTiles.forEach((tile) => {
  tile.classList.remove("is-active");
  photoGrid.append(tile);
});

if (randomizedPhotoTiles.length > 0) {
  selectPhotoTile(randomizedPhotoTiles[0]);
}

photoTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    selectPhotoTile(tile);
  });
});

loadGuestbook();

const guestbookSubmit = guestbookForm.querySelector("button[type=submit]");
const guestbookName = guestbookForm.elements.name;
const guestbookMessage = guestbookForm.elements.message;
let guestbookSending = false;

function updateGuestbookSubmit() {
  const filledIn = guestbookName.value.trim() !== "" && guestbookMessage.value.trim() !== "";
  guestbookSubmit.disabled = guestbookSending || !filledIn;
}

guestbookForm.addEventListener("input", updateGuestbookSubmit);
updateGuestbookSubmit();

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(guestbookForm);

  guestbookSending = true;
  updateGuestbookSubmit();
  guestbookStatus.textContent = "Transmitting at 56k...";

  try {
    const { entry } = await api("/api/guestbook", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        message: formData.get("message"),
        website: formData.get("website")
      })
    });

    if (entry) {
      guestbookEntries.prepend(createGuestbookEntry(entry));
    }
    guestbookMessage.value = "";
    guestbookStatus.textContent = "Signed! Steve has been notified.";
  } catch (error) {
    guestbookStatus.textContent = error.message;
  } finally {
    guestbookSending = false;
    updateGuestbookSubmit();
  }
});

function showRingSite() {
  ringName.textContent = ringSites[ringIndex];
}

prevRing.addEventListener("click", () => {
  ringIndex = (ringIndex - 1 + ringSites.length) % ringSites.length;
  showRingSite();
});

nextRing.addEventListener("click", () => {
  ringIndex = (ringIndex + 1) % ringSites.length;
  showRingSite();
});
