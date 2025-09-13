<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $data = json_decode(file_get_contents("php://input"), true);

  $titolo       = trim($data['titolo'] ?? '');
  $descrizione  = trim($data['descrizione'] ?? '');
  $data_inizio  = $data['data_inizio'] ?? null;
  $data_fine    = $data['data_fine'] ?? null;

  if (!$titolo || !$data_inizio || !$data_fine) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Titolo, data inizio e data fine obbligatori']);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO lotterie (titolo, descrizione, data_inizio, data_fine) VALUES (?, ?, ?, ?)");
  $stmt->execute([$titolo, $descrizione, $data_inizio, $data_fine]);

  echo json_encode(['success' => true, 'message' => 'Lotteria creata']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
