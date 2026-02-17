<?php
/**
 * Script pour mettre à jour la distribution après qu'un participant ait terminé
 * Appelé à la fin de l'expérience pour incrémenter le compteur approprié
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Récupération des données JSON
$input = file_get_contents('php://input');
$requestData = json_decode($input, true);

if (!$requestData || !isset($requestData['study_level']) || !isset($requestData['condition'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit();
}

$study_level = $requestData['study_level'];
$condition = $requestData['condition'];

// Valider les données
if (!in_array($study_level, ['L1', 'L2', 'L3'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid study level']);
    exit();
}

if (!in_array($condition, ['group', 'solo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid condition']);
    exit();
}

// Chemin vers le fichier de distribution
$distribution_file = '../data/distribution.json';

// Utiliser un verrou pour éviter les problèmes de concurrence
$lock_file = '../data/distribution.lock';
$fp = fopen($lock_file, 'w');

if (!flock($fp, LOCK_EX)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not acquire lock']);
    exit();
}

try {
    // Lire le fichier actuel
    if (!file_exists($distribution_file)) {
        $distribution = [
            'L1' => ['group' => 0, 'solo' => 0],
            'L2' => ['group' => 0, 'solo' => 0],
            'L3' => ['group' => 0, 'solo' => 0]
        ];
    } else {
        $distribution = json_decode(file_get_contents($distribution_file), true);
    }

    // Incrémenter le compteur approprié
    $distribution[$study_level][$condition]++;

    // Sauvegarder
    file_put_contents($distribution_file, json_encode($distribution, JSON_PRETTY_PRINT));

    // Réponse
    echo json_encode([
        'success' => true,
        'message' => 'Distribution updated',
        'study_level' => $study_level,
        'condition' => $condition,
        'new_count' => $distribution[$study_level][$condition],
        'distribution' => $distribution
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    // Libérer le verrou
    flock($fp, LOCK_UN);
    fclose($fp);
}
?>
