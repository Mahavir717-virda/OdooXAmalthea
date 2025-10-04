<?php
// Database configuration
$host = "localhost";
$user = "root";        // your MySQL username
$pass = "";            // your MySQL password
$db_name = "expense_management";

// Create connection
$conn = new mysqli($host, $user, $pass, $db_name, 3306);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed']));
}

// Get the POST data (JSON)
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    die(json_encode(['status' => 'error', 'message' => 'No data received']));
}

// Validate required fields
if (empty($data['fullName']) || empty($data['email']) || empty($data['password']) || empty($data['country'])) {
    die(json_encode(['status' => 'error', 'message' => 'Please fill all required fields']));
}

// Sanitize input
$name = $conn->real_escape_string($data['fullName']);
$email = $conn->real_escape_string($data['email']);
$country = $conn->real_escape_string($data['country']);
$password = password_hash($data['password'], PASSWORD_BCRYPT); // Hash password
$role = 'Employee'; // default role
$company_id = 0;    // default, update as needed
$company_name = NULL;

// Check if email already exists
$checkEmail = $conn->query("SELECT user_id FROM users WHERE email='$email'");
if ($checkEmail->num_rows > 0) {
    die(json_encode(['status' => 'error', 'message' => 'Email already registered']));
}

// Insert into database
$sql = "INSERT INTO users (company_id, name, email, country, company_name, password, role) 
        VALUES ('$company_id', '$name', '$email', '$country', '$company_name', '$password', '$role')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Account created successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create account: ' . $conn->error]);
}

$conn->close();
?>
