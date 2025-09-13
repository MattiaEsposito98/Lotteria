<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php'; // solo admin può leggere utenti

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();

  $stmt = $pdo->query("
        SELECT id, nome, cognome, email, cellulare, data_nascita, created_at 
        FROM users 
        ORDER BY id DESC
    ");
  $users = $stmt->fetchAll();

  echo json_encode(['success' => true, 'users' => $users]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
