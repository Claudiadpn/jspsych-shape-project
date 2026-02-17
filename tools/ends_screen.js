export const screen_not_eligible = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h2>Merci pour votre intérêt</h2>
    <p>Cette étude est réservée aux étudiant·es inscrit·es en licence universitaire.</p>
  `,
    choices: ["Quitter"]
};

export const screen_already_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h2>Merci pour votre participation</h2>
    <p>Nos enregistrements indiquent que cette étude a déjà été réalisée depuis cet appareil.</p>
  `,
    choices: ["Quitter"]
};
