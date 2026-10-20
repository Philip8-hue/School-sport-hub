const volleyballPlayers = [
    { id: 1, name: "Philip", fullName: "Philip", club: "Leo", number: 10, position: "Setter / Outside Hitter", captain: true, note: "Not in registration form — suggested #10 or #5", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 2, name: "Chidera", fullName: "Ibono Chidera", club: "Leo", number: 7, position: "Libero / Defensive Specialist", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 3, name: "Manny", fullName: "Manny", club: "Leo", number: 9, position: "Opposite / Right-Side Hitter", note: "Not in registration form — suggested #9", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 4, name: "Shallom", fullName: "Shallom Aneke", club: "Leo", number: 44, position: "Flexible / Middle Blocker / Hitter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 5, name: "Sarah", fullName: "Chijioke Sarah", club: "Leo", number: 15, position: "Position TBD / Middle Blocker / Opposite", note: "Form preference: #7 or #15; #15 assigned to avoid collision", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 6, name: "Leke", fullName: "Adeleke Samuel Oluwatobiloba", club: "Leo", number: 30, position: "Position TBD / Opposite / Outside Hitter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 7, name: "Gift", fullName: "Gift Chinomso", club: "Leo", number: 8, position: "Position TBD / Defensive Specialist / Receiver", note: "Form preference: #7; adjusted to #8 to avoid duplicate", rating: 5.0, matches: 0, aces: 0, blocks: 0 },

    { id: 8, name: "David", fullName: "Oduh David", club: "Orion", number: 19, position: "Outside Hitter", captain: true, rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 9, name: "Mr. Fope", fullName: "Mr. Fope", club: "Orion", number: 5, position: "Middle Blocker / Setter", note: "Not in registration form — suggested #5 or #8", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 10, name: "Aderonke", fullName: "Olubode Aderonke Ruth", club: "Orion", number: 27, position: "Libero / Defensive Specialist", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 11, name: "Anna", fullName: "Alabi Atinuke Anna", club: "Orion", number: 12, position: "Position TBD / Middle Blocker / Opposite", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 12, name: "Chizzy", fullName: "Big_chizzy / Chizitere Paul", club: "Orion", number: 1, position: "Libero / Defensive Specialist", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 13, name: "Ab", fullName: "Uwangue Abieuwa", club: "Orion", number: 4, position: "Position TBD / Opposite / Outside Hitter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 14, name: "Tega", fullName: "Ovwighowhara Tega", club: "Orion", number: 11, position: "Position TBD / Middle Blocker", rating: 5.0, matches: 0, aces: 0, blocks: 0 },

    { id: 15, name: "CJ", fullName: "CJ", club: "Pegasus", number: 3, position: "Outside Hitter", captain: true, note: "Not in registration form — suggested #3 or #9", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 16, name: "Joseph", fullName: "Sunday Joseph", club: "Pegasus", number: 14, position: "Setter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 17, name: "Onana", fullName: "Onana", club: "Pegasus", number: 24, position: "Middle Blocker / Defensive Specialist", note: "Not in registration form — suggested #24", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 18, name: "Iyin", fullName: "Taiwo Iyinoluwa", club: "Pegasus", number: 10, position: "Flexible / Opposite / Outside Hitter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 19, name: "Virtue", fullName: "Lawal Virtue", club: "Pegasus", number: 6, position: "Outside Hitter", note: "Form preferred text: LAWAL; standard number #6 assigned", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 20, name: "Jewel", fullName: "Sogeinde Gods jewel", club: "Pegasus", number: 2, position: "Position TBD / Libero / Defensive Specialist", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 21, name: "Yinka", fullName: "Izu Adeyinka Josephine", club: "Pegasus", number: 7, position: "Position TBD / Middle Blocker / Opposite", rating: 5.0, matches: 0, aces: 0, blocks: 0 },

    { id: 22, name: "Divine", fullName: "Divinedestiny Chijioke Ekwom", club: "Trojans", number: 21, position: "Outside Hitter", captain: false, rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 23, name: "Courage", fullName: "Courage", captain: true, club: "Trojans", number: 5, position: "Opposite Hitter / Libero", note: "Not in registration form — suggested #5 or #3", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 24, name: "Believe", fullName: "Obasi Believe Princess", club: "Trojans", number: 13, position: "Middle Blocker", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 25, name: "Tobiloba", fullName: "Oluwatobiloba Odebo", club: "Trojans", number: 18, position: "Flexible / Opposite / Outside Hitter", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 26, name: "Florish", fullName: "Ikechukwu Flourish Chika", club: "Trojans", number: 8, position: "Position TBD / Defensive Specialist / Receiver", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 27, name: "Victor", fullName: "Victor Oladosu", club: "Trojans", number: 12, position: "Flexible / Outside Hitter / Middle Blocker", rating: 5.0, matches: 0, aces: 0, blocks: 0 },
    { id: 28, name: "Eze Gift", fullName: "Gift Amarachi Eze", club: "Trojans", number: 17, position: "Position TBD / Middle Blocker / Opposite", note: "Form preference: #18; adjusted to #17 to avoid collision", rating: 5.0, matches: 0, aces: 0, blocks: 0 }
];

const volleyballOfficials = [
    { name: "Kindness", fullName: "Ezekwesirim Kindness Gladys", role: "Match Umpire", registration: "Registered position: Libero / Defensive Specialist", number: 8 }
];

function displayVolleyballPlayers(playersToDisplay = volleyballPlayers) {
    const list = document.getElementById("volleyballPlayerList");
    if (!list) return;
    list.innerHTML = "";
    playersToDisplay.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}${player.captain ? " ⭐" : ""}</strong><small>${player.fullName}</small></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.matches}</td>
            <td>${player.aces}</td>
            <td>${player.blocks}</td>
            <td>${player.note || "—"}</td>
        `;
        list.appendChild(row);
    });
}

function filterVolleyballPlayers() {
    const search = document.getElementById("volleyballPlayerSearch").value.toLowerCase();
    const club = document.getElementById("volleyballClubFilter").value;
    const position = document.getElementById("volleyballPositionFilter").value;
    const filteredPlayers = volleyballPlayers.filter(player => {
        const searchable = `${player.name} ${player.fullName} ${player.position}`.toLowerCase();
        return searchable.includes(search)
            && (club === "all" || player.club === club)
            && (position === "all" || player.position.toLowerCase().includes(position.toLowerCase()));
    });
    displayVolleyballPlayers(filteredPlayers);
}

const volleyballClubFromUrl = new URLSearchParams(window.location.search).get("club");
const volleyballClubFilter = document.getElementById("volleyballClubFilter");
if (volleyballClubFilter && volleyballClubFromUrl) {
    volleyballClubFilter.value = volleyballPlayers.some(player => player.club === volleyballClubFromUrl)
        ? volleyballClubFromUrl
        : "all";
}
if (volleyballClubFilter && volleyballClubFilter.value !== "all") {
    filterVolleyballPlayers();
} else {
    displayVolleyballPlayers();
}
