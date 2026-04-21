# Documentation de l'Expérience JsPsych

> ⚠️ **Cette expérience est conçue pour être réalisée sur ordinateur.** Elle n'est pas compatible avec les smartphones ou tablettes. Utiliser un navigateur récent (Chrome, Firefox, Safari, Edge) sur ordinateur de bureau ou portable.

## **Objectif de l'étude**

Cette recherche vise à étudier la manière dont les étudiant·e·s évaluent différentes affirmations liées à la santé, notamment lorsqu'elles reposent sur des croyances non validées scientifiquement.

**Objectifs spécifiques :**

- Mesurer le niveau d'adhésion à certaines affirmations pseudo-scientifiques
- Analyser l'influence du cursus universitaire et de l'avancement dans les études sur ce niveau d'adhésion
- Analyser l'influence du niveau de formation méthodologique sur ce niveau d'adhésion
- Étudier l'effet de l'influence sociale sur les jugements individuels

## **Conditions expérimentales**

L'expérience utilise une **randomisation contrôlée** avec deux conditions :

### **Condition "SOLO"**

Le participant répond seul aux questions, sans voir les réponses d'autres participants.

### **Condition "GROUP"**

Le participant pense être connecté à d'autres participants et voit leurs réponses s'afficher en temps réel (en réalité, ces réponses sont simulées).

**Équilibrage automatique :** Le système attribue automatiquement la condition la moins représentée pour chaque niveau d'études (L1, L2, L3) afin de garantir une répartition équilibrée.

## **Déroulement de l'expérience**

### **Étape 1 : Consentement et vérification d'éligibilité**

**Écran de consentement** (consentement.js)

- Informations sur l'étude
- Formulaire de consentement
- Bouton "Quitter" disponible

**Vérification du niveau d'études** (study-level.js)

- Question : "Êtes-vous en licence ?" (Non, L1, L2, L3)
- Si "Non" → fin de l'expérience (non éligible)
- Vérification IP pour éviter les participations multiples
- **Attribution de la condition** (group/solo) selon la distribution actuelle

### 

### **Étape 2 : Saisie du pseudo**

**Saisie du pseudo** (nickname-input.js) - **TOUS LES PARTICIPANTS**

- Le participant choisit un prénom ou pseudo
- **Important** : Ce pseudo n'est jamais sauvegardé dans les données

### **Étape 3 : Explications de l'étude**

**Écran d'explications** (explanations.js)

- Instructions sur le déroulement
- Explications sur l'échelle de Likert (1-7)

### **Étape 4 : Formation du groupe (selon condition)**

#### **Mode SOLO :**

**Écran de démarrage** (group-selection.js)

- Simple message "Prêt à commencer ?"
- Bouton "Je suis prêt à démarrer"

#### **Mode GROUP :**

**Formation du groupe** (group-selection.js)

- Message "Formation de votre groupe"
- Affichage progressif de 5 "autres participants" (simulés)
- Chaque nom apparaît avec "✓ (prêt)"
- Délai : 1 seconde entre chaque nom

**Loader de connexion** (connection-loader.js)

- Durée : 3 secondes
- Message selon condition :Group : "En attente que chacun soit prêt à débuter..."
- Solo : "Connexion en cours... Préparation du questionnaire"

### **Étape 5 : Questions principales**

**Série de questions Likert** (questions.js)

- Questions mélangées aléatoirement
- Échelle 1-7 (Pas du tout d'accord → Tout à fait d'accord)
- 3 types de questions :**general** : Affirmations générales (scores simulés pour les groupes entre 5-7)
- **science** : Affirmations scientifiques (scores simulés pour les groupes 6-7)
- **ambiguë** : Affirmations ambiguës (scores simulés pour les groupes entre 3-5)

#### 


#### **Comportement selon la condition :**

**Mode SOLO :**

- Le participant répond seul
- Pas d'affichage de réponses d'autres participants
- Timeout à 40 secondes → réponse forcée à 4 si pas de réponse
- Si réponse automatique, information enregistrée dans les data consignées pour chaque participant

