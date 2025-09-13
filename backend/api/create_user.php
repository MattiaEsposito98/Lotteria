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

  $nome         = trim((string)($data['nome'] ?? ''));
  $cognome      = trim((string)($data['cognome'] ?? ''));
  $email        = strtolower(trim((string)($data['email'] ?? '')));
  $cellulare    = trim((string)($data['cellulare'] ?? ''));
  $data_nascita = (string)($data['data_nascita'] ?? '');

  // ✅ Controlli di base
  if ($nome === '' || $cognome === '' || $data_nascita === '') {
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
  $diff = $oggi->diff($dob)->y;
  if ($diff < 18) {
    echo json_encode(['success' => false, 'message' => 'L\'utente deve avere almeno 18 anni']);
    exit;
  }

  // ✅ Controllo email duplicata (solo se email è stata inserita)
  if ($email !== '') {
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
      echo json_encode(['success' => false, 'message' => 'Questa email è già registrata']);
      exit;
    }
  }

  // ✅ Inserisci utente
  $stmt = $pdo->prepare("
      INSERT INTO users (nome, cognome, email, cellulare, data_nascita, ruolo) 
      VALUES (?, ?, ?, ?, ?, 'user')
  ");
  $stmt->execute([
    $nome,
    $cognome,
    $email !== '' ? $email : null,
    $cellulare !== '' ? $cellulare : null,
    $data_nascita
  ]);

  echo json_encode(['success' => true, 'message' => 'Utente creato con successo']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
