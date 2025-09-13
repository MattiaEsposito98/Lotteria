<? php
session_start();
require_once __DIR__. '/../config/cors.php';
require_once __DIR__. '/../config/config.php';
require_once __DIR__. '/../config/auth.php';

header('Content-Type: application/json');

try {
  $pdo = getDBConnection();

  $data = json_decode(file_get_contents("php://input"), true);
  $id = intval($data['id'] ?? 0);
  $stato = $data['stato'] ?? '';

  if (!$id || !in_array($stato, ['aperta', 'chiusa'])) {
    http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parametri non validi']);
    exit;
  }

  $stmt = $pdo -> prepare("UPDATE lotterie SET stato = ? WHERE id = ?");
  $stmt -> execute([$stato, $id]);

    echo json_encode(['success' => true, 'message' => 'Stato aggiornato']);
} catch (Exception $e) {
  http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e -> getMessage()]);
}
