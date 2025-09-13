<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $data = json_decode(file_get_contents("php://input"), true);

  $nome  = trim($data['nome'] ?? '');
  $email = strtolower(trim($data['email'] ?? ''));

  if (!$nome || !$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nome ed email obbligatori']);
    exit;
  }

  // Evita duplicati
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);
  if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email già esistente']);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO users (nome, email, ruolo) VALUES (?, ?, 'user')");
  $stmt->execute([$nome, $email]);

  echo json_encode(['success' => true, 'message' => 'Utente creato']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
