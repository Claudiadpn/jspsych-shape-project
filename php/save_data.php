<?php
/**
 * Script de sauvegarde des données de l'expérience
 * Crée un fichier CSV par participant dans le dossier data/
 */

// Configuration
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérification de la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Récupération des données JSON
$input = file_get_contents('php://input');
$requestData = json_decode($input, true);

if (!$requestData || !isset($requestData['participant_id']) || !isset($requestData['data'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit();
}

$participantId = $requestData['participant_id'];
$data = $requestData['data'];

// Nom du fichier CSV
$filename = '../data/' . $participantId . '.csv';

try {
    // Ouverture du fichier en mode écriture
    $file = fopen($filename, 'w');

    if ($file === false) {
        throw new Exception('Cannot create file');
    }

    // Si les données ne sont pas vides, extraire les clés pour l'en-tête
    if (!empty($data)) {
        // Récupération de toutes les clés possibles (pour avoir toutes les colonnes)
        $allKeys = [];
        foreach ($data as $row) {
            $allKeys = array_merge($allKeys, array_keys($row));
        }
        $allKeys = array_unique($allKeys);

        // Écriture de l'en-tête
        fputcsv($file, $allKeys);

        // Écriture de chaque ligne de données
        foreach ($data as $row) {
            $csvRow = [];
            foreach ($allKeys as $key) {
                // Si la valeur est un objet/array, le convertir en JSON
                if (isset($row[$key])) {
                    if (is_array($row[$key]) || is_object($row[$key])) {
                        $csvRow[] = json_encode($row[$key]);
                    } else {
                        $csvRow[] = $row[$key];
                    }
                } else {
                    $csvRow[] = '';
                }
            }
            fputcsv($file, $csvRow);
        }
    }

    fclose($file);

    // Réponse succès
    echo json_encode([
        'success' => true,
        'message' => 'Data saved successfully',
        'filename' => $participantId . '.csv',
        'rows' => count($data)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error saving data: ' . $e->getMessage()
    ]);
}
?>
