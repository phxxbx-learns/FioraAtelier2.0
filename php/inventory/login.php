<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    if ($stmt->rowCount() == 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // For demo - password is 'password'
        if ($password === 'password' || password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'];
            
            // Update last login
            $update_query = "UPDATE users SET last_login = NOW() WHERE id = :id";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(':id', $user['id']);
            $update_stmt->execute();
            
            header("Location: dashboard.php");
            exit();
        } else {
            $error = "Invalid password!";
        }
    } else {
        $error = "User not found!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .login-container { max-width: 400px; margin: 100px auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .login-header h1 { color: #867070; font-family: 'Playfair Display', serif; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: #5D4037; font-weight: 600; }
        .form-group input { width: 100%; padding: 0.8rem; border: 2px solid #E4D0D0; border-radius: 5px; font-size: 1rem; }
        .btn-login { width: 100%; padding: 1rem; background: #867070; color: white; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; transition: background 0.3s; }
        .btn-login:hover { background: #D5B4B4; }
        .error { color: #e74c3c; text-align: center; margin-bottom: 1rem; }
        .demo-credentials { background: #F5EBEB; padding: 1rem; border-radius: 5px; margin-top: 1rem; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Fiora Atelier</h1>
            <p>Inventory Management System</p>
        </div>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required value="admin">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required value="password">
            </div>
            
            <button type="submit" class="btn-login">Login</button>
        </form>
        
        <div class="demo-credentials">
            <strong>Demo Credentials:</strong><br>
            Username: admin<br>
            Password: password
        </div>
    </div>
</body>
</html>