**Mode GROUP :**

- **Affichage des "autres participants"** :Bloc affiché en bas au centre avec les 5 noms
- Après 1,5 secondes, les scores commencent à s'afficher progressivement
- Délais aléatoires sur 12 secondes pour simuler le réalisme
- Affichage de la moyenne en temps réel

- **Simulation des réponses** :Les scores sont générés selon le type de question
- Exemple : pour une question "science", scores entre 6-7
- La moyenne s'affiche et se met à jour en temps réel

- **Timeout et loader** :Si le participant répond avant que tous les scores soient affichés :Affichage d'un loader "En attente des autres participants..."
- Durée : 1 seconde par score manquant

### **Étape 6 : Questionnaire final**

**Page démographique** (final-questionnaire.js - page1)

- Âge (input numérique)
- Genre (Femme, Homme, Indéfini)

**Questions sur la formation scientifique** (page1c)

- Questions 1-3 sur la formation à la méthode scientifique
- Échelle 1-7

**Questions formation scientifique (suite)** (page2)

- Questions 4-7 incluant une **question de contrôle d'attention** (Q7)
- Échelle 1-7

**Questions sur la conformité sociale** (page3)

- Questions 8-11 sur l'image sociale et la conformité
- Échelle 1-7

#### 


#### **Pages spécifiques au mode GROUP :**

**Questions sur la perception du groupe** (page4) - **MODE GROUP UNIQUEMENT**

- Questions 12-14 sur l'impression d'observation et d'influence
- Échelle 1-7

**Questions sur la croyance** (page5a et page5b) - **MODE GROUP UNIQUEMENT**

- Question 15 : "Ces personnes étaient-elles réelles ?" (choix multiple)
- Question 16 : Niveau de certitude (échelle 1-7)

### **Étape 7 : Sauvegarde et débriefing**

**Débriefing complet** (final-questionnaire.js - debriefing)

- Révélation complète sur l'objectif réel
- Explication de la manipulation (groupe simulé)
- Justification éthique
- Informations sur la confidentialité
- Contact pour questions ou retrait des données
- Bouton "Terminer et quitter"

**Sauvegarde automatique** (lors du clic sur "Terminer et quitter")

- Sauvegarde de toutes les données dans un CSV unique par participant
- Mise à jour de la distribution group/solo pour ce niveau d'études
- Redirection vers le site

##

## 💾 Données enregistrées

### Données globales (attachées à tous les trials)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `participant_id` | UUID unique du participant | "a1b2c3d4-..." |
| `participant_ip` | Adresse IP | "192.168.1.1" |
| `experiment_start_date` | Timestamp ISO de début | "2026-02-17T10:30:00.000Z" |
| `study_level` | Niveau de licence | "L1", "L2" ou "L3" |
| `condition` | Condition expérimentale | "group" ou "solo" |
| `age` | Âge du participant | 20 |
| `genre` | Genre | "Femme", "Homme", "Indéfini" |

### Données par question (questions Likert principales)

| Variable | Description | Toujours présent |
|----------|-------------|------------------|
| `response_timestamp` | Timestamp ISO de la réponse | ✅ |
| `question_code` | Type de question | ✅ (general/science/ambigue) |
| `question_text` | Texte de la question | ✅ |
| `participant_response` | Réponse sur échelle 1-7 | ✅ |
| `rt` | Temps de réponse en ms | ✅ (auto jsPsych) |
| `forced_by_timeout` | Si réponse forcée par timeout | ✅ (true/false) |
| `response_type` | Type de réponse | ✅ (voluntary/forced_default) |

### Données spécifiques au mode GROUP

| Variable | Description | Présent si |
|----------|-------------|------------|
| `number_of_ratings` | Nombre de scores affichés | condition === "group" |
| `final_average` | Moyenne des scores affichés (1-7) | condition === "group" |
| `conformity` | Conformité avec le groupe | condition === "group" (conforme/non_conforme) |

**Calcul de la conformité :**
- **Conforme** : (réponse ≥ 5 ET moyenne ≥ 5) OU (réponse < 5 ET moyenne < 5)
- **Non conforme** : sinon



