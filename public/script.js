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

function createGuestbookEntry(name, message) {
  const entry = document.createElement("article");
  const entryName = document.createElement("strong");
  const entryMessage = document.createElement("p");

  entryName.textContent = name;
  entryMessage.textContent = message;
  entry.append(entryName, entryMessage);

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

  entries.forEach(({ name, message }) => {
    fragment.append(createGuestbookEntry(name, message));
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

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  const submitButton = guestbookForm.querySelector("button[type=submit]");

  submitButton.disabled = true;
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
      guestbookEntries.prepend(createGuestbookEntry(entry.name, entry.message));
    }
    guestbookStatus.textContent = "Signed! Steve has been notified.";
  } catch (error) {
    guestbookStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
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
