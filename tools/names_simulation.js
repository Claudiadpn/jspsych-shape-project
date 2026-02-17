// ============================================
// Simulation des autres participants
// ============================================
// Ce fichier gère l'affichage simulé des réponses
// d'autres participants pendant l'expérience.

/**
 * Crée un bloc visuel affichant les noms des "autres participants"
 * et leurs scores (affichés progressivement)
 * @param {Array} names - Liste des noms à afficher
 */
export const createOtherUsersBloc = (names) => {
    // Création du conteneur principal
    const box = document.createElement("div");
    box.id = "rating_box";

    // Création de la ligne affichant la moyenne
    const averageDiv = document.createElement("div");
    averageDiv.id = "average_display";
    averageDiv.innerText = "Moyenne : -";

    box.appendChild(averageDiv);

    // Pour chaque nom, création d'une ligne
    names.forEach(name => {
        const line = document.createElement("div");

        // Span pour le nom
        const nameSpan = document.createElement("span");
        nameSpan.innerText = name;

        // Span pour le score (vide au départ, sera rempli dynamiquement)
        const scoreSpan = document.createElement("span");
        scoreSpan.id = "score_" + name; // ID unique pour chaque score

        line.appendChild(nameSpan);
        line.appendChild(scoreSpan);
        box.appendChild(line);
    });

    // Ajout du bloc au DOM
    document.body.appendChild(box);
}

/**
 * Supprime le bloc des autres participants du DOM
 */
export const closeOtherUsersBloc = () => {
    const box = document.getElementById("rating_box");
    if(box) box.remove();
}

/**
 * Retourne la liste des noms utilisés pour la simulation
 * @returns {Array} Liste de prénoms français courants
 */
export const loadNames = () => {
    return [
        // Accents présents (18)
        "Léna",
        "Chloé",
        "Anaïs",
        "Émilie",
        "Inès",
        "Théo",
        "Noémie",
        "Maëva",
        "Loïc",
        "Gaëtan",
        "Céline",
        "Élise",
        "Mélanie",
        "Hélène",
        "Jérôme",
        "Aurélie",
        "Léonie",
        "Clément",
        // Sans accents (12)
        "Lena",
        "Chloe",
        "Anais",
        "Emilie",
        "Ines",
        "Theo",
        "Noemie",
        "Maeva",
        "Loic",
        "Gaetan",
        "Helene",
        "Aurelie",
        // Prénoms simples (8)
        "Marie",
        "Camille",
        "Sarah",
        "Sophie",
        "Lucas",
        "Hugo",
        "Arthur",
        "Julien",
        // Numériques / stylisés réalistes (4)
        "Lena_98",
        "Theo_2001",
        "Lucas_31",
        "Ines_03",
    ];
};

export const loadSpecificsNames = () => {
    return [
        "lUcAs",       // casse mixte
        "marie75",    // minuscule + chiffres
        "Chloee",      // double lettre
        "Theo-B",      // tiret + initiale
        "SarahK",      // initiale collée
        "Nico",       // underscore final
        "Hugoo",       // double voyelle
        "Lenna"        // double lettre
    ];
};