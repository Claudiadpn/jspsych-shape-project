// ============================================
// Questions de l'expérience
// ============================================
// Ce fichier contient toutes les questions posées
// aux participants, organisées par catégorie.

/**
 * Retourne la liste complète des questions
 * Chaque question a :
 * - prompt : le texte de la question
 * - code : la catégorie (general, science, ambigue)
 */
export const getQuestions = () => {
    return [
        // ====================================
        // QUESTIONS GÉNÉRALES
        // ====================================
        {prompt: "Le corps peut s'auto-guérir si son énergie est équilibrée.", code: "general"},
        //{prompt: "Les maladies apparaissent lorsque l'énergie circule mal dans le corps.", code: "general"},
        //{prompt: "Les soins énergétiques peuvent améliorer l'état de santé physique.", code: "general"},
        //{prompt: "Les émotions refoulées peuvent provoquer des maladies.", code: "general"},
        //{prompt: "Les conflits psychologiques non résolus peuvent affecter le corps.", code: "general"},
        //{prompt: "Travailler sur ses émotions peut aider à prévenir certaines maladies.", code: "general"},
        //{prompt: "L'accumulation de toxines dans le corps favorise l'apparition de maladies.", code: "general"},
        //{prompt: "Les cures détox permettent de nettoyer l'organisme en profondeur.", code: "general"},
        //{prompt: "Le jeûne peut aider le corps à se régénérer.", code: "general"},
        //{prompt: "Les traitements naturels sont généralement plus sûrs que les médicaments.", code: "general"},
        //{prompt: "Le corps tolère mieux les substances naturelles que chimiques.", code: "general"},
        //{prompt: "Les plantes médicinales peuvent remplacer certains traitements médicaux.", code: "general"},
        //{prompt: "La maladie peut être un message envoyé par le corps.", code: "general"},
        //{prompt: "Certaines maladies ont une signification liée à l'histoire personnelle.", code: "general"},
        //{prompt: "Comprendre le sens d'une maladie peut aider à guérir.", code: "general"},
        //{prompt: "L'homéopathie est efficace pour certains troubles de santé.", code: "general"},
        //{prompt: "L'acupuncture peut aider à arrêter de fumer.", code: "general"},
        //{prompt: "Les huiles essentielles peuvent remplacer certains traitements médicaux.", code: "general"},

        // ====================================
        // QUESTIONS SCIENTIFIQUES
        // ====================================
        //{prompt: "Les vaccins ont permis de réduire fortement certaines maladies graves.", code: "science"},
        //{prompt: "Les antibiotiques sont efficaces contre les infections bactériennes.", code: "science"},
        //{prompt: "L'efficacité d'un traitement doit être démontrée par des études scientifiques.", code: "science"},
        //{prompt: "Les essais cliniques sont nécessaires pour valider un médicament.", code: "science"},
        //{prompt: "L'effet placebo peut influencer la perception de l'efficacité d'un traitement.", code: "science"},

        // ====================================
        // QUESTIONS AMBIGUËS
        // ====================================
        //{prompt: "La frontière entre médecine conventionnelle et alternative évolue avec le temps.", code: "ambigue"},
        //{prompt: "Certaines approches non reconnues aujourd'hui pourraient l'être demain.", code: "ambigue"},
        //{prompt: "L'expérience personnelle peut influencer la perception de l'efficacité d'un soin.", code: "ambigue"},
        //{prompt: "La confiance envers un traitement joue un rôle dans son efficacité.", code: "ambigue"},
        //{prompt: "Les patients devraient pouvoir choisir librement leur approche thérapeutique.", code: "ambigue"}
    ];
}
