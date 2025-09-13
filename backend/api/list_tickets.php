<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $id_lotteria = intval($_GET['id_lotteria'] ?? 0);
  $id_user     = intval($_GET['id_user'] ?? 0);

  $sql = "SELECT b.id, b.codice_ticket, b.created_at, 
                   u.nome AS utente, l.titolo AS lotteria
            FROM biglietti b
            JOIN users u ON b.id_user = u.id
            JOIN lotterie l ON b.id_lotteria = l.id
            WHERE 1=1";
  $params = [];

  if ($id_lotteria) {
    $sql .= " AND b.id_lotteria = ?";
    $params[] = $id_lotteria;
  }
  if ($id_user) {
    $sql .= " AND b.id_user = ?";
    $params[] = $id_user;
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);

  $tickets = $stmt->fetchAll();

  echo json_encode(['success' => true, 'data' => $tickets]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
