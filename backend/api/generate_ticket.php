<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

try {
  $pdo = getDBConnection();

  $data = json_decode(file_get_contents("php://input"), true);

  $id_lotteria = intval($data['id_lotteria'] ?? 0);
  $id_user     = intval($data['id_user'] ?? 0);

  if (!$id_lotteria || !$id_user) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'id_lotteria e id_user sono obbligatori']);
    exit;
  }

  // Controlla che la lotteria esista ed sia attiva
  $stmt = $pdo->prepare("SELECT id FROM lotterie WHERE id = ? AND stato = 'attiva'");
  $stmt->execute([$id_lotteria]);
  if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Lotteria non trovata o non attiva']);
    exit;
  }

  // Controlla che l'utente esista
  $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
  $stmt->execute([$id_user]);
  if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Utente non trovato']);
    exit;
  }

  // Genera codice univoco
  $randomStr = strtoupper(bin2hex(random_bytes(4))); // 8 caratteri esadecimali
  $codice = TICKET_PREFIX . '-' . $id_lotteria . '-' . $randomStr;

  // Verifica unicità (in casi rari di collisione)
  $stmt = $pdo->prepare("SELECT id FROM biglietti WHERE codice_ticket = ?");
  $stmt->execute([$codice]);
  if ($stmt->fetch()) {
    // Rigenera
    $randomStr = strtoupper(bin2hex(random_bytes(5)));
    $codice = TICKET_PREFIX . '-' . $id_lotteria . '-' . $randomStr;
  }

  // Inserisci biglietto
  $stmt = $pdo->prepare("INSERT INTO biglietti (id_lotteria, id_user, codice_ticket) VALUES (?, ?, ?)");
  $stmt->execute([$id_lotteria, $id_user, $codice]);

  echo json_encode([
    'success' => true,
    'message' => 'Ticket generato',
    'ticket'  => [
      'id_lotteria' => $id_lotteria,
      'id_user' => $id_user,
      'codice_ticket' => $codice
    ]
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
