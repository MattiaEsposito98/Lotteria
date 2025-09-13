<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $stmt = $pdo->query("SELECT id, titolo, descrizione, data_inizio, data_fine, stato FROM lotterie ORDER BY id DESC");
  $lotterie = $stmt->fetchAll();

  echo json_encode(['success' => true, 'data' => $lotterie]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
