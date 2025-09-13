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

  $id_lotteria = intval($data['id_lotteria'] ?? 0);
  $id_utente = intval($data['id_utente'] ?? 0);

  if (!$id_lotteria || !$id_utente) {
    echo json_encode(['success' => false, 'message' => 'Lotteria e utente obbligatori']);
    exit;
  }

  // Genera codice univoco
  $codice = strtoupper("LOT{$id_lotteria}-U{$id_utente}-" . substr(md5(uniqid()), 0, 6));

  $stmt = $pdo->prepare("INSERT INTO biglietti (id_lotteria, id_utente, codice) VALUES (?, ?, ?)");
  $stmt->execute([$id_lotteria, $id_utente, $codice]);

  echo json_encode(['success' => true, 'codice' => $codice]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
