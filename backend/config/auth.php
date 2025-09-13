<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

if (!isset($_SESSION['user_id']) || $_SESSION['ruolo'] !== 'admin') {
  http_response_code(401);
  echo json_encode(['success' => false, 'message' => 'Non autorizzato']);
  exit;
}
