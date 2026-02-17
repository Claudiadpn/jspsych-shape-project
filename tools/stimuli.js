// ============================================
// Textes et stimuli de l'expérience
// ============================================
// Ce fichier contient tous les textes affichés
// aux participants durant l'expérience.

// Question posée pour vérifier l'éligibilité
export const studyLevelQuestion = `Êtes-vous actuellement inscrit·e en licence universitaire (L1, L2 ou L3) ?`;

// Message affiché si le participant n'est pas éligible
export const notEligibleText = `
    <div style="max-width: 600px; margin: 0 auto; text-align: center; padding: 40px;">
        <h2 style="color: #e74c3c;">😊 Merci pour votre intérêt</h2>
        <p style="font-size: 1.1em; color: #555; margin-top: 20px;">
            Cette étude est réservée aux étudiant·es inscrit·es en licence universitaire.
        </p>
        <p style="color: #888; margin-top: 30px;">
            Nous vous remercions d'avoir pris le temps de consulter cette page.
        </p>
    </div>
`;

// Message affiché si le participant a déjà fait l'expérience
export const alreadyParticipatedText = `
    <div style="max-width: 600px; margin: 0 auto; text-align: center; padding: 40px;">
        <h2 style="color: #f39c12;">🙏 Merci pour votre participation</h2>
        <p style="font-size: 1.1em; color: #555; margin-top: 20px;">
            Nos enregistrements indiquent que cette étude a déjà été réalisée depuis cet appareil.
        </p>
        <p style="color: #888; margin-top: 30px;">
            Chaque participant ne peut participer qu'une seule fois à cette étude.
        </p>
    </div>
`;
