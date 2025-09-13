<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();
  $id_lotteria = intval($_GET['id_lotteria'] ?? 0);

  if (!$id_lotteria) {
    echo json_encode(['success' => false, 'message' => 'ID lotteria mancante']);
    exit;
  }

  $stmt = $pdo->prepare("
        SELECT b.id, b.codice, b.created_at,
               u.nome, u.cognome, u.email
        FROM biglietti b
        JOIN users u ON b.id_utente = u.id
        WHERE b.id_lotteria = ?
        ORDER BY b.id DESC
    ");
  $stmt->execute([$id_lotteria]);
  $tickets = $stmt->fetchAll();

  echo json_encode(['success' => true, 'tickets' => $tickets]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
