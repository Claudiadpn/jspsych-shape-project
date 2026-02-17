# 🧪 Expérience JsPsych - Influence Sociale et Pseudo-Science

Expérience en psychologie sociale étudiant l'adhésion aux affirmations pseudo-scientifiques et l'effet de l'influence sociale sur les jugements individuels.


### Première utilisation

1. L'expérience commence par l'écran de consentement
2. Le participant doit être en licence (L1, L2, ou L3)
3. Attribution automatique de la condition (group/solo) selon l'équilibrage
4. L'expérience dure environ **10-15 minutes**

---

## 📁 Structure du projet

```
votreprojet/
│
├── index.html                 # Point d'entrée principal
├── experiment.js              # Orchestration de l'expérience
├── jsPsych-instance.js        # Configuration jsPsych globale
├── styles.css                 # Styles CSS personnalisés
│
├── screens/                   # Écrans de l'expérience
│   ├── consentement.js
│   ├── study-level.js
│   ├── nickname-input.js
│   ├── explanations.js
│   ├── group-selection.js
│   ├── connection-loader.js
│   ├── questions.js           # Questions Likert principales
│   └── final-questionnaire.js # Questionnaire final + débriefing
│
├── tools/                     # Utilitaires
│   ├── stimuli.js
│   ├── question_list.js
│   ├── names_simulation.js
│   └── quit_button.js
│
├── php/                       # Scripts backend
│   ├── check_ip.php           # Vérification IP (anti-doublon)
│   ├── save_data.php          # Sauvegarde données CSV
│   ├── read_distribution.php  # Lecture distribution
│   ├── update_distribution.php # MAJ distribution
│   └── view_distribution.php  # Visualisation stats
│
├── data/                      # Données (créé automatiquement)
│   ├── distribution.json      # Compteurs group/solo
│   ├── ip_log.txt            # Log des IPs
│   └── *.csv                 # Fichiers de données participants
│
├── experiment_html/           # Templates HTML externes
│   ├── consentementInfo.html
│   └── explanations.html
│
├── README.md                  # Ce fichier
└── EXPERIENCE.md              # Documentation complète de l'expérience
```

---

## 📚 Documentation

### Documentation complète

Voir **[EXPERIENCE.md](EXPERIENCE.md)** pour :
- Description détaillée du déroulement de l'expérience
- Liste complète des données enregistrées
- Explications des conditions expérimentales
- Détails sur la randomisation contrôlée
- Considérations éthiques

### Fichiers de code

Tous les fichiers JavaScript sont **abondamment commentés en français**.

---

## 📊 Visualisation des données

### Statistiques de distribution

Pour voir l'équilibrage actuel group/solo par niveau :

```
./php/view_distribution.php
```

Cette page affiche :
- Nombre de participants group vs solo pour L1, L2, L3
- Indicateurs d'équilibre
- Statistiques globales et pourcentages

### Données individuelles

Les fichiers CSV des participants se trouvent dans `data/` :
- Un fichier par participant
- Format CSV standard, importable dans Excel, R, Python, SPSS, etc.

**Colonnes principales :**
- Métadonnées : `participant_id`, `participant_ip`, `experiment_start_date`
- Démographie : `age`, `genre`, `study_level`, `condition`
- Réponses : `question_code`, `participant_response`, `rt`
- Mode group : `final_average`, `conformity`

---

**Version :** 1.0
**Dernière mise à jour :** 17 février 2026
