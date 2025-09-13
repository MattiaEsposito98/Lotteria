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

  // ✅ Controlli di base
  if (!$nome || !$cognome || !$data_nascita) {
    echo json_encode([
      'success' => false,
      'message' => 'Nome, cognome e data di nascita sono obbligatori'
    ]);
    exit;
  }

  // ✅ Controllo età minima 18 anni
  $oggi = new DateTime();
  $dob = DateTime::createFromFormat('Y-m-d', $data_nascita);
  if (!$dob) {
    echo json_encode(['success' => false, 'message' => 'Formato data non valido']);
    exit;
  }

  $diff = $oggi->diff($dob)->y; // differenza in anni
  if ($diff < 18) {
    echo json_encode(['success' => false, 'message' => 'L\'utente deve avere almeno 18 anni']);
    exit;
  }

  // ✅ Inserisci utente
  $stmt = $pdo->prepare("
      INSERT INTO users (nome, cognome, email, cellulare, data_nascita, ruolo) 
      VALUES (?, ?, ?, ?, ?, 'user')
  ");
  $stmt->execute([
    $nome,
    $cognome,
    $email ?: null,
    $cellulare ?: null,
    $data_nascita
  ]);

  echo json_encode(['success' => true, 'message' => 'Utente creato con successo']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
