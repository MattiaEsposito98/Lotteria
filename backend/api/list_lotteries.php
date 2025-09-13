<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php'; // solo admin può vedere

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();

  $stmt = $pdo->query("
        SELECT id, titolo, descrizione, data_inizio, data_fine, stato, created_at 
        FROM lotterie 
        ORDER BY id DESC
    ");
  $lotteries = $stmt->fetchAll();

  echo json_encode(['success' => true, 'lotteries' => $lotteries]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
