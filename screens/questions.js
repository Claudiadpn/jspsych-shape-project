// ============================================
// ÉCRANS DE QUESTIONS LIKERT PRINCIPALES
// ============================================
// Génère dynamiquement tous les écrans de questions avec échelle de Likert (1-7)
//
// Fonctionnalités :
// - Mélange aléatoire des questions pour éviter les biais d'ordre
// - Mode SOLO : réponse individuelle sans influence sociale
// - Mode GROUP : simulation de réponses d'autres participants en temps réel
// - Timeout à 40 secondes avec réponse forcée à 4 si pas de réponse
// - Calcul automatique de la conformité en mode group
// - Sauvegarde de tous les timings et métadonnées

import { jsPsych } from '../jsPsych-instance.js';
import { createOtherUsersBloc, closeOtherUsersBloc } from '../tools/names_simulation.js';
import { addQuitButton, removeQuitButton } from '../tools/quit_button.js';

// ============================================
// ÉCHELLE DE LIKERT (1-7)
// ============================================
// Utilisée pour toutes les questions principales de l'étude
const likertScale = [
    "<b>1</b> <br> Pas du tout d'accord",
    "<b>2</b> <br> Pas d'accord",
    "<b>3</b> <br> Plutôt pas d'accord",
    "<b>4</b> <br> Indifférent",
    "<b>5</b> <br> Plutôt d'accord",
    "<b>6</b> <br> D'accord",
    "<b>7</b> <br> Tout à fait d'accord",
];

/**
 * Génère tous les trials de questions Likert avec simulation conditionnelle
 *
 * Cette fonction est le cœur de la partie expérimentale. Elle crée un trial
 * jsPsych pour chaque question, avec comportement différent selon la condition :
 * - Mode SOLO : affichage simple de la question
 * - Mode GROUP : affichage + simulation progressive de réponses d'autres participants
 *
 * @param {Array} questions - Liste des objets questions {code, prompt} depuis question_list.js
 * @param {Array} selectedNames - Liste des 5 noms simulés pour le mode group
 * @returns {Array} Tableau de trials jsPsych prêts à être ajoutés à la timeline
 */
