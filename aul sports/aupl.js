const players = [

    // ================================
    // ANCHOR
    // ================================
    { id: 1, name: "Buffalo", club: "Anchor", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 2, name: "Enoch durowoju", club: "Anchor", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 3, name: "Mitchell &copy;", club: "Anchor", number: 2, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 4, name: "Legend", club: "Anchor", number: 3, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 5, name: "Kevin", club: "Anchor", number: 4, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 6, name: "Ekpo", club: "Anchor", number: 5, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 7, name: "Teju", club: "Anchor", number: 6, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 8, name: "Boytee", club: "Anchor", number: 13, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 9, name: "Idepefo David", club: "Anchor", number: 7, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 10, name: "Joshua Chikere", club: "Anchor", number: 8, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 11, name: "Onyebuchi Henry", club: "Anchor", number: 10, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 12, name: "joshua Akinnusoye", club: "Anchor", number: 14, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 13, name: "Favour Adeoye", club: "Anchor", number: 15, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 14, name: "Jeremiah Isreal", club: "Anchor", number: 16, position: "MID", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 15, name: "Wolesola Adeboye", club: "Anchor", number: 9, position: "FWD", photo: "", price: 9.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 16, name: "Majesty Ehizibolo", club: "Anchor", number: 11, position: "FWD", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 17, name: "Chukwuebuka Otika", club: "Anchor", number: 17, position: "FWD", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // DOMINION
    // ================================
    { id: 19, name: "King David &copy;", club: "Dominion", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 20, name: "idris", club: "Dominion", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 21, name: "Nwosu Emmanuel", club: "Dominion", number: 2, position: "DEF", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 22, name: "Divine", club: "Dominion", number: 3, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 23, name: "Lanez", club: "Dominion", number: 4, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 24, name: "Johnson Ore", club: "Dominion", number: 5, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 25, name: "Prince David", club: "Dominion", number: 6, position: "DEF", photo: "",price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 26, name: "Daniel sampson", club: "Dominion", number: 13, position: "DEF", photo: "",price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 27, name: "Adeshola Sunzzy", club: "Dominion", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 28, name: "Ajayi Jamin", club: "Dominion", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 29, name: "Yakubu Damilola", club: "Dominion", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 30, name: "Ezechukwu Somotochukwu Barnabas", club: "Dominion", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 31, name: "Gerald Oluebube Joshua", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 32, name: "Peter Ifeanyi", club: "Dominion", number: 16, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // EMPOWERMENT
    // ================================
    { id: 37, name: "Mark Peter", club: "Empowerment", number: 1, position: "GK",  photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 38, name: "John Adams", club: "Empowerment", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 39, name: "Daniel Obi", club: "Empowerment", number: 2, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 40, name: "Chris James", club: "Empowerment", number: 3, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 41, name: "Paul Frank", club: "Empowerment", number: 4, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 42, name: "Michael King", club: "Empowerment", number: 5, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 43, name: "Joseph Mike", club: "Empowerment", number: 6, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 44, name: "Victor Cole", club: "Empowerment", number: 13, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 45, name: "Samuel Adams", club: "Empowerment", number: 7, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 46, name: "David Frank", club: "Empowerment", number: 8, position: "MID",  photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 47, name: "Emeka Paul", club: "Empowerment", number: 10, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 48, name: "Brian John", club: "Empowerment", number: 14, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 49, name: "Henry King", club: "Empowerment", number: 15, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 50, name: "Tony James", club: "Empowerment", number: 16, position: "MID", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 51, name: "Alex Obi", club: "Empowerment", number: 9, position: "FWD", photo: "", price: 9.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 52, name: "Mike Adams", club: "Empowerment", number: 11, position: "FWD", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 53, name: "Joseph Frank", club: "Empowerment", number: 17, position: "FWD", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 54, name: "Victor James", club: "Empowerment", number: 18, position: "FWD", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },

    // ================================
    // GOLDEN STARS
    // ================================
    { id: 55, name: "Bellingham &copy;", club: "Golden Stars", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 56, name: "Munachi", club: "Golden Stars", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 57, name: "Prevail", club: "Golden Stars", number: 2, position: "DEF", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 58, name: "Dozie", club: "Golden Stars", number: 3, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 59, name: "Osiki", club: "Golden Stars", number: 4, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 60, name: "Alonge", club: "Golden Stars", number: 5, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 61, name: "Isa Toluwase", club: "Golden Stars", number: 6, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 62, name: "Joshua Akinnusoye", club: "Golden Stars", number: 13, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 63, name: "Ajayi Peter", club: "Golden Stars", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 64, name: "Francis Samuel", club: "Golden Stars", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 65, name: "Eliazer", club: "Golden Stars", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 66, name: "Fego", club: "Golden Stars", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 67, name: "Murewa", club: "Golden Stars", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // MILAN
    // ================================
    { id: 73, name: "Damilola Caleb &copy;", club: "Milan", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 74, name: "Matthew", club: "Milan", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 75, name: "Ephraim", club: "Milan", number: 2, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 76, name: "Bolurin", club: "Milan", number: 3, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 77, name: "Kachi", club: "Milan", number: 4, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 78, name: "Lukaku", club: "Milan", number: 5, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 79, name: "Adeleke Samuel", club: "Milan", number: 6, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 80, name: "Aribo Opeyemi", club: "Milan", number: 13, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 81, name: "Olidare Mofe", club: "Milan", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 82, name: "Onabanjo Richard", club: "Milan", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 83, name: "Okunsanya Semilore", club: "Milan", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 84, name: "Gbadegesin Daniel", club: "Milan", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 85, name: "Kolapo Faithful", club: "Milan", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 86, name: "Ogbennia Levi", club: "Milan", number: 16, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // PHOENIX
    // ================================
    { id: 91, name: "Kaydee &copy;", club: "Phoenix", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 92, name: "Eben", club: "Phoenix", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 93, name: "Spencer", club: "Phoenix", number: 2, position: "DEF", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 94, name: "Kunle", club: "Phoenix", number: 3, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 95, name: "Lucky", club: "Phoenix", number: 4, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 96, name: "Bamisaye Daniel", club: "Phoenix", number: 5, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 97, name: "Olatunji", club: "Phoenix", number: 6, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 98, name: "Majesty Ehizibolo", club: "Phoenix", number: 13, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 99, name: "Daniel Samson", club: "Phoenix", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 100, name: "Akakasiaka Divine", club: "Phoenix", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 101, name: "Philip Anjorin", club: "Phoenix", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 102, name: "Olaoluwa Agbaje", club: "Phoenix", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 103, name: "Akerele Goodness", club: "Phoenix", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 104, name: "Moses Nelson", club: "Phoenix", number: 16, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 105, name: "Anyaorah Kachi", club: "Phoenix", number: 9, position: "FWD", photo: "", price: 10.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 106, name: "Millie", club: "Phoenix", number: 11, position: "FWD", photo: "", price: 9.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // SAINTS
    // ================================
    { id: 109, name: "Debskie &copy;", club: "Saints", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 110, name: "Basil", club: "Saints", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 111, name: "Caleb", club: "Saints", number: 2, position: "DEF", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 112, name: "David", club: "Saints", number: 3, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 113, name: "Trem", club: "Saints", number: 4, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 114, name: "Jeremie", club: "Saints", number: 5, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 115, name: "Angaye", club: "Saints", number: 6, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 116, name: "Jumani", club: "Saints", number: 13, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 117, name: "Anointed", club: "Saints", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 118, name: "Iyang Enobong", club: "Saints", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 119, name: "Victor Ikechukwu", club: "Saints", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 120, name: "William Uye", club: "Saints", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 121, name: "Abiola Oluwanifemi", club: "Saints", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 122, name: "Olabode Micheal", club: "Saints", number: 16, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 123, name: "Oniya Joseph", club: "Saints", number: 9, position: "FWD", photo: "", price: 10.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 124, name: "Onoh John Paul", club: "Saints", number: 11, position: "FWD", photo: "", price: 9.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    // ================================
    // SPARTAN
    // ================================
    { id: 127, name: "Bruno &copy;", club: "Spartan", number: 1, position: "GK", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 128, name: "Emperor", club: "Spartan", number: 12, position: "GK", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 129, name: "Christopher", club: "Spartan", number: 2, position: "DEF", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 130, name: "Destiny", club: "Spartan", number: 3, position: "DEF", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 131, name: "Ojomo", club: "Spartan", number: 4, position: "DEF", photo: "", price: 5.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 132, name: "Chief", club: "Spartan", number: 5, position: "DEF", photo: "", price: 5.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 133, name: "Uche Christian", club: "Spartan", number: 4, position: "DEF", photo: "", price: 4.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 134, name: "Greatness Afolabi", club: "Spartan", number: 13, position: "DEF", photo: "", price: 4.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 135, name: "David David", club: "Spartan", number: 7, position: "MID", photo: "", price: 8.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 136, name: "Alafua Sean Peter", club: "Spartan", number: 8, position: "MID", photo: "", price: 8.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 137, name: "Iseoluwa Shalom", club: "Spartan", number: 10, position: "MID", photo: "", price: 7.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 138, name: "Charles Wisdom", club: "Spartan", number: 14, position: "MID", photo: "", price: 7.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 139, name: "Osuofia Elvis Ugochukwu", club: "Spartan", number: 15, position: "MID", photo: "", price: 6.5, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 140, name: "Uzozie Uchechukwu", club: "Spartan", number: 16, position: "MID", photo: "", price: 6.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },
    { id: 141, name: "Osho Daniel Olamide", club: "Spartan", number: 9, position: "FWD", photo: "", price: 10.0, rating: 5.0, matches: 0, minutes: 0, goals: 0, assists: 0 },

];

const maleBasketballPlayers = [

    // SHARKS
    {
        id: 145,
        name: "Aaron Okafor",
        sex: "Male",
        club: "Sharks",
        number: 4,
        height: "6'2\"",
        position: "PG",
        photo: "",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 146,
        name: "Brian Eze",
        sex: "Male",
        club: "Sharks",
        number: 7,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 147,
        name: "Chinedu Obi",
        sex: "Male",
        club: "Sharks",
        number: 10,
        height: "6'5\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 148,
        name: "David Nwachukwu",
        sex: "Male",
        club: "Sharks",
        number: 12,
        height: "6'7\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 149,
        name: "Emeka James",
        sex: "Male",
        club: "Sharks",
        number: 15,
        height: "6'9\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 150,
        name: "Frank Daniel",
        sex: "Male",
        club: "Sharks",
        number: 18,
        height: "6'3\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 151,
        name: "Ikenna Paul",
        sex: "Male",
        club: "Sharks",
        number: 21,
        height: "6'6\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 152,
        name: "Joseph Mark",
        sex: "Male",
        club: "Sharks",
        number: 23,
        height: "6'8\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 153,
        name: "Kelvin John",
        sex: "Male",
        club: "Sharks",
        number: 24,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 154,
        name: "Michael Ade",
        sex: "Male",
        club: "Sharks",
        number: 30,
        height: "6'5\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 155,
        name: "Samuel Cole",
        sex: "Male",
        club: "Sharks",
        number: 32,
        height: "6'7\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 156,
        name: "Victor Obi",
        sex: "Male",
        club: "Sharks",
        number: 35,
        height: "6'3\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    // VINISIO
    {
        id: 157,
        name: "Adrian Peter",
        sex: "Male",
        club: "Vinisio",
        number: 3,
        height: "6'2\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 158,
        name: "Benjamin Paul",
        sex: "Male",
        club: "Vinisio",
        number: 6,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 159,
        name: "Caleb James",
        sex: "Male",
        club: "Vinisio",
        number: 8,
        height: "6'5\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 160,
        name: "Daniel Emmanuel",
        sex: "Male",
        club: "Vinisio",
        number: 11,
        height: "6'7\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 161,
        name: "Ebuka Charles",
        sex: "Male",
        club: "Vinisio",
        number: 13,
        height: "6'10\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 162,
        name: "Frank Obi",
        sex: "Male",
        club: "Vinisio",
        number: 16,
        height: "6'3\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 163,
        name: "Gabriel David",
        sex: "Male",
        club: "Vinisio",
        number: 20,
        height: "6'6\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 164,
        name: "Henry Mike",
        sex: "Male",
        club: "Vinisio",
        number: 22,
        height: "6'8\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 165,
        name: "Isaac John",
        sex: "Male",
        club: "Vinisio",
        number: 25,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 166,
        name: "Joshua King",
        sex: "Male",
        club: "Vinisio",
        number: 27,
        height: "6'5\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 167,
        name: "Kingsley Ade",
        sex: "Male",
        club: "Vinisio",
        number: 31,
        height: "6'9\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 168,
        name: "Samuel David",
        sex: "Male",
        club: "Vinisio",
        number: 34,
        height: "6'3\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    // WARRIORS
    {
        id: 169,
        name: "Andrew Paul",
        sex: "Male",
        club: "Warriors",
        number: 2,
        height: "6'2\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 170,
        name: "Anthony James",
        sex: "Male",
        club: "Warriors",
        number: 5,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 171,
        name: "Brandon Cole",
        sex: "Male",
        club: "Warriors",
        number: 9,
        height: "6'6\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 172,
        name: "Chris Emmanuel",
        sex: "Male",
        club: "Warriors",
        number: 14,
        height: "6'8\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 173,
        name: "David Okoro",
        sex: "Male",
        club: "Warriors",
        number: 17,
        height: "6'10\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 174,
        name: "Emmanuel John",
        sex: "Male",
        club: "Warriors",
        number: 19,
        height: "6'3\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 175,
        name: "Felix Mark",
        sex: "Male",
        club: "Warriors",
        number: 26,
        height: "6'5\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 176,
        name: "George Peter",
        sex: "Male",
        club: "Warriors",
        number: 28,
        height: "6'7\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 177,
        name: "Henry Obi",
        sex: "Male",
        club: "Warriors",
        number: 29,
        height: "6'8\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 178,
        name: "Isaiah James",
        sex: "Male",
        club: "Warriors",
        number: 33,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 179,
        name: "Joshua Daniel",
        sex: "Male",
        club: "Warriors",
        number: 36,
        height: "6'9\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 180,
        name: "Victor Paul",
        sex: "Male",
        club: "Warriors",
        number: 40,
        height: "6'5\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    // WOLVES
    {
        id: 181,
        name: "Alex Daniel",
        sex: "Male",
        club: "Wolves",
        number: 1,
        height: "6'3\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 182,
        name: "Benjamin King",
        sex: "Male",
        club: "Wolves",
        number: 6,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 183,
        name: "Caleb Obi",
        sex: "Male",
        club: "Wolves",
        number: 8,
        height: "6'6\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 184,
        name: "Daniel Paul",
        sex: "Male",
        club: "Wolves",
        number: 11,
        height: "6'8\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 185,
        name: "Emeka David",
        sex: "Male",
        club: "Wolves",
        number: 15,
        height: "6'10\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 186,
        name: "Frank James",
        sex: "Male",
        club: "Wolves",
        number: 18,
        height: "6'2\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 187,
        name: "Gabriel Peter",
        sex: "Male",
        club: "Wolves",
        number: 20,
        height: "6'5\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 188,
        name: "Henry Cole",
        sex: "Male",
        club: "Wolves",
        number: 22,
        height: "6'7\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 189,
        name: "Isaac Mike",
        sex: "Male",
        club: "Wolves",
        number: 25,
        height: "6'9\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 190,
        name: "Joseph David",
        sex: "Male",
        club: "Wolves",
        number: 27,
        height: "6'4\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 191,
        name: "Michael John",
        sex: "Male",
        club: "Wolves",
        number: 30,
        height: "6'8\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 192,
        name: "Samuel Mark",
        sex: "Male",
        club: "Wolves",
        number: 34,
        height: "6'6\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    }

];

// ========================================
// FEMALE BASKETBALL PLAYERS
// ========================================

const femaleBasketballPlayers = [

    // =========================
    // SHARKS
    // =========================

    {
        id: 193,
        name: "Amara Okafor",
        sex: "Female",
        club: "Sharks",
        number: 4,
        height: "5'8",
        position: "PG",
        photo: "",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 194,
        name: "Blessing Eze",
        sex: "Female",
        club: "Sharks",
        number: 7,
        height: "5'10\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 195,
        name: "Chiamaka Obi",
        sex: "Female",
        club: "Sharks",
        number: 10,
        height: "5'9\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 196,
        name: "Deborah James",
        sex: "Female",
        club: "Sharks",
        number: 12,
        height: "6'0\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 197,
        name: "Esther Daniel",
        sex: "Female",
        club: "Sharks",
        number: 15,
        height: "6'2\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 198,
        name: "Ifeoma Paul",
        sex: "Female",
        club: "Sharks",
        number: 18,
        height: "5'7\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 199,
        name: "Joy Mark",
        sex: "Female",
        club: "Sharks",
        number: 21,
        height: "5'11\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 200,
        name: "Mary John",
        sex: "Female",
        club: "Sharks",
        number: 24,
        height: "6'1\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },


    // =========================
    // VINISIO
    // =========================

    {
        id: 201,
        name: "Ada Peter",
        sex: "Female",
        club: "Vinisio",
        number: 3,
        height: "5'8\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 202,
        name: "Beatrice Paul",
        sex: "Female",
        club: "Vinisio",
        number: 6,
        height: "5'10\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 203,
        name: "Chidinma James",
        sex: "Female",
        club: "Vinisio",
        number: 9,
        height: "5'9\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 204,
        name: "Diana Emmanuel",
        sex: "Female",
        club: "Vinisio",
        number: 11,
        height: "6'0\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 205,
        name: "Evelyn Charles",
        sex: "Female",
        club: "Vinisio",
        number: 14,
        height: "6'2\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 206,
        name: "Favour Obi",
        sex: "Female",
        club: "Vinisio",
        number: 17,
        height: "5'7\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 207,
        name: "Gloria David",
        sex: "Female",
        club: "Vinisio",
        number: 20,
        height: "5'11\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 208,
        name: "Hannah Mike",
        sex: "Female",
        club: "Vinisio",
        number: 23,
        height: "6'1\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },


    // =========================
    // WARRIORS
    // =========================

    {
        id: 209,
        name: "Amaka Paul",
        sex: "Female",
        club: "Warriors",
        number: 4,
        height: "5'8\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 210,
        name: "Brenda James",
        sex: "Female",
        club: "Warriors",
        number: 7,
        height: "5'10\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 211,
        name: "Cynthia Emmanuel",
        sex: "Female",
        club: "Warriors",
        number: 10,
        height: "5'9\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 212,
        name: "Deborah John",
        sex: "Female",
        club: "Warriors",
        number: 13,
        height: "6'0\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 213,
        name: "Esther Mark",
        sex: "Female",
        club: "Warriors",
        number: 15,
        height: "6'2\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 214,
        name: "Faith Peter",
        sex: "Female",
        club: "Warriors",
        number: 18,
        height: "5'7\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 215,
        name: "Grace Obi",
        sex: "Female",
        club: "Warriors",
        number: 21,
        height: "5'11\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 216,
        name: "Helen David",
        sex: "Female",
        club: "Warriors",
        number: 25,
        height: "6'1\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },


    // =========================
    // WOLVES
    // =========================

    {
        id: 217,
        name: "Angela Daniel",
        sex: "Female",
        club: "Wolves",
        number: 3,
        height: "5'8\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 218,
        name: "Bridget King",
        sex: "Female",
        club: "Wolves",
        number: 6,
        height: "5'10\"",
        position: "SG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 219,
        name: "Chisom Obi",
        sex: "Female",
        club: "Wolves",
        number: 9,
        height: "5'9\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 220,
        name: "Doris Paul",
        sex: "Female",
        club: "Wolves",
        number: 12,
        height: "6'0\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 221,
        name: "Esther James",
        sex: "Female",
        club: "Wolves",
        number: 15,
        height: "6'2\"",
        position: "C",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 222,
        name: "Favour Mike",
        sex: "Female",
        club: "Wolves",
        number: 18,
        height: "5'7\"",
        position: "PG",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 223,
        name: "Gloria John",
        sex: "Female",
        club: "Wolves",
        number: 22,
        height: "5'11\"",
        position: "SF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    },

    {
        id: 224,
        name: "Hannah Mark",
        sex: "Female",
        club: "Wolves",
        number: 24,
        height: "6'1\"",
        position: "PF",
        photo: "#",
        rating: 5.0,
        games: 0,
        minutes: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0
    }

];

// =====================================
// FEMALE FOOTBALL PLAYERS
// =====================================

const femaleFootballPlayers = [

    // =========================
    // GOLDEN STARS
    // =========================

    {
        id: 101,
        name: "Amara Okafor",
        sex: "Female",
        club: "Golden Stars",
        number: 1,
        position: "GK",
        photo: "",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 102,
        name: "Blessing Eze",
        sex: "Female",
        club: "Golden Stars",
        number: 4,
        position: "DEF",
        photo: "images/female-football/blessing-eze.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 103,
        name: "Chiamaka Obi",
        sex: "Female",
        club: "Golden Stars",
        number: 5,
        position: "DEF",
        photo: "images/female-football/chiamaka-obi.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 104,
        name: "Deborah James",
        sex: "Female",
        club: "Golden Stars",
        number: 6,
        position: "DEF",
        photo: "images/female-football/deborah-james.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 105,
        name: "Esther Daniel",
        sex: "Female",
        club: "Golden Stars",
        number: 8,
        position: "MID",
        photo: "images/female-football/esther-daniel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 106,
        name: "Favour Paul",
        sex: "Female",
        club: "Golden Stars",
        number: 10,
        position: "MID",
        photo: "images/female-football/favour-paul.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 107,
        name: "Gloria Mark",
        sex: "Female",
        club: "Golden Stars",
        number: 14,
        position: "MID",
        photo: "images/female-football/gloria-mark.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 108,
        name: "Hannah John",
        sex: "Female",
        club: "Golden Stars",
        number: 17,
        position: "FWD",
        photo: "images/female-football/hannah-john.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 109,
        name: "Ifeoma David",
        sex: "Female",
        club: "Golden Stars",
        number: 19,
        position: "FWD",
        photo: "images/female-football/ifeoma-david.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 110,
        name: "Joy Emmanuel",
        sex: "Female",
        club: "Golden Stars",
        number: 22,
        position: "FWD",
        photo: "images/female-football/joy-emmanuel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },


    // =========================
    // MILAN
    // =========================

    {
        id: 111,
        name: "Ada Peter",
        sex: "Female",
        club: "Milan",
        number: 1,
        position: "GK",
        photo: "images/female-football/ada-peter.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 112,
        name: "Beatrice Paul",
        sex: "Female",
        club: "Milan",
        number: 3,
        position: "DEF",
        photo: "images/female-football/beatrice-paul.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 113,
        name: "Chidinma James",
        sex: "Female",
        club: "Milan",
        number: 5,
        position: "DEF",
        photo: "images/female-football/chidinma-james.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 114,
        name: "Diana Emmanuel",
        sex: "Female",
        club: "Milan",
        number: 7,
        position: "DEF",
        photo: "images/female-football/diana-emmanuel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 115,
        name: "Evelyn Charles",
        sex: "Female",
        club: "Milan",
        number: 8,
        position: "MID",
        photo: "images/female-football/evelyn-charles.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 116,
        name: "Faith Obi",
        sex: "Female",
        club: "Milan",
        number: 10,
        position: "MID",
        photo: "images/female-football/faith-obi.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 117,
        name: "Grace David",
        sex: "Female",
        club: "Milan",
        number: 12,
        position: "MID",
        photo: "images/female-football/grace-david.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 118,
        name: "Helen Mike",
        sex: "Female",
        club: "Milan",
        number: 15,
        position: "FWD",
        photo: "images/female-football/helen-mike.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 119,
        name: "Irene John",
        sex: "Female",
        club: "Milan",
        number: 18,
        position: "FWD",
        photo: "images/female-football/irene-john.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 120,
        name: "Janet King",
        sex: "Female",
        club: "Milan",
        number: 20,
        position: "FWD",
        photo: "images/female-football/janet-king.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },


    // =========================
    // PHOENIX
    // =========================

    {
        id: 121,
        name: "Kemi Daniel",
        sex: "Female",
        club: "Phoenix",
        number: 1,
        position: "GK",
        photo: "images/female-football/kemi-daniel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 122,
        name: "Lilian Okoro",
        sex: "Female",
        club: "Phoenix",
        number: 4,
        position: "DEF",
        photo: "images/female-football/lilian-okoro.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 123,
        name: "Mercy Eze",
        sex: "Female",
        club: "Phoenix",
        number: 6,
        position: "DEF",
        photo: "images/female-football/mercy-eze.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 124,
        name: "Nancy Obi",
        sex: "Female",
        club: "Phoenix",
        number: 7,
        position: "DEF",
        photo: "images/female-football/nancy-obi.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 125,
        name: "Olivia James",
        sex: "Female",
        club: "Phoenix",
        number: 8,
        position: "MID",
        photo: "images/female-football/olivia-james.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 126,
        name: "Peace Paul",
        sex: "Female",
        club: "Phoenix",
        number: 10,
        position: "MID",
        photo: "images/female-football/peace-paul.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 127,
        name: "Queen David",
        sex: "Female",
        club: "Phoenix",
        number: 13,
        position: "MID",
        photo: "images/female-football/queen-david.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 128,
        name: "Rita Emmanuel",
        sex: "Female",
        club: "Phoenix",
        number: 16,
        position: "FWD",
        photo: "images/female-football/rita-emmanuel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 129,
        name: "Sarah Peter",
        sex: "Female",
        club: "Phoenix",
        number: 19,
        position: "FWD",
        photo: "images/female-football/sarah-peter.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 130,
        name: "Tina Charles",
        sex: "Female",
        club: "Phoenix",
        number: 21,
        position: "FWD",
        photo: "images/female-football/tina-charles.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },


    // =========================
    // SPARTANS
    // =========================

    {
        id: 131,
        name: "Uchechi Mark",
        sex: "Female",
        club: "Spartans",
        number: 1,
        position: "GK",
        photo: "images/female-football/uchechi-mark.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 132,
        name: "Victoria Paul",
        sex: "Female",
        club: "Spartans",
        number: 3,
        position: "DEF",
        photo: "images/female-football/victoria-paul.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 133,
        name: "Wendy James",
        sex: "Female",
        club: "Spartans",
        number: 5,
        position: "DEF",
        photo: "images/female-football/wendy-james.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 134,
        name: "Yvonne Obi",
        sex: "Female",
        club: "Spartans",
        number: 6,
        position: "DEF",
        photo: "images/female-football/yvonne-obi.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 135,
        name: "Zainab David",
        sex: "Female",
        club: "Spartans",
        number: 8,
        position: "MID",
        photo: "images/female-football/zainab-david.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 136,
        name: "Adaeze John",
        sex: "Female",
        club: "Spartans",
        number: 10,
        position: "MID",
        photo: "images/female-football/adaeze-john.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 137,
        name: "Bridget Mike",
        sex: "Female",
        club: "Spartans",
        number: 14,
        position: "MID",
        photo: "images/female-football/bridget-mike.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 138,
        name: "Chisom Emmanuel",
        sex: "Female",
        club: "Spartans",
        number: 17,
        position: "FWD",
        photo: "images/female-football/chisom-emmanuel.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 139,
        name: "Doris King",
        sex: "Female",
        club: "Spartans",
        number: 19,
        position: "FWD",
        photo: "images/female-football/doris-king.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    },

    {
        id: 140,
        name: "Esther Paul",
        sex: "Female",
        club: "Spartans",
        number: 22,
        position: "FWD",
        photo: "images/female-football/esther-paul.jpg",
        rating: 5.0,
        matches: 0,
        minutes: 0,
        goals: 0,
        assists: 0
    }

];

// =====================================
// DISPLAY FEMALE FOOTBALL PLAYERS
// =====================================

function displayFemaleFootballPlayers(playersToDisplay = femaleFootballPlayers) {

    const list = document.getElementById("femaleFootballPlayerList");

    if (!list) return;

    list.innerHTML = "";

    playersToDisplay.forEach((player, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.matches}</td>
            <td>${player.minutes}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
        `;
    row.addEventListener("click", function () {
    showFemaleFootballPlayerCard(player);
});
        list.appendChild(row);
    });
}


// =====================================
// START FEMALE FOOTBALL PLAYERS
// =====================================

displayFemaleFootballPlayers();


// =====================================
// FILTER FEMALE FOOTBALL PLAYERS
// =====================================

function filterFemaleFootballPlayers() {

    const search =
        document.getElementById("femaleFootballSearch").value.toLowerCase();

    const club =
        document.getElementById("femaleFootballClubFilter").value;

    const position =
        document.getElementById("femaleFootballPositionFilter").value;


    const filteredPlayers = femaleFootballPlayers.filter(player => {

        const matchesSearch =
            player.name.toLowerCase().includes(search);

        const matchesClub =
            club === "all" || player.club === club;

        const matchesPosition =
            position === "all" || player.position === position;

        return matchesSearch && matchesClub && matchesPosition;
    });


    displayFemaleFootballPlayers(filteredPlayers);
}

function showFemaleFootballPlayerCard(player) {

    const card = document.getElementById("femaleFootballPlayerCard");

    if (!card) {
        alert("Player card HTML not found!");
        return;
    }

    // SHOW PHOTO
    document.getElementById("femaleFootballCardPhoto").src = player.photo;
    document.getElementById("femaleFootballCardPhoto").alt = player.name;

    document.getElementById("femaleFootballCardName").textContent =
        player.name;

    document.getElementById("femaleFootballCardClub").textContent =
        player.club;

    document.getElementById("femaleFootballCardNumber").textContent =
        "Jersey: " + player.number;

    document.getElementById("femaleFootballCardPosition").textContent =
        "Position: " + player.position;

    document.getElementById("femaleFootballCardRating").textContent =
        player.rating.toFixed(1);

    document.getElementById("femaleFootballCardMatches").textContent =
        player.matches;

    document.getElementById("femaleFootballCardMinutes").textContent =
        player.minutes;

    document.getElementById("femaleFootballCardGoals").textContent =
        player.goals;

    document.getElementById("femaleFootballCardAssists").textContent =
        player.assists;

    card.style.display = "flex";
}

// =====================================
// CLOSE FEMALE FOOTBALL PLAYER CARD
// =====================================

function closeFemaleFootballPlayerCard() {

    document.getElementById("femaleFootballPlayerCard").style.display =
        "none";
}

// =====================================
// DISPLAY FEMALE BASKETBALL PLAYERS
// =====================================

function displayFemaleBasketballPlayers(playersToDisplay = femaleBasketballPlayers) {
    const list = document.getElementById("femaleBasketballPlayerList");

    if (!list) return;

    list.innerHTML = "";

    playersToDisplay.forEach((player, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.games}</td>
            <td>${player.minutes}</td>
            <td>${player.points}</td>
            <td>${player.assists}</td>
            <td>${player.rebounds}</td>
            <td>${player.steals}</td>
            <td>${player.blocks}</td>
        `;
row.onclick = function () {
    showFemaleBasketballPlayerCard(player);
};
        list.appendChild(row);
    });
}

displayFemaleBasketballPlayers();

function filterFemaleBasketballPlayers() {

    const search =
        document.getElementById("femaleBasketballSearch").value.toLowerCase();

    const club =
        document.getElementById("femaleBasketballClubFilter").value;

    const position =
        document.getElementById("femaleBasketballPositionFilter").value;

    const filteredPlayers = femaleBasketballPlayers.filter(player => {

        const matchesSearch =
            player.name.toLowerCase().includes(search);

        const matchesClub =
            club === "all" || player.club === club;

        const matchesPosition =
            position === "all" || player.position === position;

        return matchesSearch && matchesClub && matchesPosition;
    });

    displayFemaleBasketballPlayers(filteredPlayers);
}

// =====================================
// FEMALE BASKETBALL PLAYER CARD
// =====================================

function showFemaleBasketballPlayerCard(player) {

    document.getElementById("femaleBasketballCardPhoto").src = player.photo;
    document.getElementById("femaleBasketballCardPhoto").alt = player.name;

    document.getElementById("femaleBasketballCardName").textContent =
        player.name;

    document.getElementById("femaleBasketballCardClub").textContent =
        player.club;

    document.getElementById("femaleBasketballCardNumber").textContent =
        "Jersey: " + player.number;

    document.getElementById("femaleBasketballCardHeight").textContent =
        "Height: " + player.height;

    document.getElementById("femaleBasketballCardPosition").textContent =
        "Position: " + player.position;

    document.getElementById("femaleBasketballCardRating").textContent =
        player.rating.toFixed(1);

    document.getElementById("femaleBasketballCardGames").textContent =
        player.games;

    document.getElementById("femaleBasketballCardMinutes").textContent =
        player.minutes;

    document.getElementById("femaleBasketballCardPoints").textContent =
        player.points;

    document.getElementById("femaleBasketballCardAssists").textContent =
        player.assists;

    document.getElementById("femaleBasketballCardRebounds").textContent =
        player.rebounds;

    document.getElementById("femaleBasketballCardSteals").textContent =
        player.steals;

    document.getElementById("femaleBasketballCardBlocks").textContent =
        player.blocks;

    document.getElementById("femaleBasketballPlayerCard").style.display =
        "flex";
}


// =====================================
// CLOSE FEMALE BASKETBALL PLAYER CARD
// =====================================

function closeFemaleBasketballPlayerCard() {

    document.getElementById("femaleBasketballPlayerCard").style.display =
        "none";
}
// =====================================
// DISPLAY MALE BASKETBALL PLAYERS
// =====================================

function displayMaleBasketballPlayers(playersToDisplay = maleBasketballPlayers) {

    const list = document.getElementById("maleBasketballPlayerList");

    if (!list) return;

    list.innerHTML = "";

    playersToDisplay.forEach((player, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.games}</td>
            <td>${player.minutes}</td>
            <td>${player.points}</td>
            <td>${player.assists}</td>
            <td>${player.rebounds}</td>
            <td>${player.steals}</td>
            <td>${player.blocks}</td>
        `;

        row.onclick = function () {
            showBasketballPlayerCard(player);
        };

        list.appendChild(row);
    });
}

displayMaleBasketballPlayers();

displayMaleBasketballPlayers();

function filterBasketballPlayers() {

    const search =
        document.getElementById("basketballPlayerSearch").value.toLowerCase();

    const club =
        document.getElementById("basketballClubFilter").value;

    const position =
        document.getElementById("basketballPositionFilter").value;

    const filteredPlayers = maleBasketballPlayers.filter(player => {

        const matchesSearch =
            player.name.toLowerCase().includes(search);

        const matchesClub =
            club === "all" || player.club === club;

        const matchesPosition =
            position === "all" || player.position === position;

        return matchesSearch && matchesClub && matchesPosition;
    });

    displayMaleBasketballPlayers(filteredPlayers);
}

function showBasketballPlayerCard(player) {

    document.getElementById("basketballCardPhoto").src = player.photo;
    document.getElementById("basketballCardPhoto").alt = player.name;

    document.getElementById("basketballCardName").textContent = player.name;
    document.getElementById("basketballCardClub").textContent = player.club;

    document.getElementById("basketballCardNumber").textContent =
        "Jersey: " + player.number;

    document.getElementById("basketballCardHeight").textContent =
        "Height: " + player.height;

    document.getElementById("basketballCardPosition").textContent =
        "Position: " + player.position;

    document.getElementById("basketballCardRating").textContent =
        player.rating.toFixed(1);

    document.getElementById("basketballCardGames").textContent =
        player.games;

    document.getElementById("basketballCardMinutes").textContent =
        player.minutes;

    document.getElementById("basketballCardPoints").textContent =
        player.points;

    document.getElementById("basketballCardAssists").textContent =
        player.assists;

    document.getElementById("basketballCardRebounds").textContent =
        player.rebounds;

    document.getElementById("basketballCardSteals").textContent =
        player.steals;

    document.getElementById("basketballCardBlocks").textContent =
        player.blocks;

    document.getElementById("basketballPlayerCard").style.display = "flex";
}


function closeBasketballPlayerCard() {

    document.getElementById("basketballPlayerCard").style.display = "none";

}

// =====================================
// DISPLAY MALE FOOTBALL PLAYERS
// =====================================

function displayMaleFootballPlayers() {

    const list = document.getElementById("maleFootballPlayerList");

    if (!list) return;

    list.innerHTML = "";

    players.forEach((player, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.matches}</td>
            <td>${player.minutes}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
        `;

        // CLICK TEST
        row.onclick = function () {
            showPlayerCard(player);
        };

        list.appendChild(row);
    });
}
displayMaleFootballPlayers();

function showPlayerCard(player) {

    const profile = document.getElementById("playerProfile");
    const overlay = document.getElementById("profileOverlay");

    if (!profile) {
        alert("PROFILE NOT FOUND");
        return;
    }

    profile.style.display = "block";
    overlay.style.display = "block";

    document.getElementById("profileName").textContent = player.name;

    document.getElementById("profilePhoto").src = player.photo;

    document.getElementById("profileClub").textContent = player.club;
    document.getElementById("profileNumber").textContent = player.number;
    document.getElementById("profilePosition").textContent = player.position;
    document.getElementById("profileRating").textContent =
        player.rating.toFixed(1);

    document.getElementById("profileMatches").textContent = player.matches;
    document.getElementById("profileMinutes").textContent = player.minutes;
    document.getElementById("profileGoals").textContent = player.goals;
    document.getElementById("profileAssists").textContent = player.assists;
}

// =====================================
// CLOSE PLAYER PROFILE
// =====================================

function closePlayerCard() {

    const profile = document.getElementById("playerProfile");
    const overlay = document.getElementById("profileOverlay");

    profile.style.display = "none";
    overlay.style.display = "none";
}

/// =====================================
// SEARCH, FILTER & SORT PLAYERS
// =====================================

const playerSearch = document.getElementById("playerSearch");
const clubFilter = document.getElementById("clubFilter");
const positionFilter = document.getElementById("positionFilter");
const sortPlayers = document.getElementById("sortPlayers");

function filterPlayers() {

    const search = playerSearch.value.toLowerCase();
    const club = clubFilter.value;
    const position = positionFilter.value;
    const sort = sortPlayers.value;

    const list = document.getElementById("maleFootballPlayerList");

    let filteredPlayers = players.filter(player => {

        const matchesSearch = player.name
            .toLowerCase()
            .includes(search);

        const matchesClub =
            club === "all" || player.club === club;

        const matchesPosition =
            position === "all" || player.position === position;

        return matchesSearch && matchesClub && matchesPosition;
    });

    // SORT PLAYERS

    if (sort === "rating") {
        filteredPlayers.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "goals") {
        filteredPlayers.sort((a, b) => b.goals - a.goals);
    }

    if (sort === "assists") {
        filteredPlayers.sort((a, b) => b.assists - a.assists);
    }

    if (sort === "name") {
        filteredPlayers.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    list.innerHTML = "";

    filteredPlayers.forEach((player, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.club}</td>
            <td>${player.number}</td>
            <td>${player.position}</td>
            <td>⭐ ${player.rating.toFixed(1)}</td>
            <td>${player.matches}</td>
            <td>${player.minutes}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
        `;

        row.onclick = function () {
            showPlayerCard(player);
        };

        list.appendChild(row);
    });
}

// EVENTS

if (playerSearch) playerSearch.addEventListener("input", filterPlayers);
if (clubFilter) clubFilter.addEventListener("change", filterPlayers);
if (positionFilter) positionFilter.addEventListener("change", filterPlayers);
if (sortPlayers) sortPlayers.addEventListener("change", filterPlayers);

// =====================================
// FANTASY SPORTS ENGINE (FOOTBALL & BASKETBALL)
// =====================================

let fantasyBudget = 100.0;
let selectedFootballPlayers = [];
let footballCaptainId = null;

let fantasyBasketBudget = 100.0;
let selectedBasketPlayers = [];
let basketCaptainId = null;

// Initialize fantasy state from localStorage
function initFantasyState() {
    try {
        const savedFb = localStorage.getItem("aul_fantasy_football");
        if (savedFb) {
            const data = JSON.parse(savedFb);
            selectedFootballPlayers = data.players || [];
            footballCaptainId = data.captainId || null;
            recalculateFootballBudget();
        }
    } catch (e) {
        console.error("Error loading fantasy football state", e);
    }

    try {
        const savedBb = localStorage.getItem("aul_fantasy_basketball");
        if (savedBb) {
            const data = JSON.parse(savedBb);
            selectedBasketPlayers = data.players || [];
            basketCaptainId = data.captainId || null;
            recalculateBasketBudget();
        }
    } catch (e) {
        console.error("Error loading fantasy basketball state", e);
    }

    // Auto-render if on relevant page
    if (document.querySelector(".football-pitch")) {
        updateBudget();
        displayTeam();
    }
    if (document.querySelector(".basketball-court")) {
        updateBasketBudget();
        displayBasketTeam();
    }
}

function saveFantasyFootballState() {
    localStorage.setItem("aul_fantasy_football", JSON.stringify({
        players: selectedFootballPlayers,
        captainId: footballCaptainId
    }));
}

function saveFantasyBasketballState() {
    localStorage.setItem("aul_fantasy_basketball", JSON.stringify({
        players: selectedBasketPlayers,
        captainId: basketCaptainId
    }));
}

function recalculateFootballBudget() {
    const totalSpent = selectedFootballPlayers.reduce((sum, p) => sum + (parseFloat(p.price) || 5.0), 0);
    fantasyBudget = Math.max(0, 100.0 - totalSpent);
}

function recalculateBasketBudget() {
    const totalSpent = selectedBasketPlayers.reduce((sum, p) => sum + (parseFloat(p.price) || 6.0), 0);
    fantasyBasketBudget = Math.max(0, 100.0 - totalSpent);
}

// =====================================
// FANTASY FOOTBALL
// =====================================

function openPlayerList() {
    const playerSelection = document.getElementById("playerSelection");
    if (!playerSelection) return;
    playerSelection.style.display = "block";
    playerSelection.scrollIntoView({ behavior: "smooth" });
    showPlayers();
}

function closePlayerList() {
    const playerSelection = document.getElementById("playerSelection");
    if (playerSelection) playerSelection.style.display = "none";
}

function showPlayers(posFilter = "all", searchTxt = "") {
    const playerList = document.getElementById("playerList");
    if (!playerList) return;

    playerList.innerHTML = "";

    const availableFootballPlayers = (typeof players !== "undefined" && Array.isArray(players)) ? players : [];

    let filtered = availableFootballPlayers.filter(p => {
        const matchPos = posFilter === "all" || p.position === posFilter;
        const matchSearch = !searchTxt || p.name.toLowerCase().includes(searchTxt.toLowerCase()) || p.club.toLowerCase().includes(searchTxt.toLowerCase());
        return matchPos && matchSearch;
    });

    if (filtered.length === 0) {
        playerList.innerHTML = `<p style="padding: 20px; text-align: center; color: #888;">No players found.</p>`;
        return;
    }

    filtered.forEach(player => {
        const isSelected = selectedFootballPlayers.some(p => p.id === player.id);
        const card = document.createElement("div");
        card.classList.add("player-card");

        const playerPrice = parseFloat(player.price) || 5.0;

        card.innerHTML = `
            <div>
                <strong>${player.name} ${isSelected ? '✅' : ''}</strong>
                <p>${player.club} • <span class="badge-${player.position}">${player.position}</span> • ⭐ ${player.rating ? player.rating.toFixed(1) : '5.0'}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <strong>$${playerPrice.toFixed(1)}m</strong>
                ${
                    isSelected
                    ? `<button style="background: #dc2626;" onclick="removePlayer(${player.id})">REMOVE</button>`
                    : `<button onclick="addPlayer(${player.id})">ADD</button>`
                }
            </div>
        `;
        playerList.appendChild(card);
    });
}

function addPlayer(playerId) {
    const availableFootballPlayers = (typeof players !== "undefined" && Array.isArray(players)) ? players : [];
    const player = availableFootballPlayers.find(p => p.id === playerId);
    if (!player) return;

    if (selectedFootballPlayers.length >= 15) {
        alert("Your squad is full (15 players max: 11 starters + 4 subs).");
        return;
    }

    if (selectedFootballPlayers.some(p => p.id === playerId)) {
        alert("You already selected this player.");
        return;
    }

    const price = parseFloat(player.price) || 5.0;
    if (fantasyBudget < price) {
        alert("You don't have enough budget remaining.");
        return;
    }

    const clubCount = selectedFootballPlayers.filter(p => p.club === player.club).length;
    if (clubCount >= 3) {
        alert(`Maximum 3 players allowed from ${player.club}.`);
        return;
    }

    // Check position limits (2 GK, 5 DEF, 5 MID, 3 FWD)
    const positionLimits = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
    const curPosCount = selectedFootballPlayers.filter(p => p.position === player.position).length;
    if (curPosCount >= positionLimits[player.position]) {
        alert(`You already have ${positionLimits[player.position]} ${player.position}s (squad maximum).`);
        return;
    }

    selectedFootballPlayers.push(player);
    if (!footballCaptainId) {
        footballCaptainId = player.id;
    }
    recalculateFootballBudget();
    saveFantasyFootballState();
    updateBudget();
    displayTeam();
    showPlayers();
}

function removePlayer(playerId) {
    const idx = selectedFootballPlayers.findIndex(p => p.id === playerId);
    if (idx === -1) return;

    selectedFootballPlayers.splice(idx, 1);
    if (footballCaptainId === playerId) {
        footballCaptainId = selectedFootballPlayers.length > 0 ? selectedFootballPlayers[0].id : null;
    }
    recalculateFootballBudget();
    saveFantasyFootballState();
    updateBudget();
    displayTeam();
    showPlayers();
}

function updateBudget() {
    const spent = 100.0 - fantasyBudget;
    const spentElement = document.getElementById("spent");
    const remainingElement = document.getElementById("remaining");

    if (spentElement) spentElement.textContent = `$${spent.toFixed(1)}m`;
    if (remainingElement) remainingElement.textContent = `$${fantasyBudget.toFixed(1)}m`;
}

function displayTeam() {
    const slots = document.querySelectorAll(".player-slot");
    const benchSlots = document.querySelectorAll(".bench-slot");
    if (!slots.length) return;

    slots.forEach(slot => {
        const pos = slot.dataset.position;
        const icon = pos === "GK" ? "🧤" : (pos === "DEF" ? "🛡️" : (pos === "MID" ? "⚽" : "🔥"));
        slot.innerHTML = `<div>${icon}</div><small>${pos}</small>`;
        slot.classList.remove("filled");
        slot.onclick = () => openPlayerList();
    });

    benchSlots.forEach(slot => {
        const pos = slot.dataset.position;
        const icon = pos === "GK" ? "🧤" : (pos === "DEF" ? "🛡️" : (pos === "MID" ? "⚽" : "🔥"));
        slot.innerHTML = `<div>${icon}</div><small>${pos}</small>`;
        slot.classList.remove("filled");
        slot.onclick = () => openPlayerList();
    });

    const startingNeeds = { GK: 1, DEF: 4, MID: 4, FWD: 2 };
    let starters = [];
    let bench = [];

    Object.keys(startingNeeds).forEach(position => {
        const posPlayers = selectedFootballPlayers.filter(p => p.position === position);
        starters.push(...posPlayers.slice(0, startingNeeds[position]));
        bench.push(...posPlayers.slice(startingNeeds[position]));
    });

    starters.forEach(player => {
        const slot = [...slots].find(s => s.dataset.position === player.position && !s.classList.contains("filled"));
        if (slot) {
            renderPlayerIntoSlot(slot, player, false);
        }
    });

    bench.forEach(player => {
        const slot = [...benchSlots].find(s => (s.dataset.position === player.position || !s.dataset.position) && !s.classList.contains("filled"));
        if (slot) {
            renderPlayerIntoSlot(slot, player, true);
        }
    });
}

function renderPlayerIntoSlot(slot, player, isBench) {
    const isCap = (player.id === footballCaptainId);
    const price = parseFloat(player.price) || 5.0;

    slot.innerHTML = `
        <div style="font-size: 13px; font-weight: bold; line-height: 1.2; text-align: center;">${player.name} ${isCap ? '<span title="Captain" style="background:#f59e0b; color:#fff; border-radius:3px; padding:1px 4px; font-size:10px;">C</span>' : ''}</div>
        <small style="color: #4b5563; font-size: 11px;">${player.club} • $${price.toFixed(1)}m</small>
    `;
    slot.classList.add("filled");
    slot.onclick = function (e) {
        e.stopPropagation();
        showPlayerActionModal(player, isBench);
    };
}

function showPlayerActionModal(player, isBench) {
    const isCap = (player.id === footballCaptainId);
    const price = (parseFloat(player.price) || 5.0).toFixed(1);

    // Remove any previous modal
    closeFantasyModal();

    const overlay = document.createElement("div");
    overlay.id = "fantasyActionModalOverlay";
    overlay.className = "fantasy-modal-overlay active";
    overlay.onclick = function (e) {
        if (e.target === overlay) closeFantasyModal();
    };

    overlay.innerHTML = `
        <div class="fantasy-modal-content">
            <div class="fantasy-modal-header">
                <h3>⚽ Player Options</h3>
                <button class="fantasy-modal-close" onclick="closeFantasyModal()">&times;</button>
            </div>
            <div class="fantasy-modal-body">
                <div class="player-action-profile">
                    <div class="player-action-avatar">
                        ${player.position === "GK" ? "🧤" : (player.position === "DEF" ? "🛡️" : (player.position === "MID" ? "⚽" : "🔥"))}
                    </div>
                    <div class="player-action-details">
                        <h4>${player.name}</h4>
                        <p>
                            <span>${player.club}</span> •
                            <strong class="badge-${player.position}">${player.position}</strong> •
                            <span>$${price}m</span>
                        </p>
                    </div>
                </div>

                <div class="fantasy-action-buttons">
                    <button class="btn-action btn-action-captain" onclick="setFootballCaptain(${player.id})">
                        <span>👑 ${isCap ? 'Currently Captain' : 'Make Captain (2x Points)'}</span>
                        <span>${isCap ? 'Active' : 'Select'} &rarr;</span>
                    </button>

                    <button class="btn-action btn-action-swap" onclick="openFootballSwapView(${player.id})">
                        <span>🔄 Swap / Substitute Player</span>
                        <span>Choose &rarr;</span>
                    </button>

                    <button class="btn-action btn-action-remove" onclick="confirmRemoveFootballPlayer(${player.id})">
                        <span>❌ Remove From Squad</span>
                        <span>Delete</span>
                    </button>
                </div>

                <div id="swapCandidatesContainer" style="display: none; margin-top: 15px;">
                    <h5 style="margin: 0 0 8px 0; color: #475569; font-size: 13px;">Select replacement player (${player.position}):</h5>
                    <div id="swapCandidatesList" class="swap-selection-list"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function closeFantasyModal() {
    const existing = document.getElementById("fantasyActionModalOverlay");
    if (existing) existing.remove();
}

function setFootballCaptain(playerId) {
    footballCaptainId = playerId;
    saveFantasyFootballState();
    displayTeam();
    closeFantasyModal();
}

function confirmRemoveFootballPlayer(playerId) {
    removePlayer(playerId);
    closeFantasyModal();
}

function openFootballSwapView(playerId) {
    const player = selectedFootballPlayers.find(p => p.id === playerId);
    if (!player) return;

    const candidates = selectedFootballPlayers.filter(p => p.position === player.position && p.id !== player.id);
    const container = document.getElementById("swapCandidatesContainer");
    const list = document.getElementById("swapCandidatesList");

    if (!container || !list) return;

    if (candidates.length === 0) {
        list.innerHTML = `<p style="padding: 12px; font-size: 13px; color: #64748b; text-align: center; margin: 0;">No other ${player.position} available in your squad to swap with.</p>`;
    } else {
        list.innerHTML = candidates.map(cand => `
            <div class="swap-item" onclick="executeFootballSwap(${player.id}, ${cand.id})">
                <div>
                    <strong style="color: #0f172a; font-size: 14px;">${cand.name}</strong>
                    <div style="font-size: 12px; color: #64748b;">${cand.club} • $${(parseFloat(cand.price) || 5.0).toFixed(1)}m</div>
                </div>
                <button style="background: #2563eb; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">Swap</button>
            </div>
        `).join("");
    }

    container.style.display = "block";
}

function executeFootballSwap(player1Id, player2Id) {
    const p1Idx = selectedFootballPlayers.findIndex(p => p.id === player1Id);
    const p2Idx = selectedFootballPlayers.findIndex(p => p.id === player2Id);

    if (p1Idx !== -1 && p2Idx !== -1) {
        const temp = selectedFootballPlayers[p1Idx];
        selectedFootballPlayers[p1Idx] = selectedFootballPlayers[p2Idx];
        selectedFootballPlayers[p2Idx] = temp;

        saveFantasyFootballState();
        displayTeam();
    }
    closeFantasyModal();
}

function autoPickFootballTeam() {
    const available = (typeof players !== "undefined" && Array.isArray(players)) ? [...players] : [];
    if (available.length < 15) {
        alert("Not enough players available to auto-pick.");
        return;
    }

    selectedFootballPlayers = [];
    let currentBudget = 100.0;
    const required = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
    const clubCounts = {};

    // Shuffle
    const shuffled = available.sort(() => 0.5 - Math.random());

    for (const [pos, count] of Object.entries(required)) {
        let added = 0;
        for (const p of shuffled) {
            if (added >= count) break;
            if (p.position === pos && !selectedFootballPlayers.some(sp => sp.id === p.id)) {
                const pClub = p.club || "Free";
                const pPrice = parseFloat(p.price) || 5.0;
                if ((clubCounts[pClub] || 0) < 3 && currentBudget >= pPrice) {
                    selectedFootballPlayers.push(p);
                    clubCounts[pClub] = (clubCounts[pClub] || 0) + 1;
                    currentBudget -= pPrice;
                    added++;
                }
            }
        }
    }

    if (selectedFootballPlayers.length > 0) {
        footballCaptainId = selectedFootballPlayers[0].id;
    }
    recalculateFootballBudget();
    saveFantasyFootballState();
    updateBudget();
    displayTeam();
    showPlayers();
    alert("Auto-picked a balanced squad for you!");
}

function resetFootballTeam() {
    if (confirm("Are you sure you want to reset your fantasy team?")) {
        selectedFootballPlayers = [];
        footballCaptainId = null;
        fantasyBudget = 100.0;
        saveFantasyFootballState();
        updateBudget();
        displayTeam();
        showPlayers();
    }
}

// =====================================
// FANTASY BASKETBALL ENGINE
// =====================================

function getAvailableBasketballPlayers() {
    let list = [];
    if (typeof maleBasketballPlayers !== "undefined" && Array.isArray(maleBasketballPlayers)) {
        list.push(...maleBasketballPlayers.map(p => ({
            ...p,
            price: p.price || (p.rating ? parseFloat((p.rating * 1.5).toFixed(1)) : 7.0),
            category: "Male Basketball"
        })));
    }
    if (typeof femaleBasketballPlayers !== "undefined" && Array.isArray(femaleBasketballPlayers)) {
        list.push(...femaleBasketballPlayers.map(p => ({
            ...p,
            price: p.price || (p.rating ? parseFloat((p.rating * 1.4).toFixed(1)) : 6.5),
            category: "Female Basketball"
        })));
    }
    return list;
}

function openBasketPlayerList() {
    const listElem = document.getElementById("basketPlayerSelection");
    if (!listElem) return;
    listElem.style.display = "block";
    listElem.scrollIntoView({ behavior: "smooth" });
    showBasketPlayers();
}

function closeBasketPlayerList() {
    const listElem = document.getElementById("basketPlayerSelection");
    if (listElem) listElem.style.display = "none";
}

function showBasketPlayers(posFilter = "all", searchTxt = "") {
    const container = document.getElementById("basketPlayerList");
    if (!container) return;
    container.innerHTML = "";

    const allBball = getAvailableBasketballPlayers();
    let filtered = allBball.filter(p => {
        const matchPos = posFilter === "all" || p.position === posFilter;
        const matchSearch = !searchTxt || p.name.toLowerCase().includes(searchTxt.toLowerCase()) || p.club.toLowerCase().includes(searchTxt.toLowerCase());
        return matchPos && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="padding: 20px; text-align: center; color: #888;">No basketball players found.</p>`;
        return;
    }

    filtered.forEach(player => {
        const isSelected = selectedBasketPlayers.some(p => p.id === player.id);
        const card = document.createElement("div");
        card.classList.add("player-card");

        const price = parseFloat(player.price) || 6.5;

        card.innerHTML = `
            <div>
                <strong>${player.name} ${isSelected ? '✅' : ''}</strong>
                <p>${player.club} • <span class="badge-${player.position}">${player.position}</span> • ⭐ ${player.rating ? player.rating.toFixed(1) : '5.0'}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <strong>$${price.toFixed(1)}m</strong>
                ${
                    isSelected
                    ? `<button style="background: #dc2626;" onclick="removeBasketPlayer(${player.id})">REMOVE</button>`
                    : `<button onclick="addBasketPlayer(${player.id})">ADD</button>`
                }
            </div>
        `;
        container.appendChild(card);
    });
}

function addBasketPlayer(playerId) {
    const all = getAvailableBasketballPlayers();
    const player = all.find(p => p.id === playerId);
    if (!player) return;

    if (selectedBasketPlayers.length >= 8) {
        alert("Your basketball squad is full (8 players max: 5 starters + 3 bench).");
        return;
    }

    if (selectedBasketPlayers.some(p => p.id === playerId)) {
        alert("Player already in squad.");
        return;
    }

    const price = parseFloat(player.price) || 6.5;
    if (fantasyBasketBudget < price) {
        alert("You do not have enough remaining budget.");
        return;
    }

    const clubCount = selectedBasketPlayers.filter(p => p.club === player.club).length;
    if (clubCount >= 3) {
        alert(`Maximum 3 players from ${player.club} allowed.`);
        return;
    }

    selectedBasketPlayers.push(player);
    if (!basketCaptainId) {
        basketCaptainId = player.id;
    }
    recalculateBasketBudget();
    saveFantasyBasketballState();
    updateBasketBudget();
    displayBasketTeam();
    showBasketPlayers();
}

function removeBasketPlayer(playerId) {
    const idx = selectedBasketPlayers.findIndex(p => p.id === playerId);
    if (idx === -1) return;

    selectedBasketPlayers.splice(idx, 1);
    if (basketCaptainId === playerId) {
        basketCaptainId = selectedBasketPlayers.length > 0 ? selectedBasketPlayers[0].id : null;
    }
    recalculateBasketBudget();
    saveFantasyBasketballState();
    updateBasketBudget();
    displayBasketTeam();
    showBasketPlayers();
}

function updateBasketBudget() {
    const spent = 100.0 - fantasyBasketBudget;
    const spentEl = document.getElementById("basketSpent");
    const remEl = document.getElementById("basketRemaining");
    if (spentEl) spentEl.textContent = `$${spent.toFixed(1)}m`;
    if (remEl) remEl.textContent = `$${fantasyBasketBudget.toFixed(1)}m`;
}

function displayBasketTeam() {
    const courtSlots = document.querySelectorAll(".court-slot");
    const benchSlots = document.querySelectorAll(".basket-bench-slot");
    if (!courtSlots.length) return;

    courtSlots.forEach(slot => {
        const pos = slot.dataset.position;
        slot.innerHTML = `<div>🏀</div><small>${pos}</small>`;
        slot.classList.remove("filled");
        slot.onclick = () => openBasketPlayerList();
    });

    benchSlots.forEach(slot => {
        slot.innerHTML = `<div>🏀</div><small>BENCH</small>`;
        slot.classList.remove("filled");
        slot.onclick = () => openBasketPlayerList();
    });

    // 5 Starters: PG, SG, SF, PF, C
    const standardPositions = ["PG", "SG", "SF", "PF", "C"];
    let starters = [];
    let bench = [];

    // Prioritize standard positions
    standardPositions.forEach(pos => {
        const match = selectedBasketPlayers.find(p => p.position === pos && !starters.includes(p));
        if (match) starters.push(match);
    });

    // Fill remaining up to 5 starters
    selectedBasketPlayers.forEach(p => {
        if (!starters.includes(p) && starters.length < 5) {
            starters.push(p);
        } else if (!starters.includes(p)) {
            bench.push(p);
        }
    });

    // Render Starters
    starters.forEach((player, idx) => {
        let slot = [...courtSlots].find(s => s.dataset.position === player.position && !s.classList.contains("filled"));
        if (!slot) slot = [...courtSlots].find(s => !s.classList.contains("filled"));
        if (slot) {
            renderBasketPlayerIntoSlot(slot, player, false);
        }
    });

    // Render Bench
    bench.forEach(player => {
        const slot = [...benchSlots].find(s => !s.classList.contains("filled"));
        if (slot) {
            renderBasketPlayerIntoSlot(slot, player, true);
        }
    });
}

function renderBasketPlayerIntoSlot(slot, player, isBench) {
    const isCap = (player.id === basketCaptainId);
    const price = parseFloat(player.price) || 6.5;

    slot.innerHTML = `
        <div style="font-size: 13px; font-weight: bold; line-height: 1.2; text-align: center;">${player.name} ${isCap ? '<span title="Captain" style="background:#f59e0b; color:#fff; border-radius:3px; padding:1px 4px; font-size:10px;">C</span>' : ''}</div>
        <small style="color: #4b5563; font-size: 11px;">${player.club} • ${player.position}</small>
        <small style="color: #16a34a; font-weight: bold; font-size: 10px;">$${price.toFixed(1)}m</small>
    `;
    slot.classList.add("filled");
    slot.onclick = function (e) {
        e.stopPropagation();
        showBasketPlayerActionModal(player, isBench);
    };
}

function showBasketPlayerActionModal(player, isBench) {
    const isCap = (player.id === basketCaptainId);
    const price = (parseFloat(player.price) || 6.5).toFixed(1);

    closeFantasyModal();

    const overlay = document.createElement("div");
    overlay.id = "fantasyActionModalOverlay";
    overlay.className = "fantasy-modal-overlay active";
    overlay.onclick = function (e) {
        if (e.target === overlay) closeFantasyModal();
    };

    overlay.innerHTML = `
        <div class="fantasy-modal-content">
            <div class="fantasy-modal-header" style="background: #9a3412;">
                <h3>🏀 Basketball Player Options</h3>
                <button class="fantasy-modal-close" onclick="closeFantasyModal()">&times;</button>
            </div>
            <div class="fantasy-modal-body">
                <div class="player-action-profile">
                    <div class="player-action-avatar">
                        🏀
                    </div>
                    <div class="player-action-details">
                        <h4>${player.name}</h4>
                        <p>
                            <span>${player.club}</span> •
                            <strong class="badge-${player.position}">${player.position}</strong> •
                            <span>$${price}m</span>
                        </p>
                    </div>
                </div>

                <div class="fantasy-action-buttons">
                    <button class="btn-action btn-action-captain" onclick="setBasketCaptain(${player.id})">
                        <span>👑 ${isCap ? 'Currently Captain' : 'Make Captain (2x Points)'}</span>
                        <span>${isCap ? 'Active' : 'Select'} &rarr;</span>
                    </button>

                    <button class="btn-action btn-action-swap" onclick="openBasketSwapView(${player.id})">
                        <span>🔄 Swap / Substitute Player</span>
                        <span>Choose &rarr;</span>
                    </button>

                    <button class="btn-action btn-action-remove" onclick="confirmRemoveBasketPlayer(${player.id})">
                        <span>❌ Remove From Squad</span>
                        <span>Delete</span>
                    </button>
                </div>

                <div id="swapBasketCandidatesContainer" style="display: none; margin-top: 15px;">
                    <h5 style="margin: 0 0 8px 0; color: #475569; font-size: 13px;">Select replacement player:</h5>
                    <div id="swapBasketCandidatesList" class="swap-selection-list"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function setBasketCaptain(playerId) {
    basketCaptainId = playerId;
    saveFantasyBasketballState();
    displayBasketTeam();
    closeFantasyModal();
}

function confirmRemoveBasketPlayer(playerId) {
    removeBasketPlayer(playerId);
    closeFantasyModal();
}

function openBasketSwapView(playerId) {
    const player = selectedBasketPlayers.find(p => p.id === playerId);
    if (!player) return;

    const candidates = selectedBasketPlayers.filter(p => p.id !== player.id);
    const container = document.getElementById("swapBasketCandidatesContainer");
    const list = document.getElementById("swapBasketCandidatesList");

    if (!container || !list) return;

    if (candidates.length === 0) {
        list.innerHTML = `<p style="padding: 12px; font-size: 13px; color: #64748b; text-align: center; margin: 0;">No other players available in squad to swap.</p>`;
    } else {
        list.innerHTML = candidates.map(cand => `
            <div class="swap-item" onclick="executeBasketSwap(${player.id}, ${cand.id})">
                <div>
                    <strong style="color: #0f172a; font-size: 14px;">${cand.name}</strong>
                    <div style="font-size: 12px; color: #64748b;">${cand.club} • <span class="badge-${cand.position}">${cand.position}</span> • $${(parseFloat(cand.price) || 6.5).toFixed(1)}m</div>
                </div>
                <button style="background: #ea580c; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">Swap</button>
            </div>
        `).join("");
    }

    container.style.display = "block";
}

function executeBasketSwap(p1Id, p2Id) {
    const p1Idx = selectedBasketPlayers.findIndex(p => p.id === p1Id);
    const p2Idx = selectedBasketPlayers.findIndex(p => p.id === p2Id);

    if (p1Idx !== -1 && p2Idx !== -1) {
        const temp = selectedBasketPlayers[p1Idx];
        selectedBasketPlayers[p1Idx] = selectedBasketPlayers[p2Idx];
        selectedBasketPlayers[p2Idx] = temp;

        saveFantasyBasketballState();
        displayBasketTeam();
    }
    closeFantasyModal();
}

function autoPickBasketTeam() {
    const all = getAvailableBasketballPlayers().sort(() => 0.5 - Math.random());
    if (all.length < 8) {
        alert("Not enough basketball players available.");
        return;
    }

    selectedBasketPlayers = [];
    let curBudget = 100.0;
    const clubCounts = {};
    const neededPositions = ["PG", "SG", "SF", "PF", "C"];

    // 1 of each position first
    for (const pos of neededPositions) {
        const found = all.find(p => p.position === pos && !selectedBasketPlayers.some(sp => sp.id === p.id) && curBudget >= (parseFloat(p.price) || 6.5) && (clubCounts[p.club] || 0) < 3);
        if (found) {
            selectedBasketPlayers.push(found);
            clubCounts[found.club] = (clubCounts[found.club] || 0) + 1;
            curBudget -= (parseFloat(found.price) || 6.5);
        }
    }

    // Fill up to 8
    for (const p of all) {
        if (selectedBasketPlayers.length >= 8) break;
        if (!selectedBasketPlayers.some(sp => sp.id === p.id)) {
            const price = parseFloat(p.price) || 6.5;
            if (curBudget >= price && (clubCounts[p.club] || 0) < 3) {
                selectedBasketPlayers.push(p);
                clubCounts[p.club] = (clubCounts[p.club] || 0) + 1;
                curBudget -= price;
            }
        }
    }

    if (selectedBasketPlayers.length > 0) {
        basketCaptainId = selectedBasketPlayers[0].id;
    }
    recalculateBasketBudget();
    saveFantasyBasketballState();
    updateBasketBudget();
    displayBasketTeam();
    showBasketPlayers();
    alert("Auto-picked a balanced basketball roster for you!");
}

function resetBasketTeam() {
    if (confirm("Are you sure you want to reset your fantasy basketball team?")) {
        selectedBasketPlayers = [];
        basketCaptainId = null;
        fantasyBasketBudget = 100.0;
        saveFantasyBasketballState();
        updateBasketBudget();
        displayBasketTeam();
        showBasketPlayers();
    }
}

// Auto-run fantasy initialization on DOM load
document.addEventListener("DOMContentLoaded", function () {
    initFantasyState();
});

// =========================================
// SPORTS TABLES
// =========================================

const sportSelect = document.getElementById("sportSelect");
const leagueTableBody = document.getElementById("leagueTableBody");
const tableHead = document.getElementById("tableHead");
const tableSport = document.getElementById("tableSport");


// =========================================
// TABLE DATA
// =========================================

const sportsTables = {

    // =====================================
    // MALE FOOTBALL
    // =====================================

    maleFootball: {

        name: "MALE FOOTBALL",

        headings: [
            "POS", "CLUB", "P", "W", "D", "L",
            "GF", "GA", "GD", "PTS"
        ],

        teams: [

            ["Anchor", 0, 0, 0, 0, 0, 0],

            ["Dominion", 0, 0, 0, 0, 0, 0],

            ["Empowerment", 0, 0, 0, 0, 0, 0],

            ["Golden Stars", 0, 0, 0, 0, 0, 0],

            ["Milan", 0, 0, 0, 0, 0, 0],

            ["Phoenix", 0, 0, 0, 0, 0, 0],

            ["Saints", 0, 0, 0, 0, 0, 0],

            ["Spartans", 0, 0, 0, 0, 0, 0]

        ]
    },


    // =====================================
    // FEMALE FOOTBALL
    // =====================================

    femaleFootball: {

        name: "FEMALE FOOTBALL",

        headings: [
            "POS", "CLUB", "P", "W", "D", "L",
            "GF", "GA", "GD", "PTS"
        ],

        teams: [

            ["Golden Stars", 0, 0, 0, 0, 0, 0],

            ["Milan", 0, 0, 0, 0, 0, 0],

            ["Phoenix", 0, 0, 0, 0, 0, 0],

            ["Spartans", 0, 0, 0, 0, 0, 0]

        ]
    },


    // =====================================
    // MALE BASKETBALL
    // =====================================

    maleBasketball: {

        name: "MALE BASKETBALL",

        headings: [
            "POS", "CLUB", "GP", "W", "L",
            "PF", "PA", "DIFF", "PTS"
        ],

        teams: [

            ["Sharks", 0, 0, 0, 0, 0],

            ["Vinisio", 0, 0, 0, 0, 0],

            ["Warriors", 0, 0, 0, 0, 0],

            ["Wolves", 0, 0, 0, 0, 0]

        ]
    },


    // =====================================
    // FEMALE BASKETBALL
    // =====================================

    femaleBasketball: {

        name: "FEMALE BASKETBALL",

        headings: [
            "POS", "CLUB", "GP", "W", "L",
            "PF", "PA", "DIFF", "PTS"
        ],

        teams: [

            ["Sharks", 0, 0, 0, 0, 0],

            ["Vinisio", 0, 0, 0, 0, 0],

            ["Warriors", 0, 0, 0, 0, 0],

            ["Wolves", 0, 0, 0, 0, 0]

        ]
    },


    // =====================================
    // VOLLEYBALL
    // =====================================

    volleyball: {

        name: "VOLLEYBALL",

        headings: [
            "POS", "CLUB", "MP", "W", "L",
            "SW", "SL", "DIFF", "PTS"
        ],

        teams: [

            ["Pegasus", 0, 0, 0, 0, 0],

            ["Leo", 0, 0, 0, 0, 0],

            ["Trojans", 0, 0, 0, 0, 0],

            ["Orion", 0, 0, 0, 0, 0]

        ]
    }

};


// =========================================
// DISPLAY TABLE
// =========================================

function displaySportsTable(sport) {

    const table = sportsTables[sport];

    if (!table || !leagueTableBody || !tableHead) {
        return;
    }


    // Change sport name

    tableSport.textContent = table.name;


    // Create table headings

    tableHead.innerHTML = `
        <tr>
            ${table.headings
                .map(heading => `<th>${heading}</th>`)
                .join("")}
        </tr>
    `;


    // Clear old table rows

    leagueTableBody.innerHTML = "";


    // Add teams

    table.teams.forEach((team, index) => {

        const row = document.createElement("tr");


        // =================================
        // FOOTBALL
        // =================================

        if (
            sport === "maleFootball" ||
            sport === "femaleFootball"
        ) {

            const club = team[0];

            const played = team[1];

            const wins = team[2];

            const draws = team[3];

            const losses = team[4];

            const gf = team[5];

            const ga = team[6];


            const gd = gf - ga;

            const points = (wins * 3) + draws;


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>${club}</strong>
                </td>

                <td>${played}</td>

                <td>${wins}</td>

                <td>${draws}</td>

                <td>${losses}</td>

                <td>${gf}</td>

                <td>${ga}</td>

                <td>
                    ${gd > 0 ? "+" : ""}${gd}
                </td>

                <td>
                    <strong>${points}</strong>
                </td>

            `;

        }


        // =================================
        // BASKETBALL
        // =================================

        else if (
            sport === "maleBasketball" ||
            sport === "femaleBasketball"
        ) {

            const club = team[0];

            const games = team[1];

            const wins = team[2];

            const losses = team[3];

            const pointsFor = team[4];

            const pointsAgainst = team[5];


            const difference =
                pointsFor - pointsAgainst;


            const points = wins * 2;


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>${club}</strong>
                </td>

                <td>${games}</td>

                <td>${wins}</td>

                <td>${losses}</td>

                <td>${pointsFor}</td>

                <td>${pointsAgainst}</td>

                <td>
                    ${difference > 0 ? "+" : ""}${difference}
                </td>

                <td>
                    <strong>${points}</strong>
                </td>

            `;

        }


        // =================================
        // VOLLEYBALL
        // =================================

        else if (sport === "volleyball") {

            const club = team[0];

            const matches = team[1];

            const wins = team[2];

            const losses = team[3];

            const setsWon = team[4];

            const setsLost = team[5];


            const difference =
                setsWon - setsLost;


            const points = wins * 3;


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>${club}</strong>
                </td>

                <td>${matches}</td>

                <td>${wins}</td>

                <td>${losses}</td>

                <td>${setsWon}</td>

                <td>${setsLost}</td>

                <td>
                    ${difference > 0 ? "+" : ""}${difference}
                </td>

                <td>
                    <strong>${points}</strong>
                </td>

            `;

        }


        leagueTableBody.appendChild(row);

    });

}


// =========================================
// SPORT SWITCHING
// =========================================

if (sportSelect) {

    sportSelect.addEventListener("change", function () {

        displaySportsTable(this.value);

    });


    // Show Male Football first

    displaySportsTable("maleFootball");

}
// =========================================
// FIXTURES
// =========================================

const fixtureSportSelect =
    document.getElementById("fixtureSportSelect");

const fixturesList =
    document.getElementById("fixturesList");

const fixtureSport =
    document.getElementById("fixtureSport");


// =========================================
// FIXTURE DATA
// =========================================

const sportsFixtures = {

    // =====================================
    // MALE FOOTBALL
    // =====================================

    maleFootball: {

        name: "MALE FOOTBALL",

        fixtures: [

            ["Anchor", "Dominion"],
            ["Empowerment", "Golden Stars"],
            ["Milan", "Phoenix"],
            ["Saints", "Spartans"]

        ]
    },


    // =====================================
    // FEMALE FOOTBALL
    // =====================================

    femaleFootball: {

        name: "FEMALE FOOTBALL",

        fixtures: [

            ["Golden Stars", "Milan"],
            ["Phoenix", "Spartans"]

        ]
    },


    // =====================================
    // MALE BASKETBALL
    // =====================================

    maleBasketball: {

        name: "MALE BASKETBALL",

        fixtures: [

            ["Sharks", "Vinisio"],
            ["Warriors", "Wolves"]

        ]
    },


    // =====================================
    // FEMALE BASKETBALL
    // =====================================

    femaleBasketball: {

        name: "FEMALE BASKETBALL",

        fixtures: [

            ["Sharks", "Vinisio"],
            ["Warriors", "Wolves"]

        ]
    },


    // =====================================
    // VOLLEYBALL
    // =====================================

    volleyball: {

        name: "VOLLEYBALL",

        fixtures: []

    }

};


// =========================================
// DISPLAY FIXTURES
// =========================================

function displayFixtures(sport) {

    const sportData = sportsFixtures[sport];

    if (!sportData || !fixturesList) {
        return;
    }


    // Change sport title

    if (fixtureSport) {
        fixtureSport.textContent =
            sportData.name;
    }


    // Clear old fixtures

    fixturesList.innerHTML = "";


    // No fixtures

    if (sportData.fixtures.length === 0) {

        fixturesList.innerHTML = `

            <div style="
                text-align: center;
                padding: 40px 20px;
                color: #777;
            ">

                <h3>No fixtures available</h3>

                <p>
                    Fixtures for this sport
                    will be added soon.
                </p>

            </div>

        `;

        return;
    }


    // Create fixture cards

    sportData.fixtures.forEach(
        (fixture, index) => {

            const homeTeam = fixture[0];

            const awayTeam = fixture[1];


            const fixtureCard =
                document.createElement("div");


            fixtureCard.classList.add(
                "fixture-card"
            );


            fixtureCard.innerHTML = `

                <div class="fixture-home">

                    ${homeTeam}

                </div>


                <div class="fixture-center">

                    <div class="fixture-date">

                        Game Week ${index + 1}

                    </div>


                    <div class="fixture-time">

                        TBA

                    </div>


                    <span class="fixture-status">

                        UPCOMING

                    </span>

                </div>


                <div class="fixture-away">

                    ${awayTeam}

                </div>

            `;


            fixturesList.appendChild(
                fixtureCard
            );

        }
    );

}


// =========================================
// SPORT SWITCHING
// =========================================

if (fixtureSportSelect) {

    fixtureSportSelect.addEventListener(
        "change",
        function () {

            displayFixtures(this.value);

        }
    );


    // Show Male Football first

    displayFixtures("maleFootball");

}
// =========================================
// RESULTS
// =========================================

const resultSportSelect =
    document.getElementById("resultSportSelect");

const resultsList =
    document.getElementById("resultsList");

const resultSport =
    document.getElementById("resultSport");


// =========================================
// RESULTS DATA
// =========================================

const sportsResults = {

    maleFootball: {
        name: "MALE FOOTBALL",
        results: []
    },

    femaleFootball: {
        name: "FEMALE FOOTBALL",
        results: []
    },

    maleBasketball: {
        name: "MALE BASKETBALL",
        results: []
    },

    femaleBasketball: {
        name: "FEMALE BASKETBALL",
        results: []
    },

    volleyball: {
        name: "VOLLEYBALL",
        results: []
    }

};


// =========================================
// DISPLAY RESULTS
// =========================================

function displayResults(sport) {

    const sportData = sportsResults[sport];

    if (!sportData || !resultsList) {
        return;
    }


    // Change sport title

    if (resultSport) {
        resultSport.textContent =
            sportData.name;
    }


    // Clear old results

    resultsList.innerHTML = "";


    // No results yet

    if (sportData.results.length === 0) {

        resultsList.innerHTML = `

            <div class="no-results">

                <h3>
                    No Results Available
                </h3>

                <p>
                    Completed matches will appear here.
                </p>

            </div>

        `;

        return;
    }


    // Display completed results

    sportData.results.forEach(
        (result, index) => {

            const homeTeam = result.home;

            const awayTeam = result.away;

            const homeScore = result.homeScore;

            const awayScore = result.awayScore;


            const resultCard =
                document.createElement("div");


            resultCard.classList.add(
                "result-card"
            );


            resultCard.innerHTML = `

                <div class="result-home">

                    ${homeTeam}

                </div>


                <div class="result-center">

                    <div class="result-date">

                        Game Week ${index + 1}

                    </div>


                    <div class="result-score">

                        ${homeScore} - ${awayScore}

                    </div>


                    <span class="result-status">

                        FULL TIME

                    </span>

                </div>


                <div class="result-away">

                    ${awayTeam}

                </div>

            `;


            resultsList.appendChild(
                resultCard
            );

        }
    );

}


// =========================================
// SPORT SWITCHING
// =========================================

if (resultSportSelect) {

    resultSportSelect.addEventListener(
        "change",
        function () {

            displayResults(this.value);

        }
    );


    // Show Male Football first

    displayResults("maleFootball");

}
// =========================================
// LIVE MATCHES
// =========================================

const liveSportSelect =
    document.getElementById("liveSportSelect");

const liveMatchesList =
    document.getElementById("liveMatchesList");

const liveSport =
    document.getElementById("liveSport");


const liveMatches = {

    maleFootball: {
        name: "MALE FOOTBALL",
        matches: []
    },

    femaleFootball: {
        name: "FEMALE FOOTBALL",
        matches: []
    },

    maleBasketball: {
        name: "MALE BASKETBALL",
        matches: []
    },

    femaleBasketball: {
        name: "FEMALE BASKETBALL",
        matches: []
    },

    volleyball: {
        name: "VOLLEYBALL",
        matches: []
    }

};


function displayLiveMatches(sport) {

    const sportData = liveMatches[sport];

    if (!sportData || !liveMatchesList) {
        return;
    }


    // Change sport heading
    if (liveSport) {
        liveSport.textContent = sportData.name;
    }


    // Clear previous matches
    liveMatchesList.innerHTML = "";


    // No live matches
    if (sportData.matches.length === 0) {

        liveMatchesList.innerHTML = `
            <div class="no-live-matches">

                <h3>
                    No Live Matches
                </h3>

                <p>
                    There are currently no matches
                    being played.
                </p>

            </div>
        `;

        return;
    }


    // Display live matches
    sportData.matches.forEach(match => {

        const matchCard =
            document.createElement("div");

        matchCard.classList.add("live-match");


        matchCard.innerHTML = `

            <div class="live-home">
                ${match.home}
            </div>


            <div class="live-score">

                <strong>
                    ${match.homeScore}
                    -
                    ${match.awayScore}
                </strong>

                <span class="live-time">
                    ${match.time}
                </span>

            </div>


            <div class="live-away">
                ${match.away}
            </div>

        `;


        liveMatchesList.appendChild(matchCard);

    });

}


// Sport selector
if (liveSportSelect) {

    liveSportSelect.addEventListener(
        "change",
        function () {

            displayLiveMatches(
                this.value
            );

        }
    );


    // Load male football first
    displayLiveMatches("maleFootball");
}
// =========================================
// NEWS
// =========================================

const newsList =
    document.getElementById("newsList");


const sportsNews = [

    {
        title: "School Sports Hub Is Coming Soon",

        category: "ANNOUNCEMENT",

        description:
            "Stay tuned for the latest updates, fixtures and activities from the school league.",

        date: "2026 Season",

        image: "#"
    },

    {
        title: "Football League Updates",

        category: "FOOTBALL",

        description:
            "Follow the latest developments from the male and female football competitions.",

        date: "2026 Season",

        image: "#"
    },

    {
        title: "Basketball Competition",

        category: "BASKETBALL",

        description:
            "Get updates about the male and female basketball competitions.",

        date: "2026 Season",

        image: "#"
    }

];


function displayNews() {

    if (!newsList) {
        return;
    }


    newsList.innerHTML = "";


    if (sportsNews.length === 0) {

        newsList.innerHTML = `
            <div class="no-news">

                <h3>
                    No News Available
                </h3>

                <p>
                    News updates will appear here.
                </p>

            </div>
        `;

        return;
    }


    sportsNews.forEach(news => {

        const newsCard =
            document.createElement("article");

        newsCard.classList.add("news-card");


        newsCard.innerHTML = `

            <div class="news-image">

                <img
                    src="${news.image}"
                    alt="${news.title}"
                >

            </div>


            <div class="news-content">

                <span class="news-category">
                    ${news.category}
                </span>

                <h3>
                    ${news.title}
                </h3>

                <p>
                    ${news.description}
                </p>

                <span class="news-date">
                    ${news.date}
                </span>

            </div>

        `;


        newsList.appendChild(newsCard);

    });

}


displayNews();
// =========================================
// LOGIN ACCOUNT TYPE
// =========================================

const accountTypeButtons =
    document.querySelectorAll(".account-type");

const accountType =
    document.getElementById("accountType");

const selectedAccount =
    document.getElementById("selectedAccount");


accountTypeButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Remove active state
        accountTypeButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Activate selected button
        this.classList.add("active");


        // Get account type
        const type = this.dataset.type;


        accountType.value = type;


        selectedAccount.textContent =
            "Logging in as " +
            type.charAt(0).toUpperCase() +
            type.slice(1);

    });

});
