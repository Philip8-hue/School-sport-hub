// Get club details from dataset or page context
const rawClubName = document.body.dataset.club || "";
const rawPlayerType = (document.body.dataset.type || document.body.dataset.category || "").toLowerCase();
const playersContainer = document.getElementById("clubPlayers");

// Helper function to match club names flexibly (case-insensitive, trims, handling singular/plural like Spartan/Spartans)
function matchesClub(playerClub, targetClub) {
    if (!playerClub || !targetClub) return false;
    const p = playerClub.trim().toLowerCase();
    const t = targetClub.trim().toLowerCase();
    if (p === t) return true;
    if ((p === "spartan" && t === "spartans") || (p === "spartans" && t === "spartan")) return true;
    return false;
}

// Detect category if not explicitly set
function detectCategory() {
    if (rawPlayerType) {
        if (rawPlayerType.includes("female") && rawPlayerType.includes("football")) return "female-football";
        if (rawPlayerType.includes("female") && rawPlayerType.includes("basketball")) return "female-basketball";
        if (rawPlayerType.includes("basketball")) return "male-basketball";
        if (rawPlayerType.includes("football")) return "male-football";
        if (rawPlayerType === "femalefootballplayers") return "female-football";
        if (rawPlayerType === "femalebasketballplayers") return "female-basketball";
        if (rawPlayerType === "malebasketballplayers") return "male-basketball";
        return rawPlayerType;
    }

    // Inspect header tags or text
    const headerSpan = document.querySelector(".club-profile-header span, .club-header span");
    const headerText = headerSpan ? headerSpan.textContent.toLowerCase() : "";
    if (headerText.includes("female") && headerText.includes("football")) return "female-football";
    if (headerText.includes("female") && headerText.includes("basketball")) return "female-basketball";
    if (headerText.includes("basketball")) return "male-basketball";
    if (headerText.includes("football")) return "male-football";

    // Inspect URL / filename
    const path = window.location.pathname.toLowerCase();
    if (path.includes("girls-") || path.includes("female-football")) return "female-football";
    if (path.includes("female-") || path.includes("female-basketball")) return "female-basketball";
    if (path.includes("sharks") || path.includes("vinisio") || path.includes("warriors") || path.includes("wolves")) return "male-basketball";

    return "male-football";
}

if (playersContainer && rawClubName) {
    const category = detectCategory();
    let clubPlayers = [];

    // =====================================
    // STRICT SPORT & GENDER FILTERING
    // =====================================
    if (category === "female-football") {
        if (typeof femaleFootballPlayers !== "undefined") {
            clubPlayers = femaleFootballPlayers.filter(p => matchesClub(p.club, rawClubName));
        }
    } else if (category === "female-basketball") {
        if (typeof femaleBasketballPlayers !== "undefined") {
            clubPlayers = femaleBasketballPlayers.filter(p => matchesClub(p.club, rawClubName));
        }
    } else if (category === "male-basketball") {
        if (typeof maleBasketballPlayers !== "undefined") {
            clubPlayers = maleBasketballPlayers.filter(p => matchesClub(p.club, rawClubName));
        }
    } else {
        // Default to male-football
        if (typeof players !== "undefined") {
            clubPlayers = players.filter(p => matchesClub(p.club, rawClubName));
        }
    }

    // =====================================
    // DISPLAY PLAYERS
    // =====================================
    playersContainer.innerHTML = "";

    clubPlayers.forEach(player => {
        const playerCard = document.createElement("div");
        playerCard.classList.add("club-player-card");

        playerCard.innerHTML = `
            <div class="player-photo">
                <img 
                    src="${
                        player.photo && player.photo !== "#"
                        ? player.photo
                        : "images/players/default-player.png"
                    }"
                    alt="${player.name}"
                    onerror="this.src='images/players/default-player.png'"
                >
            </div>

            <h3>${player.name}</h3>

            <p>Jersey #${player.number}</p>

            <p>${player.position}</p>

            ${player.height ? `<p>Height: ${player.height}</p>` : ""}

            <p>Rating: ${typeof player.rating === "number" ? player.rating.toFixed(1) : player.rating}</p>
        `;

        playersContainer.appendChild(playerCard);
    });

    // If no players were found
    if (clubPlayers.length === 0) {
        playersContainer.innerHTML = `
            <p>No players found for ${rawClubName}.</p>
        `;
    }
}
