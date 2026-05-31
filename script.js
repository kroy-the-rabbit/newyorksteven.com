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

const guestbookSeeds = [
  {
    name: "Webmaster",
    message: "Remember to hydrate and respect Steve."
  },
  {
    name: "Guest_31337",
    message: "This page has the energy of a brand-new mousepad."
  },
  {
    name: "NickelbackFan420",
    message: "Steve said \"just one Nickelback song\" and somehow the whole room knew every word."
  },
  {
    name: "KiaSpotter",
    message: "Saw Steve's Kia downtown. Compact? Yes. Emotionally enormous? Also yes."
  },
  {
    name: "GolfRumorDept",
    message: "Unconfirmed report: Steve is entering the Masters next year if the snack cart situation improves."
  },
  {
    name: "RoombaAdmin",
    message: "Roomba charged. Steve perimeter secured."
  },
  {
    name: "AOLSteve",
    message: "Downloaded this guestbook entry at 56k and it was worth the wait."
  },
  {
    name: "MetsHatModem",
    message: "The hat has logged on and would like everyone to remain calm."
  },
  {
    name: "IslandersWitness",
    message: "Steve wore team colors and still somehow improved the room."
  },
  {
    name: "JetsTherapy",
    message: "Leaving supportive comments until the offense gets back from lunch."
  },
  {
    name: "OuterRimHR",
    message: "Steve's remote-work location was approved, but the commute is suspicious."
  },
  {
    name: "LarsTempCheck",
    message: "Drums sounded great. Lars has been notified politely."
  },
  {
    name: "SnackCartScout",
    message: "Masters rumors intensify whenever Steve sees a well-stocked cooler."
  },
  {
    name: "KaraokeMarshal",
    message: "Lane seven filed a noise permit after Steve found the chorus."
  },
  {
    name: "CitationClerk",
    message: "Steve's paperwork says 'too powerful' in permanent marker."
  },
  {
    name: "GeoNeighbor",
    message: "Love the animated vibes. Please sign my webring after dinner."
  },
  {
    name: "CoolMeterTech",
    message: "Meter exploded again. This is now considered expected behavior."
  },
  {
    name: "KicksLoaded",
    message: "The Converse photo has entered evidence with full ankle authority."
  },
  {
    name: "KiaKeychain",
    message: "Steve's Kia has more personality than most midsize SUVs."
  },
  {
    name: "NickelbackDefense",
    message: "For legal reasons, that chorus was catchy."
  },
  {
    name: "MallDirectory",
    message: "Steve was last seen near the arcade with leadership energy."
  },
  {
    name: "DialupDiane",
    message: "The guestbook loaded one pixel at a time and every pixel was Steve."
  },
  {
    name: "PalpatineRef",
    message: "The cage match had questionable lightning, but excellent pageantry."
  },
  {
    name: "SnackTable",
    message: "Steve inspected the chips with the seriousness of a playoff review."
  },
  {
    name: "BrowserBuddy",
    message: "This site works best viewed while saying 'radical' quietly."
  },
  {
    name: "PalmTreeGolf",
    message: "Steve's golf shirt suggests vacation, strategy, and one mulligan."
  },
  {
    name: "KiaValet",
    message: "Parked the Kia up front because confidence deserves visibility."
  },
  {
    name: "NickelbackEncore",
    message: "Someone requested a second song and nobody has admitted it yet."
  },
  {
    name: "MastersCaddie",
    message: "Steve will consider Augusta once the sandwich logistics are finalized."
  },
  {
    name: "SteveArchivist",
    message: "Printed this page for the permanent binder. Used the good paper."
  }
];

const factButton = document.querySelector("#factButton");
const factText = document.querySelector("#steveFact");
const guestbookForm = document.querySelector("#guestbookForm");
const guestbookEntries = document.querySelector("#guestbookEntries");
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

function renderGuestbookDefaults() {
  const defaultEntries = shuffleItems(guestbookSeeds).slice(0, 5);
  const fragment = document.createDocumentFragment();

  defaultEntries.forEach(({ name, message }) => {
    fragment.append(createGuestbookEntry(name, message));
  });

  guestbookEntries.append(fragment);
}

const storedVisits = Number.parseInt(localStorage.getItem("steveVisits") || "4206", 10);
const nextVisit = Number.isFinite(storedVisits) ? storedVisits + 1 : 4207;
localStorage.setItem("steveVisits", String(nextVisit));
visitorLabel.textContent = String(nextVisit);

document.querySelectorAll(".counter span").forEach((digit, index, digits) => {
  const padded = String(nextVisit).padStart(digits.length, "0").slice(-digits.length);
  digit.textContent = padded[index];
});

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

renderGuestbookDefaults();

guestbookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  const name = String(formData.get("name") || "Anonymous").trim().slice(0, 24) || "Anonymous";
  const message = String(formData.get("message") || "Steve rules.").trim().slice(0, 72) || "Steve rules.";
  guestbookEntries.prepend(createGuestbookEntry(name, message));
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
