// ============================================
// Écran 4 : Sélection de groupe
// ============================================
// Affiche différemment selon la condition :
// - "group" : attente de formation du groupe avec affichage des 5 participants
// - "solo" : simple écran de démarrage

import { jsPsych } from '../jsPsych-instance.js';
import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

/**
 * Crée l'écran de sélection de groupe
 * @param {Array} selectedNames - Liste des 5 noms sélectionnés pour la simulation
 * @returns {Object} Trial jsPsych
 */
export function createGroupSelectionScreen(selectedNames) {
    return {
        type: jsPsychHtmlButtonResponse,
        choices: ['Je suis prêt à démarrer'],
        button_html: (choice) => `<button class="jspsych-btn ready-button" disabled id="ready-button">${choice}</button>`,
        data: {
            screen: 'group_formation'
        },

        // Contenu affiché selon la condition
        stimulus: function() {
            const condition = jsPsych.data.get().values()[0]?.condition;

            if (condition === "group") {
                return `
                    <div class="group-selection-container">
                        <h2 class="group-selection-title">
                            Formation de votre groupe
                        </h2>
                        <p class="group-selection-text">
                            Nous constituons un groupe de <strong>5 autres participants</strong>
                            prêts à démarrer l'étude avec vous...
                        </p>
                        <div id="names-list">
                            <p>En attente des participants...</p>
                        </div>
                    </div>
                `;
            } else {
                // Condition solo
                return `
                    <div class="group-selection-container">
                        <h2 class="group-selection-title">
                            Prêt à commencer ?
                        </h2>
                        <p class="group-selection-text">
                            Cliquez sur le bouton ci-dessous quand vous êtes prêt à démarrer l'étude.
                        </p>
                    </div>
                `;
            }
        },


        // Affichage progressif des noms
        on_load: function() {
            // Ajouter le bouton "Quitter"
            addQuitButton();

            const condition = jsPsych.data.get().values()[0]?.condition;

            if (condition === "group") {
                const namesList = document.getElementById('names-list');
                const button = document.getElementById('ready-button');

                // Vider le message d'attente
                namesList.innerHTML = '';

                // Afficher les noms un par un toutes les secondes
                selectedNames.forEach((name, index) => {
                    setTimeout(() => {
                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'participant-name';
                        nameDiv.innerHTML = `✓ ${name} <span class="status">(prêt)</span>`;
                        namesList.appendChild(nameDiv);

                        // Activer le bouton quand tous les noms sont affichés
                        if (index === selectedNames.length - 1) {
                            setTimeout(() => {
                                button.disabled = false;
                            }, 300);
                        }
                    }, (index + 1) * 1000); // 1 seconde entre chaque nom
                });
            } else {
                // Condition solo : activer le bouton immédiatement
                const button = document.getElementById('ready-button');
                button.disabled = false;
            }
        },

        on_finish: function(data) {
            // Supprimer tous les champs HTML volumineux qui cassent le CSV
            delete data.stimulus;
            delete data.button_html;
            delete data.internal_node_id;
            removeQuitButton();
        }

    };
}
