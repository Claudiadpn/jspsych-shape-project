// ============================================
// QUESTIONNAIRE FINAL POST-EXPÉRIENCE
// ============================================
// Ce fichier gère toutes les pages affichées APRÈS les questions Likert principales
//
// Structure complète :
// - Page démographique (âge, genre)
// - Questions sur la formation scientifique (Q1-7, dont check d'attention)
// - Questions sur la conformité sociale (Q8-11)
// - Questions perception groupe (Q12-14) - MODE GROUP UNIQUEMENT
// - Questions croyance réalité (Q15-16) - MODE GROUP UNIQUEMENT
// - Trial de nettoyage invisible (évite superposition)
// - Débriefing éthique complet
// - Sauvegarde automatique des données en CSV
// - Mise à jour de la distribution group/solo
//
// Important : Les pages sont conditionnelles selon la condition expérimentale

import { jsPsych } from '../jsPsych-instance.js';
import { addQuitButton, removeQuitButton, cleanupPage } from '../tools/quit_button.js';

/**
 * Génère tous les trials du questionnaire final post-expérience
 *
 * Cette fonction construit dynamiquement les pages du questionnaire en fonction
 * de la condition expérimentale. Les pages 4, 5a et 5b ne sont affichées
 * qu'en mode "group" grâce à l'utilisation de conditional_function.
 *
 * @returns {Array} Tableau de trials jsPsych prêts à être ajoutés à la timeline
 */