export function createQuestionTrials(questions, selectedNames) {
    // Randomisation de l'ordre des questions pour éviter les effets d'ordre
    const shuffledQuestions = jsPsych.randomization.shuffle(questions);

    const trials = [];

    // Création d'un trial pour chaque question
    shuffledQuestions.forEach(function(item) {

        // ============================================
        // ÉTAT LOCAL DE LA QUESTION
        // ============================================
        // Cet objet track l'affichage progressif des scores en mode group
        let ratingState = {
            totalScore: 0,          // Somme cumulée des scores affichés
            numberOfScores: 0,      // Compteur de scores déjà affichés
            currentAverage: null,   // Moyenne actuelle (affichée en temps réel)
            warningTimer: null,     // Timer pour l'avertissement à 30s
            forceSubmitTimer: null, // Timer pour forcer la soumission à 40s
            timeoutTriggered: false // Flag : true si timeout déclenché
        };

        const questionTrial = {
            type: jsPsychSurveyLikert,

            questions: [
                {
                    prompt: item.prompt,
                    name: "rating", // Nom pour identifier la réponse
                    labels: likertScale,
                    required: true
                }
            ],
            button_label: 'Valider',

            // Données à sauvegarder pour cette question
            data: {
                question_code: item.code,
                question_text: item.prompt
            },

            // ============================================
            // ON_LOAD : Initialisation de la question
            // ============================================
            // Appelée quand l'écran de la question s'affiche
            on_load: function() {
                // Ajout du bouton "Quitter" en haut à droite
                addQuitButton();

                // Récupération de la condition expérimentale depuis les données globales
                const allData = jsPsych.data.get().values();
                const condition = allData.length > 0 ? allData[0].condition : null;

                // Réinitialisation de l'état pour cette nouvelle question
                ratingState.totalScore = 0;
                ratingState.numberOfScores = 0;

                // ============================================
                // MODE GROUP : SIMULATION DES AUTRES PARTICIPANTS
                // ============================================
                // Ne s'exécute que si la condition est "group"
                if (condition === "group") {
                    // Création du bloc visuel en bas à gauche avec les 5 noms
                    createOtherUsersBloc(selectedNames);

                // Délai de 1,5s avant de commencer l'affichage des scores
                // (pour simuler un temps de "réflexion" des autres)
                setTimeout(() => {
                    const totalWindow = 12000; // Fenêtre de 12 secondes pour tous les scores

                    // Pour chaque "participant simulé"
                    selectedNames.forEach(name => {
                        // Génération d'un délai aléatoire entre 0 et 12 secondes
                        // Simule des temps de réponse variables entre participants
                        const randomDelay = Math.random() * totalWindow;

                        setTimeout(() => {
                            // ============================================
                            // GÉNÉRATION DU SCORE SIMULÉ
                            // ============================================
                            // Le score dépend du type de question pour simuler
                            // des patterns de réponses cohérents
                            let score;
                            if (item.code === "general") {
                                // Questions générales : tendance à être d'accord (5-7)
                                score = Math.floor(Math.random() * 3) + 5;
                            } else if (item.code === "science") {
                                // Questions scientifiques : fort accord (6-7)
                                score = Math.random() < 0.5 ? 6 : 7;
                            } else if (item.code === "ambigue") {
                                // Questions ambiguës : réponses neutres (3-5)
                                score = Math.floor(Math.random() * 3) + 3;
                            } else {
                                // Par défaut : distribution uniforme (1-7)
                                score = Math.floor(Math.random() * 7) + 1;
                            }

                            // Affichage du score à côté du nom dans le DOM
                            const span = document.getElementById("score_" + name);
                            if (span) {
                                span.innerText = score;
                            }

                            // Mise à jour de la moyenne en temps réel
                            ratingState.totalScore += score;
                            ratingState.numberOfScores++;
                            const avg = (ratingState.totalScore / ratingState.numberOfScores).toFixed(2);

                            // Affichage de la moyenne mise à jour
                            const averageDiv = document.getElementById("average_display");
                            if (averageDiv) {
                                averageDiv.innerText = "Moyenne : " + avg;
                            }
                            ratingState.currentAverage = avg;
                        }, randomDelay);
                    });
                }, 1500); // Fin du setTimeout initial
                } // Fin du if (condition === "group")

                // ============================================
                // TIMER D'AVERTISSEMENT (30 secondes)
                // ============================================
                // Avertit le participant qu'il doit répondre bientôt
                ratingState.warningTimer = setTimeout(() => {
                    // Création de l'élément d'avertissement visuel
                    const warning = document.createElement('div');
                    warning.id = 'timeout_warning';
                    warning.innerHTML = `
                        ⚠️ Si vous ne répondez pas, la note <strong>4</strong> sera prise en compte dans 10 secondes
                    `;

                    // Insertion dans le DOM (styles définis dans styles.css)
                    document.body.appendChild(warning);

                    // Marquer que le processus de timeout a commencé
                    ratingState.timeoutTriggered = true;
                }, 30000); // Déclenchement après 30 secondes

                // ============================================
                // TIMER DE SOUMISSION FORCÉE (40 secondes)
                // ============================================
                // Force une réponse neutre (4) si le participant n'a pas répondu
                ratingState.forceSubmitTimer = setTimeout(() => {
                    // Sélection de tous les boutons radio de l'échelle Likert
                    const radioButtons = document.querySelectorAll('.jspsych-survey-likert-opts input');

                    if (radioButtons.length >= 4) {
                        // Sélection du 4ème bouton (index 3 car 0-indexed) = note 4
                        const radio4 = radioButtons[3];

                        // Cocher programmatiquement le bouton
                        radio4.checked = true;

                        // Déclencher les événements pour que jsPsych détecte le changement
                        radio4.dispatchEvent(new Event('change', { bubbles: true }));
                        radio4.dispatchEvent(new Event('click', { bubbles: true }));
                    }

                    // Marquer qu'une réponse forcée a été appliquée
                    ratingState.timeoutTriggered = true;

                    // Court délai pour permettre la mise à jour de l'interface
                    setTimeout(() => {
                        // Soumission automatique du formulaire
                        const submitButton = document.querySelector('#jspsych-survey-likert-next');
                        if (submitButton) {
                            submitButton.click();
                        }
                    }, 100); // 100ms pour garantir la cohérence du DOM
                }, 40000); // Déclenchement après 40 secondes
            },

            // Fonction appelée quand le participant répond
            on_finish: async function(data) {
                // Supprimer le bouton "Quitter"
                removeQuitButton();

                // 🧹 Nettoyage : annuler les timers
                if (ratingState.warningTimer) {
                    clearTimeout(ratingState.warningTimer);
                }
                if (ratingState.forceSubmitTimer) {
                    clearTimeout(ratingState.forceSubmitTimer);
                }

                // 🧹 Supprimer le message d'avertissement s'il existe
                const warning = document.getElementById('timeout_warning');
                if (warning) {
                    warning.remove();
                }

                // 📅 Ajout du timestamp de la réponse
                data.response_timestamp = new Date().toISOString();

                // 🔹 Extraction de la réponse du participant (échelle 1-7)
                data.participant_response = data.response.rating;

                // 🔹 Vérifier si la réponse a été forcée par timeout
                if (ratingState.timeoutTriggered) {
                    // Timeout : la note 4 a été sélectionnée automatiquement
                    data.forced_by_timeout = true;
                    data.response_type = "forced_default";
                } else {
                    // Le participant a répondu volontairement
                    data.forced_by_timeout = false;
                    data.response_type = "voluntary";
                }

                // 🔍 Récupérer la condition expérimentale
                const allData = jsPsych.data.get().values();
                const condition = allData.length > 0 ? allData[0].condition : null;

                // ⚠️ Ne sauvegarder et afficher le loader que si condition === "group"
                if (condition === "group") {
                    // Sauvegarde du nombre de réponses simulées affichées
                    data.number_of_ratings = ratingState.numberOfScores || 0;

                    // Sauvegarde de la moyenne finale des autres participants simulés
                    if (ratingState.numberOfScores > 0) {
                        data.final_average = parseFloat(ratingState.currentAverage);

                        // Calcul de la conformité
                        // Conforme si : (réponse >= 5 ET moyenne >= 5) OU (réponse < 5 ET moyenne < 5)
                        const participantAgrees = data.participant_response >= 5;
                        const groupAgrees = data.final_average >= 5;
                        data.conformity = (participantAgrees === groupAgrees) ? 'conforme' : 'non_conforme';
                    } else {
                        data.final_average = null;
                        data.conformity = null;
                    }

                    // ⏳ Si toutes les notes ne sont pas affichées, afficher un loader
                    const totalNames = selectedNames.length;
                    const missingRatings = totalNames - ratingState.numberOfScores;

                    if (missingRatings > 0) {
                        // Création du loader (styles dans styles.css)
                        const loader = document.createElement('div');
                        loader.id = 'waiting_loader';
                        loader.innerHTML = `
                            <div class="waiting-loader-box">
                                <div class="waiting-loader-spinner"></div>
                                <h3>En attente des autres participants...</h3>
                                <p>${missingRatings} personne${missingRatings > 1 ? 's' : ''} n'${missingRatings > 1 ? 'ont' : 'a'} pas encore répondu</p>
                            </div>
                        `;

                        // Ajout du loader au DOM
                        document.body.appendChild(loader);

                        // Attente de 1 seconde par note manquante
                        const waitTime = missingRatings * 1000;
                        await new Promise(resolve => setTimeout(resolve, waitTime));

                        // Suppression du loader
                        loader.remove();
                    }

                    // Suppression du bloc des autres participants
                    closeOtherUsersBloc();
                } // Fin du if (condition === "group")

                // 🧹 Nettoyage des champs HTML volumineux pour le CSV
                delete data.stimulus;
                delete data.internal_node_id;
            }
        };

        trials.push(questionTrial);
    });

    return trials;
}
