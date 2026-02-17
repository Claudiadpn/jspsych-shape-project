// ============================================
// EXPÉRIENCE PRINCIPALE
// ============================================
// Ce fichier orchestre toute l'expérience sur l'influence sociale
// et l'adhésion aux affirmations pseudo-scientifiques.
//
// Fonctionnalités principales :
// - Randomisation contrôlée group/solo par niveau d'études
// - Simulation de participants en mode group
// - Sauvegarde complète des données en CSV
// - Équilibrage automatique des conditions expérimentales

// Import de l'instance jsPsych partagée (configuration globale)
import { jsPsych } from './jsPsych-instance.js';

// Import des différents écrans de l'expérience
import { consentementInfo } from './screens/consentement.js';
import { studyLevelScreen } from './screens/study-level.js';
import { nicknameInput } from './screens/nickname-input.js';
import { explanations } from './screens/explanations.js';
import { createGroupSelectionScreen } from './screens/group-selection.js';
import { connectionLoader } from './screens/connection-loader.js';
import { createQuestionTrials } from './screens/questions.js';
import { createFinalQuestionnaire } from './screens/final-questionnaire.js';

// Import des utilitaires
import { getQuestions } from './tools/question_list.js';
import { loadNames, loadSpecificsNames } from './tools/names_simulation.js';

// ============================================
// INITIALISATION
// ============================================

// Timeline principale : contient tous les écrans dans l'ordre chronologique
const timeline = [];

// Récupération de toutes les questions Likert depuis question_list.js
const allQuestions = getQuestions();

// Génération d'un UUID unique pour identifier ce participant de façon anonyme
const participantId = crypto.randomUUID();

// Chargement et sélection aléatoire de 5 noms pour la simulation (mode group)
// 4 noms "normaux" + 1 nom "spécifique" pour plus de réalisme
const selectedNormalNames = getRandomSubset(loadNames(), 4);
const selectedSpecificsNames = getRandomSubset(loadSpecificsNames(), 1);
const selectedNames = [...selectedNormalNames, ...selectedSpecificsNames];

/**
 * Sélectionne n éléments aléatoires d'un tableau sans remise
 * Utilise l'algorithme de mélange de jsPsych pour garantir le hasard
 *
 * @param {Array} array - Tableau source à échantillonner
 * @param {number} n - Nombre d'éléments à sélectionner
 * @returns {Array} Sous-ensemble aléatoire de taille n
 */
function getRandomSubset(array, n) {
    return jsPsych.randomization.shuffle(array).slice(0, n);
}

// ============================================
// FONCTION PRINCIPALE ASYNC
// ============================================
// Fonction asynchrone nécessaire pour attendre la récupération de l'IP
async function initExperiment() {
    // ============================================
    // AJOUT DES DONNÉES GLOBALES
    // ============================================
    // Ces propriétés seront automatiquement attachées à tous les trials
    // par jsPsych, permettant d'identifier et tracer chaque participant

    // Timestamp ISO 8601 du début de l'expérience (UTC)
    const startDate = new Date().toISOString();

    // Ajout des propriétés globales à toutes les données jsPsych
    jsPsych.data.addProperties({
        participant_id: participantId,           // UUID unique
        experiment_start_date: startDate         // Date/heure de début (ISO)
    });

    // ============================================
    // CONSTRUCTION DE LA TIMELINE
    // ============================================
    // Assemblage séquentiel de tous les écrans de l'expérience
    // L'ordre est crucial pour le bon déroulement de l'étude

    // Création de l'écran de sélection/formation de groupe
    // Passe les noms simulés pour affichage en mode "group"
    const groupSelection = createGroupSelectionScreen(selectedNames);

    // Ajout des écrans préliminaires (avant les questions)
    timeline.push(
        consentementInfo,           // 1. Écran de consentement et informations
        studyLevelScreen,           // 2. Vérification éligibilité + randomisation contrôlée
        nicknameInput,              // 3. Saisie pseudo (demandé à TOUS les participants)
        explanations,               // 4. Explications détaillées de la tâche
        groupSelection,             // 5. Formation du groupe ou écran de démarrage
        connectionLoader,           // 6. Loader de connexion (3 secondes)
    );

    // Génération et ajout de tous les écrans de questions Likert
    // Les questions sont mélangées aléatoirement pour éviter les biais d'ordre
    const questionTrials = createQuestionTrials(allQuestions, selectedNames);
    timeline.push(...questionTrials); // Opérateur spread (...) pour ajouter tous les trials

    // Ajout du questionnaire démographique et post-expérience
    // Inclut également le débriefing complet et la sauvegarde des données
    const finalQuestionnaire = createFinalQuestionnaire();
    timeline.push(...finalQuestionnaire);

    // ============================================
    // LANCEMENT DE L'EXPÉRIENCE
    // ============================================
    // Démarre jsPsych avec la timeline complète
    // À partir d'ici, jsPsych prend le contrôle du déroulement

    jsPsych.run(timeline);
}

// ============================================
// POINT D'ENTRÉE
// ============================================
// Lancement de l'expérience dès le chargement du script
initExperiment();
