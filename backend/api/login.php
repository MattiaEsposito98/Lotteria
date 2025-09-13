<?php
session_start();
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();

  // Leggi input JSON o form-data
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  if (!$data) {
    $data = $_POST; // fallback
  }

  $email = isset($data['email']) ? strtolower(trim($data['email'])) : '';
  $password = isset($data['password']) ? trim($data['password']) : '';

  if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email e password obbligatorie']);
    exit;
  }

  // Cerca utente
  $stmt = $pdo->prepare("SELECT id, nome, email, password_hash, ruolo FROM users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  // Verifica credenziali
  if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Credenziali non valide']);
    exit;
  }

  // Solo admin
  if ($user['ruolo'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Accesso consentito solo agli admin']);
    exit;
  }

  // Salva sessione
  session_regenerate_id(true); // previene session fixation
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['ruolo']   = $user['ruolo'];

  echo json_encode([
    'success' => true,
    'message' => 'Login effettuato',
    'user' => [
      'id' => $user['id'],
      'nome' => $user['nome'],
      'email' => $user['email'],
      'ruolo' => $user['ruolo']
    ]
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
