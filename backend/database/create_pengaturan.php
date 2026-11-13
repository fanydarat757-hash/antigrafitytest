<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=skripsi_perpus', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS tb_pengaturan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama_pengaturan VARCHAR(50) NOT NULL UNIQUE,
        nilai VARCHAR(100) NOT NULL,
        keterangan VARCHAR(255) NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Insert or ignore initial settings
    $stmt = $pdo->prepare("INSERT INTO tb_pengaturan (nama_pengaturan, nilai, keterangan) 
        VALUES 
            ('tarif_denda', '1000', 'Tarif denda keterlambatan per hari per buku (Rupiah)'),
            ('durasi_pinjam', '7', 'Standar batas waktu durasi peminjaman buku (Hari)')
        ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
    $stmt->execute();

    echo "TABLE tb_pengaturan CREATED AND INITIALIZED SUCCESSFULLY\n";

    $rows = $pdo->query("SELECT * FROM tb_pengaturan")->fetchAll(PDO::FETCH_ASSOC);
    print_r($rows);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

