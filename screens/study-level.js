// ============================================
// Écran 2 : Question sur le niveau d'études
// ============================================
// Vérifie l'éligibilité du participant :
// 1. Doit être en licence (L1, L2 ou L3)
// 2. Ne doit pas avoir déjà participé (vérification IP)
// 3. Attribution aléatoire à une condition (group/solo)

import { jsPsych } from '../jsPsych-instance.js';
import { studyLevelQuestion, notEligibleText, alreadyParticipatedText } from '../tools/stimuli.js';
import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

export const studyLevelScreen = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: studyLevelQuestion,
            name: "study_level",
            options: ["Non", "L1", "L2", "L3"],
            required: true
        }
    ],
    button_label: "Envoyer ma réponse",
    post_trial_gap: 100,
    data: {
        screen: 'study_level'
    },
    on_load: function() {
        addQuitButton();
    },
    on_finish: async function (data) {
        // Supprimer les champs HTML volumineux
        delete data.internal_node_id;

        removeQuitButton();
        const response = data.response.study_level;

        // Si le participant n'est pas en licence → fin de l'expérience
        if (response === "Non") {
            jsPsych.endExperiment(notEligibleText);
            return;
        }

        // Vérification que le participant n'a pas déjà fait l'expérience
        const res = await fetch("php/check_ip.php");
        console.log(res);
        const ipCheck = await res.json();

        if (!ipCheck.eligible) {
            jsPsych.endExperiment(alreadyParticipatedText);
            return;
        }

        const participantIP = ipCheck.ip;
        jsPsych.data.addProperties({
            participant_ip: participantIP,
        });

        // Attribution CONTRÔLÉE à une condition expérimentale
        // Lire la distribution actuelle pour équilibrer group/solo
        let condition = "solo"; // Par défaut

        try {
            const distRes = await fetch(`php/read_distribution.php?study_level=${response}`);
            const distData = await distRes.json();

            if (distData.success && distData.suggested_condition) {
                condition = distData.suggested_condition;
                console.log(`Distribution contrôlée: ${response} => ${condition}`);
                console.log(`Répartition actuelle ${response}:`, distData.current_counts);
            } else {
                // Fallback sur randomisation simple si erreur
                condition = Math.random() < 0.5 ? "group" : "solo";
                console.log(`Fallback randomisation: ${condition}`);
            }
        } catch (error) {
            console.error('Erreur lors de la lecture de la distribution:', error);
            // Fallback sur randomisation simple
            condition = Math.random() < 0.5 ? "group" : "solo";
        }

        // Stockage du niveau d'études et de la condition dans les données
        jsPsych.data.addProperties({
            study_level: response,
            condition: condition
        });
    }
};
