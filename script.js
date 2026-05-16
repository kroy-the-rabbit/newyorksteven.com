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
const visitorLabel = document.querySelector("#visitorLabel");
const prevRing = document.querySelector("#prevRing");
const nextRing = document.querySelector("#nextRing");
const ringName = document.querySelector("#ringName");
const spotlightImage = document.querySelector("#spotlightImage");
const spotlightCaption = document.querySelector("#spotlightCaption");
const photoTiles = document.querySelectorAll(".photo-tile");

let factIndex = 0;
let ringIndex = 0;

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

photoTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    photoTiles.forEach((otherTile) => otherTile.classList.remove("is-active"));
    tile.classList.add("is-active");
    spotlightImage.src = tile.dataset.photo;
    spotlightImage.alt = tile.dataset.alt;
    spotlightCaption.textContent = tile.dataset.caption;

    if (window.matchMedia("(max-width: 820px)").matches) {
      spotlightImage.closest(".spotlight").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

guestbookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  const name = String(formData.get("name") || "Anonymous").trim().slice(0, 24) || "Anonymous";
  const message = String(formData.get("message") || "Steve rules.").trim().slice(0, 72) || "Steve rules.";
  const entry = document.createElement("article");
  const entryName = document.createElement("strong");
  const entryMessage = document.createElement("p");

  entryName.textContent = name;
  entryMessage.textContent = message;
  entry.append(entryName, entryMessage);
  guestbookEntries.prepend(entry);
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
