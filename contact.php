<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$required_fields = ['name', 'email', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Sanitize input
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($input['phone']) ? htmlspecialchars(trim($input['phone'])) : '';
$message = htmlspecialchars(trim($input['message']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'contact@beehivegroup.com'; // Change to your actual email
$subject = 'Nouveau message de contact - Beehive Group';
$headers = [
    'From: noreply@beehivegroup.com',
    'Reply-To: ' . $email,
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

// Email template
$email_body = '
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4A017, #B8860B); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
        .field { margin-bottom: 20px; }
        .field label { font-weight: bold; color: #D4A017; }
        .field div { background: white; padding: 10px; border-left: 4px solid #D4A017; margin-top: 5px; }
        .footer { background: #333; color: white; text-align: center; padding: 20px; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐝 Beehive Group</h1>
            <p>Nouveau message de contact</p>
        </div>
        <div class="content">
            <div class="field">
                <label>Nom:</label>
                <div>' . $name . '</div>
            </div>
            <div class="field">
                <label>Email:</label>
                <div>' . $email . '</div>
            </div>
            ' . ($phone ? '<div class="field"><label>Téléphone:</label><div>' . $phone . '</div></div>' : '') . '
            <div class="field">
                <label>Message:</label>
                <div>' . nl2br($message) . '</div>
            </div>
        </div>
        <div class="footer">
            <p>Message reçu le ' . date('d/m/Y à H:i') . '</p>
            <p><em>Beehive Group - Votre partenaire digital premium</em></p>
        </div>
    </div>
</body>
</html>';

// Send email
try {
    $mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        // Log successful submission
        error_log("Contact form submission from: $email");
        
        echo json_encode([
            'success' => true, 
            'message' => 'Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    ]);
}
?>
