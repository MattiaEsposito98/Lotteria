<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Carica .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Mostra errori solo in dev
if ($_ENV['APP_ENV'] ?? 'dev' === 'dev') {
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
} else {
  ini_set('display_errors', 0);
  error_reporting(0);
}

// Connessione PDO
function getDBConnection(): PDO
{
  static $conn;

  if ($conn === null) {
    $dsn = 'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'] . ';charset=utf8mb4';
    try {
      $conn = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
      ]);
    } catch (PDOException $e) {
      die("Connessione al DB fallita: " . $e->getMessage());
    }
  }

  return $conn;
}

// Costanti globali
define('APP_NAME', $_ENV['APP_NAME'] ?? 'MyLotteria');
define('TICKET_PREFIX', $_ENV['TICKET_PREFIX'] ?? 'L');
