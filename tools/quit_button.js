// ============================================
// BOUTON QUITTER
// ============================================
// Gère l'ajout et la suppression du bouton "Quitter"
// en haut à droite de chaque page

/**
 * URL de redirection pour le bouton "Quitter"
 * Modifiez cette valeur pour changer la destination
 */
const QUIT_REDIRECT_URL = 'https://psychofact.fr/';

/**
 * Ajoute le bouton "Quitter" en haut à droite de la page
 */
export function addQuitButton() {
    // Vérifier si le bouton n'existe pas déjà
    if (document.getElementById('quit-button-container')) {
        return;
    }

    // Créer le conteneur
    const container = document.createElement('div');
    container.id = 'quit-button-container';
    container.className = 'quit-button-container';

    // Créer le bouton
    const button = document.createElement('button');
    button.className = 'quit-button';
    button.textContent = 'Quitter';
    button.onclick = function() {
        if (confirm('Êtes-vous sûr de vouloir quitter l\'expérience ?')) {
            window.location.href = QUIT_REDIRECT_URL;
        }
    };

    container.appendChild(button);
    document.body.appendChild(container);
}

/**
 * Supprime le bouton "Quitter" de la page
 */
export function removeQuitButton() {
    const container = document.getElementById('quit-button-container');
    if (container) {
        container.remove();
    }
}

/**
 * Nettoie TOUT le contenu pour éviter les superpositions
 */
export function cleanupPage() {
    // Supprimer le bouton quitter
    removeQuitButton();

    // Supprimer tous les conteneurs qui pourraient persister
    const containers = document.querySelectorAll('.quit-button-container, #quit-button-container');
    containers.forEach(c => c.remove());

    // Supprimer tous les formulaires de survey qui pourraient persister
    const surveys = document.querySelectorAll('form[id^="jspsych-survey"]');
    surveys.forEach(s => s.remove());

    // Supprimer tous les contenus de likert qui pourraient persister
    const likertForms = document.querySelectorAll('.jspsych-survey-likert-statement, .jspsych-survey-likert-opts');
    likertForms.forEach(f => {
        const parent = f.parentElement;
        if (parent) {
            parent.remove();
        }
    });

    // Forcer le scroll en haut
    window.scrollTo(0, 0);
}
