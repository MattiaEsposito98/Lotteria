<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();
  $term = strtolower(trim($_GET['q'] ?? ''));

  if (strlen($term) < 3) {
    echo json_encode(['success' => true, 'users' => []]); // serve almeno 3 lettere
    exit;
  }

  $stmt = $pdo->prepare("
        SELECT id, nome, cognome, email 
        FROM users
        WHERE LOWER(nome) LIKE ? OR LOWER(cognome) LIKE ? OR LOWER(email) LIKE ? AND ruolo = 'user'
        ORDER BY nome ASC
        LIMIT 20
    ");
  $like = "%$term%";
  $stmt->execute([$like, $like, $like]);
  $users = $stmt->fetchAll();

  echo json_encode(['success' => true, 'users' => $users]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
