<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173"); // your React port
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
$host = "localhost";
$user = "root"; // XAMPP default user
$pass = "";     // XAMPP default password (empty)
$db_name = "expense_management";

$conn = new mysqli($host, $user, $pass, $db_name, 3306);
if ($conn->connect_error) {
    echo json_encode(['status'=>'error','message'=>'Database connection failed']);
    exit;
}

// Read JSON input
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$fullName = $data['fullName'] ?? '';
$email    = $data['email'] ?? '';
$country  = $data['country'] ?? '';
$password = $data['password'] ?? '';

// Validate fields
if (empty($fullName) || empty($email) || empty($password) || empty($country)) {
    echo json_encode(['status'=>'error','message'=>'Please fill all required fields']);
    exit;
}

// Sanitize + hash password
$fullName = $conn->real_escape_string($fullName);
$email    = $conn->real_escape_string($email);
$country  = $conn->real_escape_string($country);
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Default fields
$role = 'Employee';
$company_id = 0;
$company_name = NULL;

// Check duplicate email
$checkEmail = $conn->query("SELECT user_id FROM users WHERE email='$email'");
if ($checkEmail && $checkEmail->num_rows > 0) {
    echo json_encode(['status'=>'error','message'=>'Email already registered']);
    exit;
}

// Insert user
$sql = "INSERT INTO users (company_id, name, email, country, company_name, password, role)
        VALUES ('$company_id','$fullName','$email','$country','$company_name','$passwordHash','$role')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['status'=>'success','message'=>'Account created successfully']);
} else {
    echo json_encode(['status'=>'error','message'=>'Failed to create account: '.$conn->error]);
}

$conn->close();
?>
