<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php'; // solo admin

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();
  $data = json_decode(file_get_contents("php://input"), true);
  if (!$data) $data = $_POST;

  $titolo = trim($data['titolo'] ?? '');
  $descrizione = trim($data['descrizione'] ?? '');
  $data_inizio = trim($data['data_inizio'] ?? '');
  $data_fine = trim($data['data_fine'] ?? '');

  if (!$titolo || !$data_inizio || !$data_fine) {
    echo json_encode(['success' => false, 'message' => 'Titolo, data inizio e data fine sono obbligatori']);
    exit;
  }

  $stmt = $pdo->prepare("
        INSERT INTO lotterie (titolo, descrizione, data_inizio, data_fine) 
        VALUES (?, ?, ?, ?)
    ");
  $stmt->execute([$titolo, $descrizione, $data_inizio, $data_fine]);

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