### **Données du questionnaire final**

Toutes les réponses aux questions démographiques et post-expérience sont également enregistrées avec leurs noms de variables (q1_formation_scientifique, q2_cours_stats, etc.)

### **Visualiser les statistiques de distribution**

http://localhost/votreprojet/php/view_distribution.php

## **Format du fichier CSV**

Chaque participant génère un fichier CSV avec toutes ses données. Le fichier contient une ligne par trial (écran) avec toutes les colonnes disponibles.

**Exemple de colonnes :**

participant_id,participant_ip,experiment_start_date,study_level,condition,age,genre,trial_type,question_code,question_text,participant_response,rt,response_timestamp,final_average,conformity,...

## **Randomisation contrôlée**

Le système maintient un équilibre automatique entre les conditions group et solo pour chaque niveau d'études.

### **Fonctionnement**

**À l'attribution** (study-level.js) :

- Lecture de distribution.json
- Comparaison des compteurs group vs solo pour le niveau
- Attribution de la condition la moins représentée
- Si égalité : randomisation 50/50

**À la fin** (final-questionnaire.js) :

- Mise à jour de distribution.json
- Incrémentation du compteur approprié
- **Important** : mise à jour uniquement si le participant a terminé

### **Exemple de distribution**

{

"L1": {"group": 15, "solo": 14},

"L2": {"group": 12, "solo": 13},

"L3": {"group": 8, "solo": 8}

}

**Prochain participant L1 ?** → Sera assigné à "solo" (pour équilibrer 15 vs 14)

## **Considérations éthiques**

### **Manipulation expérimentale**

Dans la condition "group", les participants pensent voir les réponses d'autres participants, mais ces réponses sont **simulées par le système**.

### **Justification**

Cette méthode est standard en psychologie sociale pour étudier l'influence sociale sans biais. Un **débriefing complet** est fourni à la fin pour expliquer :

- L'objectif réel de l'étude
- La nature de la manipulation
- Les raisons éthiques de cette approche

### **Confidentialité**

- Aucune donnée nominative n'est collectée
- Le pseudo n'est jamais sauvegardé
- Toutes les données sont anonymes (UUID)
- L'IP sert uniquement à éviter les participations multiples


## 📁 Structure des fichiers

### Fichiers principaux
```
votreprojet/
├── index.html                 # Point d'entrée HTML
├── experiment.js              # Orchestration de l'expérience
├── jsPsych-instance.js        # Instance jsPsych partagée
├── styles.css                 # Styles globaux
└── EXPERIENCE.md              # Cette documentation
```

### Écrans (screens/)
```
screens/
├── consentement.js           # Écran de consentement
├── study-level.js            # Vérification niveau + attribution condition
├── nickname-input.js         # Saisie pseudo (tous les participants)
├── explanations.js           # Explications de l'étude
├── group-selection.js        # Formation groupe / écran démarrage
├── connection-loader.js      # Loader de connexion (3s)
├── questions.js              # Questions Likert principales
└── final-questionnaire.js    # Questionnaire démographique + débriefing
```

### Utilitaires (tools/)
```
tools/
├── stimuli.js               # Textes des stimuli
├── question_list.js         # Liste des questions Likert
├── names_simulation.js      # Gestion affichage noms simulés
└── quit_button.js           # Bouton "Quitter" global
```

### Backend PHP (php/)
```
php/
├── check_ip.php             # Vérification IP (éviter doublons)
├── save_data.php            # Sauvegarde données en CSV
├── read_distribution.php    # Lecture distribution group/solo
├── update_distribution.php  # Mise à jour distribution
└── view_distribution.php    # Visualisation statistiques
```

### Données (data/)
```
data/
├── ip_log.txt              # Log des IPs (éviter participations multiples)
├── distribution.json       # Compteurs group/solo par niveau
└── {participant_id}.csv    # Fichier CSV par participant
```
**Version de la documentation :** 1.0
**Dernière mise à jour :** 17 février 2026
