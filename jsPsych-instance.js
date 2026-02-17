// ============================================
// Instance jsPsych partagée
// ============================================
// Ce fichier crée et exporte l'instance jsPsych unique
// utilisée dans toute l'expérience. En l'exportant ici,
// tous les autres fichiers peuvent l'importer et l'utiliser.

export const jsPsych = initJsPsych({
    on_finish: () => {
        // Affiche toutes les données collectées dans la console
        console.log(jsPsych.data.get().values());
    }
});
