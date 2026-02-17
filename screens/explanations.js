// ============================================
// Écran 3 : Explications
// ============================================
// Affiche les explications de l'expérience depuis un fichier HTML externe

import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

export const explanations = {
    type: jsPsychExternalHtml,
    url: "./experiment_html/explanations.html",
    cont_btn: "start", // ID du bouton pour continuer
    data: {
        screen: 'instructions'
    },
    on_load: function() {
        addQuitButton();
    },
    on_finish: function(data) {
        // Supprimer tous les champs HTML volumineux qui cassent le CSV
        delete data.view_history;
        delete data.stimulus;
        delete data.internal_node_id;
        removeQuitButton();
    }
};
