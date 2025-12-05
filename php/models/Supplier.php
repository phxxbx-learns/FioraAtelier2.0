<?php
class Supplier {
    private $conn;
    private $table_name = "suppliers";

    public $id;
    public $name;
    public $contact_person;
    public $email;
    public $phone;
    public $address;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all suppliers
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Create supplier
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, contact_person=:contact_person, email=:email,
                      phone=:phone, address=:address";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":contact_person", $this->contact_person);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        
        return $stmt->execute();
    }
}
?>