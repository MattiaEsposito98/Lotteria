<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/auth.php'; // solo admin può creare utenti

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();
  $data = json_decode(file_get_contents("php://input"), true);
  if (!$data) $data = $_POST;

  $nome = trim($data['nome'] ?? '');
  $cognome = trim($data['cognome'] ?? '');
  $email = strtolower(trim($data['email'] ?? ''));
  $cellulare = trim($data['cellulare'] ?? '');
  $data_nascita = trim($data['data_nascita'] ?? null);

  if (!$nome || !$cognome) {
    echo json_encode(['success' => false, 'message' => 'Nome e cognome sono obbligatori']);
    exit;
  }

  $stmt = $pdo->prepare("
        INSERT INTO users (nome, cognome, email, cellulare, data_nascita, ruolo) 
        VALUES (?, ?, ?, ?, ?, 'user')
    ");
  $stmt->execute([$nome, $cognome, $email ?: null, $cellulare ?: null, $data_nascita ?: null]);

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
