<?php
/**
 * Script pour lire la distribution actuelle group/solo par niveau d'études
 * Retourne les compteurs et suggère quelle condition attribuer pour équilibrer
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Chemin vers le fichier de distribution
$distribution_file = '../data/distribution.json';

// Vérifier si le fichier existe
if (!file_exists($distribution_file)) {
    // Créer le fichier avec des valeurs par défaut
    $default_data = [
        'L1' => ['group' => 0, 'solo' => 0],
        'L2' => ['group' => 0, 'solo' => 0],
        'L3' => ['group' => 0, 'solo' => 0]
    ];
    file_put_contents($distribution_file, json_encode($default_data, JSON_PRETTY_PRINT));
}

// Lire le fichier
$distribution = json_decode(file_get_contents($distribution_file), true);

// Récupérer le niveau d'études si fourni
$study_level = $_GET['study_level'] ?? null;

$response = [
    'success' => true,
    'distribution' => $distribution
];

// Si un niveau d'études est fourni, suggérer quelle condition attribuer
if ($study_level && isset($distribution[$study_level])) {
    $group_count = $distribution[$study_level]['group'];
    $solo_count = $distribution[$study_level]['solo'];

    // Équilibrage : attribuer la condition qui a le moins de participants
    if ($group_count < $solo_count) {
        $suggested_condition = 'group';
    } elseif ($solo_count < $group_count) {
        $suggested_condition = 'solo';
    } else {
        // Si égalité, randomiser
        $suggested_condition = (rand(0, 1) === 0) ? 'group' : 'solo';
    }

    $response['suggested_condition'] = $suggested_condition;
    $response['study_level'] = $study_level;
    $response['current_counts'] = [
        'group' => $group_count,
        'solo' => $solo_count,
        'total' => $group_count + $solo_count
    ];
}

echo json_encode($response);
?>
