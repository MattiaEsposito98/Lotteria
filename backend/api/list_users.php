<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $stmt = $pdo->query("SELECT id, nome, email, ruolo, created_at FROM users ORDER BY id DESC");
  $users = $stmt->fetchAll();

  echo json_encode(['success' => true, 'data' => $users]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
