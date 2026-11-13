<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=skripsi_perpus', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

try {
    $pdo->exec("ALTER TABLE tb_pengembalian 
        ADD COLUMN metode_pembayaran VARCHAR(50) DEFAULT 'Tunai Loket' AFTER status_denda,
        ADD COLUMN id_transaksi_gateway VARCHAR(100) NULL AFTER metode_pembayaran,
        ADD COLUMN waktu_bayar DATETIME NULL AFTER id_transaksi_gateway");
    echo "COLUMNS ADDED SUCCESSFULLY\n";
} catch (Exception $e) {
    echo "NOTE: " . $e->getMessage() . "\n";
}

$stmt = $pdo->query("DESCRIBE tb_pengembalian");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

