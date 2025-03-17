<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$counterFile = 'visitorCount.txt';

// Initialize counter if file doesn't exist
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment counter
    $count = (int)file_get_contents($counterFile);
    $count++;
    file_put_contents($counterFile, (string)$count);
    echo json_encode(['count' => $count]);
} else {
    // Get current count
    $count = (int)file_get_contents($counterFile);
    echo json_encode(['count' => $count]);
}
?>
