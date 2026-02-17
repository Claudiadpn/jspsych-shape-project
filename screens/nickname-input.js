// ============================================
// Écran de saisie du prénom/pseudo
// ============================================
// Demande un prénom ou pseudo à TOUS les participants
// En mode "group", ce pseudo sera affiché aux autres (simulés)
// En mode "solo", il sert simplement d'identifiant temporaire
// IMPORTANT : Le pseudo n'est jamais sauvegardé dans les données

import { jsPsych } from '../jsPsych-instance.js';
import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

export const nicknameInput = {
    type: jsPsychSurveyText,

    // Texte introductif
    preamble: `
        <div class="nickname-container">
            <h2 class="nickname-title">
                Choisissez un pseudo d'étude
            </h2>
            <p class="nickname-note">
                <em>N'indiquez pas votre vrai prénom. Ce pseudo sert uniquement à l'affichage pendant la tâche. Celui-ci ne sera pas conservé, ni lié à vos réponses.</em>
            </p>
        </div>
    `,

    // Question du prénom/pseudo
    questions: [
        {
            prompt: 'Votre prénom ou pseudo :',
            name: 'nickname',
            placeholder: '',
            required: true,
            columns: 30
        }
    ],

    button_label: 'Continuer',

    data: {
        screen: 'nickname_input'
    },

    on_load: function() {
        addQuitButton();
    },

    on_finish: function(data) {
        // Supprimer le pseudo des données CSV (confidentialité)
        delete data.response;
        // Supprimer les champs HTML volumineux
        delete data.preamble;
        delete data.internal_node_id;
        removeQuitButton();
    }
};
