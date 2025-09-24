<?php
// This would be shown only after login and verifying is_admin
$conn = new mysqli("localhost", "root", "", "user_system");

$sql = "SELECT id, username, email, created_at FROM users";
$result = $conn->query($sql);

echo "<h2>All Users</h2>";
while ($row = $result->fetch_assoc()) {
    echo "ID: {$row['id']} - {$row['username']} - {$row['email']}<br>";
}
?>