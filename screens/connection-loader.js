// ============================================
// Écran de connexion (loader)
// ============================================
// Affiche un loader pendant 3 secondes entre la sélection
// de groupe et les questions, pour éviter que les notes
// commencent à s'afficher trop tôt

import { jsPsych } from '../jsPsych-instance.js';

export const connectionLoader = {
    type: jsPsychHtmlKeyboardResponse,

    // Ne pas enregistrer ce trial dans les données
    record_data: false,

    // Contenu du loader (styles dans styles.css)
    stimulus: function() {
        const condition = jsPsych.data.get().values()[0]?.condition;

        if (condition === "group") {
            return `
                    <div class="connection-loader-overlay">
                        <div class="connection-loader-content">
                            <div class="spinner"></div>
                            <h3>Groupe</h3>
                            <p>En attente que chacun soit prêt à débuter...</p>
                        </div>
                    </div>
                `;
        } else {
            return `
                    <div class="connection-loader-overlay">
                        <div class="connection-loader-content">
                            <div class="spinner"></div>
                            <h3>Connexion en cours...</h3>
                            <p>Préparation du questionnaire</p>
                        </div>
                    </div>
                `;
        }
    },
    // Désactiver toutes les touches
    choices: "NO_KEYS",

    // Durée de 3 secondes
    trial_duration: 3000
};
