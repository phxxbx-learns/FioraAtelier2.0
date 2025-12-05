<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $description;
    public $price;
    public $category;
    public $image;
    public $stock_quantity;
    public $min_stock_level;
    public $supplier_id;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all products
    public function read() {
        $query = "SELECT p.*, s.name as supplier_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN suppliers s ON p.supplier_id = s.id 
                  ORDER BY p.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Read single product
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->category = $row['category'];
            $this->image = $row['image'];
            $this->stock_quantity = $row['stock_quantity'];
            $this->min_stock_level = $row['min_stock_level'];
            $this->supplier_id = $row['supplier_id'];
            return true;
        }
        return false;
    }

    // Update product stock
    public function updateStock($quantity) {
        $query = "UPDATE " . $this->table_name . " 
                  SET stock_quantity = :quantity 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }

    // Get low stock products
    public function getLowStock() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE stock_quantity <= min_stock_level 
                  ORDER BY stock_quantity ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Update product
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = :name,
                      description = :description,
                      price = :price,
                      category = :category,
                      image = :image,
                      stock_quantity = :stock_quantity,
                      min_stock_level = :min_stock_level,
                      supplier_id = :supplier_id
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':image', $this->image);
        $stmt->bindParam(':stock_quantity', $this->stock_quantity);
        $stmt->bindParam(':min_stock_level', $this->min_stock_level);
        $stmt->bindParam(':supplier_id', $this->supplier_id);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }
}
?>