export function createFinalQuestionnaire() {
    const trials = [];

    /**
     * Fonction helper pour récupérer la condition expérimentale
     * Lit la première entrée des données jsPsych (qui contient les propriétés globales)
     *
     * @returns {string|null} "group", "solo", ou null si pas de données
     */
    const getCondition = () => {
        const allData = jsPsych.data.get().values();
        return allData.length > 0 ? allData[0].condition : null;
    };

    /**
     * Nettoie les données pour le CSV en supprimant tous les champs HTML volumineux
     * Cette fonction est appelée juste avant la sauvegarde pour éviter que le HTML
     * casse le format CSV avec des guillemets et retours à la ligne
     *
     * @param {Array} allData - Toutes les données de jsPsych
     * @returns {Array} Données nettoyées sans HTML volumineux
     */
    const cleanDataForCSV = (allData) => {
        return allData.map(trial => {
            // Créer une copie du trial pour ne pas modifier l'original
            const cleanTrial = { ...trial };

            // Supprimer TOUS les champs HTML volumineux qui cassent le CSV
            delete cleanTrial.stimulus;
            delete cleanTrial.view_history;
            delete cleanTrial.internal_node_id;
            delete cleanTrial.preamble;
            delete cleanTrial.button_html;
            delete cleanTrial.html;

            // Nettoyer le tableau de questions s'il existe
            if (cleanTrial.questions && Array.isArray(cleanTrial.questions)) {
                // Garder seulement les infos essentielles des questions
                cleanTrial.questions = cleanTrial.questions.map(q => {
                    if (typeof q === 'object' && q !== null) {
                        return { name: q.name };
                    }
                    return q;
                });
            }

            return cleanTrial;
        });
    };

    // ============================================
    // PAGE 1 : DONNÉES DÉMOGRAPHIQUES (Âge, Genre)
    // ============================================
    const page1 = {
        type: jsPsychSurveyHtmlForm,
        preamble: '<h3>Informations démographiques</h3>',
        html: `
            <div style="margin-bottom: 20px;">
                <label for="age" style="font-weight: bold; font-size: 1.08em; display: block; margin-bottom: 8px;">
                    <strong>Âge :</strong> (en années)
                </label>
                <input type="number" id="age" name="age" required min="16" max="99"
                       style="width: 100%; max-width: 150px; padding: 8px; font-size: 1em; border-radius: 5px; border: 1px solid #b56b4a;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; font-size: 1.08em; display: block; margin-bottom: 8px;">
                    <strong>Genre :</strong>
                </label>
                <div style="margin-left: 10px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 1em;">
                        <input type="radio" name="genre" value="Femme" required style="margin-right: 8px;">
                        Femme
                    </label>
                    <label style="display: block; margin-bottom: 8px; font-size: 1em;">
                        <input type="radio" name="genre" value="Homme" required style="margin-right: 8px;">
                        Homme
                    </label>
                    <label style="display: block; margin-bottom: 8px; font-size: 1em;">
                        <input type="radio" name="genre" value="Indéfini" required style="margin-right: 8px;">
                        Indéfini
                    </label>
                </div>
            </div>
        `,
        button_label: 'Continuer',
        data: {
            screen: 'demographics'
        },
        on_load: function() {
            addQuitButton();
        },
        on_finish: function(data) {
            removeQuitButton();
            // Enregistrer les données démographiques dans les propriétés globales
            jsPsych.data.addProperties({
                age: data.response.age,
                genre: data.response.genre
            });
            // Nettoyage des champs HTML volumineux
            delete data.html;
            delete data.preamble;
            delete data.internal_node_id;
        }
    };

    const page1c = {
        type: jsPsychSurveyLikert,
        preamble: '<p>Indiquez votre niveau d\'accord avec les affirmations suivantes.<br>(1 = Pas du tout d\'accord / 7 = Tout à fait d\'accord)</p>',
        questions: [
            {
                prompt: '<strong>1) Dans mon cursus, j\'ai reçu une formation à la méthode scientifique (hypothèses, expérimentation, analyse de données).</strong>',
                name: 'q1_formation_scientifique',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>2) J\'ai déjà suivi des cours de statistiques ou de méthodologie de recherche.</strong>',
                name: 'q2_cours_stats',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>3) Je me sens capable d\'évaluer la qualité méthodologique d\'une étude scientifique.</strong>',
                name: 'q3_evaluer_qualite',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            }
        ],
        button_label: 'Continuer',
        data: {
            screen: 'scientific_training_1'
        },
        on_load: function() {
            addQuitButton();
        },
        on_finish: function(data) {
            // Nettoyage des champs HTML volumineux
            delete data.preamble;
            delete data.internal_node_id;
            removeQuitButton();
        }
    };

    // ============================================
    // PAGE 2 : QUESTIONS 4-7
    // ============================================
    const page2 = {
        type: jsPsychSurveyLikert,
        preamble: '<p>Indiquez votre niveau d\'accord avec les affirmations suivantes.<br>(1 = Pas du tout d\'accord / 7 = Tout à fait d\'accord)</p>',
        questions: [
            {
                prompt: '<strong>4) Je comprends globalement comment fonctionne la recherche scientifique.</strong>',
                name: 'q4_comprend_recherche',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>5) Je me sens à l\'aise pour interpréter les résultats d\'une étude.</strong>',
                name: 'q5_interprete_resultats',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>6) Je sais ce qu\'est une hypothèse testable.</strong>',
                name: 'q6_hypothese_testable',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>7) Cette question sert à vérifier votre attention. Merci de cocher : 4 – Ni d\'accord ni pas d\'accord.</strong>',
                name: 'q7_attention_check',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4<br>Ni d\'accord ni pas d\'accord', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            }
        ],
        button_label: 'Continuer',
        data: {
            screen: 'scientific_training_2'
        },
        on_load: function() {
            addQuitButton();
        },
        on_finish: function(data) {
            // Nettoyage des champs HTML volumineux
            delete data.preamble;
            delete data.internal_node_id;
            removeQuitButton();
        },
        post_trial_gap: 100
    };

    // ============================================
    // PAGE 3 : QUESTIONS 8-11 (CONFORMITÉ SOCIALE)
    // ============================================
    const page3 = {
        type: jsPsychSurveyLikert,
        preamble: '<p>Indiquez votre niveau d\'accord avec les affirmations suivantes.<br>(1 = Pas du tout d\'accord / 7 = Tout à fait d\'accord)</p>',
        questions: [
            {
                prompt: '<strong>8) J\'essaie toujours de donner une bonne image de moi aux autres.</strong>',
                name: 'q8_bonne_image',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>9) Il m\'arrive rarement de faire quelque chose qui pourrait être mal vu socialement.</strong>',
                name: 'q9_mal_vu',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>10) Quand je ne suis pas sûr(e), je préfère suivre l\'avis de la majorité.</strong>',
                name: 'q10_suivre_majorite',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            },
            {
                prompt: '<strong>11) Il est important pour moi d\'être en accord avec le groupe.</strong>',
                name: 'q11_accord_groupe',
                labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                required: true
            }
        ],
        button_label: 'Continuer',
        data: {
            screen: 'social_conformity'
        },
        on_load: function() {
            addQuitButton();
        },
        on_finish: function(data) {
            // Nettoyage des champs HTML volumineux
            delete data.preamble;
            delete data.internal_node_id;
            removeQuitButton();
        },
        post_trial_gap: 300 // Augmenté pour le mode solo (dernière page avant débriefing)
    };

    // ============================================
    // PAGE 4 : QUESTIONS 12-14 (GROUP UNIQUEMENT)
    // ============================================
    const page4 = {
        timeline: [{
            type: jsPsychSurveyLikert,
            preamble: '<p>Indiquez votre niveau d\'accord avec les affirmations suivantes.<br>(1 = Pas du tout d\'accord / 7 = Tout à fait d\'accord)</p>',
            questions: [
                {
                    prompt: '<strong>12) J\'avais l\'impression que mes réponses étaient observées par d\'autres participant·e·s.</strong>',
                    name: 'q12_reponses_observees',
                    labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                    required: true
                },
                {
                    prompt: '<strong>13) Les réponses affichées des autres ont influencé mes propres réponses.</strong>',
                    name: 'q13_influence_autres',
                    labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                    required: true
                },
                {
                    prompt: '<strong>14) Je me suis senti(e) évalué(e) socialement pendant le test.</strong>',
                    name: 'q14_evalue_socialement',
                    labels: ['1<br>Pas du tout d\'accord', '2', '3', '4', '5', '6', '7<br>Tout à fait d\'accord'],
                    required: true
                }
            ],
            button_label: 'Continuer',
            data: {
                screen: 'group_perception'
            },
            on_load: function() {
                addQuitButton();
            },
            on_finish: function() {
                removeQuitButton();
            },
            post_trial_gap: 100
        }],
        // N'afficher cette page que si condition === "group"
        conditional_function: function() {
            const condition = getCondition();
            return condition === 'group';
        }
    };

    // ============================================
    // PAGE 5 : QUESTIONS 15-16 (GROUP UNIQUEMENT)
    // ============================================
    const page5a = {
        timeline: [{
            type: jsPsychSurveyMultiChoice,
            questions: [
                {
                    prompt: '<strong>15) Durant l\'étude, vous avez été informé(e) être connecté(e) à d\'autres participant·e·s. Selon vous, ces personnes étaient-elles réelles ?</strong>',
                    name: 'q15_croyance_realite',
                    options: [
                        'Oui, je pense qu\'elles étaient réelles.',
                        'Non, je pense que ce n\'était pas réel.',
                        'Je ne sais pas / je ne suis pas sûr(e).'
                    ],
                    required: true
                }
            ],
            button_label: 'Continuer',
            data: {
                screen: 'reality_check'
            },
            on_load: function() {
                addQuitButton();
            },
            on_finish: function() {
                removeQuitButton();
            },
            post_trial_gap: 100
        }],
        conditional_function: function() {
            const condition = getCondition();
            return condition === 'group';
        }
    };

    const page5b = {
        timeline: [{
            type: jsPsychSurveyLikert,
            questions: [
                {
                    prompt: '<strong>16) À quel point êtes-vous sûr(e) de votre réponse ?</strong>',
                    name: 'q16_certitude',
                    labels: ['1<br>Pas du tout sûr(e)', '2', '3', '4', '5', '6', '7<br>Totalement sûr(e)'],
                    required: true
                }
            ],
            button_label: 'Continuer',
            data: {
                screen: 'certainty'
            },
            on_load: function() {
                addQuitButton();
            },
            on_finish: function() {
                removeQuitButton();
            },
            post_trial_gap: 300 // Augmenté pour le mode groupe (dernière page avant débriefing)
        }],
        conditional_function: function() {
            const condition = getCondition();
            return condition === 'group';
        }
    };

    // ============================================
    // TRIAL DE NETTOYAGE (invisible)
    // ============================================
    const cleanupTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
        choices: "NO_KEYS",
        trial_duration: 50,
        // Ne pas enregistrer ce trial dans les données
        record_data: false,
        on_load: function() {
            // Nettoyage complet avant le débriefing
            cleanupPage();
        }
    };

    // ============================================
    // ÉCRAN FINAL : DÉBRIEFING
    // ============================================
    const debriefing = {
        type: jsPsychHtmlButtonResponse,
        // Ne pas enregistrer ce trial dans les données (débriefing seulement)
        record_data: false,
        on_load: function() {
            // Forcer le scroll en haut de la page
            window.scrollTo(0, 0);
        },
        stimulus: `
            <div class="study-invite">
                <h1>Débriefing — Merci pour votre participation</h1>
                <p>Nous vous remercions sincèrement pour votre participation à cette étude.<br>
                Vous allez maintenant recevoir des informations complètes sur ses objectifs et son déroulement réel.</p>

                <h2>Objectif réel de l'étude</h2>
                <p>Cette recherche vise à étudier la manière dont les étudiant·e·s évaluent différentes affirmations liées à la santé, notamment lorsqu'elles reposent sur des croyances non validées scientifiquement.</p>
                <p>Plus précisément, nous nous intéressons :</p>
                <ul>
                    <li>au niveau d'adhésion à certaines affirmations pseudo-scientifiques ;</li>
                    <li>à l'influence du cursus universitaire et de l'avancement dans les études ;</li>
                    <li>à l'effet de l'influence sociale sur les jugements individuels.</li>
                </ul>

                <h2>À propos du mode "groupe"</h2>
                <p>Selon la condition expérimentale, vous avez pu être amené·e à réaliser le questionnaire :</p>
                <ul>
                    <li>soit seul·e ;</li>
                    <li>soit en pensant être connecté·e avec d'autres participant·e·s.</li>
                </ul>
                <p><strong>Dans la condition groupe, les réponses supposément affichées comme provenant d'autres participant·e·s étaient en réalité simulées par le dispositif expérimental.</strong><br>
                Cette procédure est couramment utilisée en psychologie sociale pour étudier les effets de l'influence sociale.</p>

                <h2>⚖️ Pourquoi ne pas l'avoir annoncé dès le départ ?</h2>
                <p>Informer les participant·e·s de cette manipulation avant la passation aurait modifié leurs réponses et biaisé les résultats.<br>
                C'est pourquoi une information partielle a été utilisée au départ.<br>
                Cette méthode respecte les standards éthiques de la recherche, à condition qu'un débriefing complet soit réalisé, ce qui est le cas ici.</p>

                <h2>À propos des affirmations présentées</h2>
                <p>Les affirmations proposées reflétaient différentes croyances répandues dans le domaine de la santé.<br>
                L'objectif n'était pas de juger les participant·e·s individuellement, mais d'analyser des tendances générales de perception et d'évaluation.<br>
                <strong>Il n'y avait donc ni bonne ni mauvaise réponse attendue.</strong></p>

                <h2>Données & confidentialité</h2>
                <p>Nous vous rappelons que :</p>
                <ul>
                    <li>vos réponses sont anonymes ;</li>
                    <li>aucune donnée nominative n'a été collectée ;</li>
                    <li>les résultats seront analysés de manière globale dans le cadre d'un travail de recherche universitaire.</li>
                </ul>

                <h2>Questions ou retrait des données</h2>
                <p>Si vous souhaitez :</p>
                <ul>
                    <li>obtenir des informations complémentaires ;</li>
                    <li>poser une question ;</li>
                    <li>demander le retrait de vos données ;</li>
                </ul>
                <p>vous pouvez contacter :<br>
                <strong>Responsable de l'étude :</strong><br>
                [Nom – Statut – Université]<br>
                Email : [adresse]</p>

                <h2>Remerciements</h2>
                <p>Nous vous remercions chaleureusement pour le temps accordé à cette étude.<br>
                <strong>Votre participation contribue directement à l'avancée des connaissances en psychologie.</strong></p>
            </div>
        `,
        choices: ['Terminer et quitter'],
        on_finish: async function() {
            console.log('=== DÉBUT SAUVEGARDE ===');
            const allData = jsPsych.data.get().values();
            console.log('Nombre de trials:', allData.length);

            if (allData.length === 0) {
                console.error('ERREUR: Aucune donnée à sauvegarder !');
                return;
            }

            const participantId = allData[0].participant_id;
            const studyLevel = allData[0].study_level;
            const condition = allData[0].condition;

            console.log('Participant ID:', participantId);
            console.log('Study level:', studyLevel);
            console.log('Condition:', condition);

            // Nettoyer les données avant sauvegarde (supprimer tous les champs HTML)
            const cleanedData = cleanDataForCSV(allData);
            console.log('Nombre de trials après nettoyage:', cleanedData.length);

            try {
                // Sauvegarder les données NETTOYÉES du participant
                await fetch('php/save_data.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        participant_id: participantId,
                        data: cleanedData
                    })
                });
                console.log('✓ Données sauvegardées avec succès');

                // Mettre à jour la distribution (participant a terminé)
                await fetch('php/update_distribution.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        study_level: studyLevel,
                        condition: condition
                    })
                });
                console.log(`✓ Distribution mise à jour: ${studyLevel} - ${condition}`);

            } catch (error) {
                console.error('❌ ERREUR lors de la sauvegarde:', error);
                alert('Erreur lors de la sauvegarde des données. Veuillez contacter le responsable de l\'étude.');
                return; // Ne pas rediriger si erreur
            }

            console.log('=== FIN SAUVEGARDE - Redirection dans 1s ===');

            // Redirection après la sauvegarde (petit délai pour voir les logs)
            setTimeout(() => {
                window.location.href = 'https://psychofact.fr/';
            }, 1000);
        }
    };

    // Ajout de tous les écrans à la timeline
    trials.push(page1, page1c, page2, page3, page4, page5a, page5b, cleanupTrial, debriefing);

    return trials;
}
