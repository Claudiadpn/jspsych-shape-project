// ============================================
// Écran 1 : Information et consentement
// ============================================
// Affiche un formulaire HTML externe avec les informations
// sur l'étude et le formulaire de consentement.

import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

export const consentementInfo = {
    type: jsPsychExternalHtml,
    url: "./experiment_html/consentementInfo.html",
    cont_btn: "start", // ID du bouton pour continuer
    data: {
        screen: 'consent'
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
