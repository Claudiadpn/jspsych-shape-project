<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$ip = $_SERVER['SERVER_ADDR'] ?: '';
$log_file = __DIR__ . '/../data/ip_log.txt';

if (!is_writable(dirname($log_file)) || '' === $ip) {
    echo json_encode(['eligible' => false, 'error' => 'Directory not writable']);
    exit;
}

if (!file_exists($log_file)) {
    $result = file_put_contents($log_file, '');
    if ($result === false) {
        echo json_encode(['eligible' => false, 'error' => 'Cannot create file']);
        exit;
    }
}

$ips = file($log_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

if ($ips === false) {
    $ips = [];
}

if (in_array($ip, $ips)) {
    echo json_encode(['eligible' => false, 'ip' => $ip, 'reason' => 'already_participated']);
    exit;
}

//$result = file_put_contents($log_file, $ip . PHP_EOL, FILE_APPEND | LOCK_EX);

//if ($result === false) {
//    echo json_encode(['eligible' => false, 'error' => 'Cannot write to file']);
//    exit;
//}

echo json_encode(['eligible' => true, 'ip' => $ip, 'written' => true]);