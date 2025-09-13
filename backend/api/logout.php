<?php
session_start();
require_once __DIR__ . '/../config/cors.php';

header('Content-Type: application/json');

// Distrugge la sessione
$_SESSION = [];
if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(
    session_name(),
    '',
    time() - 42000,
    $params["path"],
    $params["domain"],
    $params["secure"],
    $params["httponly"]
  );
}
session_destroy();

echo json_encode([
  'success' => true,
  'message' => 'Logout effettuato con successo'
]);
