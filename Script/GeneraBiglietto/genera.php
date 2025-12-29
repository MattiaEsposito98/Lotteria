<?php

if (!isset($_FILES["base"]) || !isset($_POST["nomi"])) {
  die("Errore: dati mancanti.");
}

$baseTmp = $_FILES["base"]["tmp_name"];
$listaNomi = json_decode($_POST["nomi"], true);

if (!file_exists($baseTmp)) {
  die("Errore: immagine base mancante.");
}

$outputFolder = "output/";
if (!is_dir($outputFolder)) mkdir($outputFolder);

// POSIZIONE TESTO
$textX = 380;
$textY = 820;

// Colore rosso
$R = 150;
$G = 0;
$B = 0;

// Font
$font = "Montserrat-Bold.ttf";
$fontSize = 60;

// 📌 1) RICONOSCI FORMATO IMMAGINE
$info = getimagesize($baseTmp);
$type = $info[2];

// PHP GD sul tuo sistema NON supporta JPEG → quindi solo PNG
if ($type !== IMAGETYPE_PNG) {
  die("Errore: la tua installazione PHP non supporta JPG. Carica un'immagine PNG.");
}

$imgBase = imagecreatefrompng($baseTmp);

$width  = imagesx($imgBase);
$height = imagesy($imgBase);

// 📌 2) PER OGNI NOME CREA LA COPIA E SCRIVI IL TESTO
foreach ($listaNomi as $nome) {

  // Crea copia dell'immagine base
  $img = imagecreatetruecolor($width, $height);
  imagecopy($img, $imgBase, 0, 0, 0, 0, $width, $height);

  $color = imagecolorallocate($img, $R, $G, $B);

  if (file_exists($font)) {
    imagettftext($img, $fontSize, 0, $textX, $textY, $color, $font, $nome);
  } else {
    imagestring($img, 5, $textX, $textY - 20, $nome, $color);
  }

  $safe = preg_replace("/[^a-zA-Z0-9_-]/", "_", $nome);
  $path = $outputFolder . $safe . ".png";

  imagepng($img, $path);
  imagedestroy($img);
}

imagedestroy($imgBase);

echo "<h2>Biglietti generati con successo 🎄✨</h2>";
echo "Li trovi nella cartella <b>output</b>";
