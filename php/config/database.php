<?php
class Database {
    // Your InfinityFree database settings
    private $host = "sql100.infinityfree.com";
    private $db_name = "if0_40560963_fiora_atelier";
    private $username = "if0_40560963";
    private $password = "cq5skuuiPdSc";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            // Don't show errors to users
            error_log("Database error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>