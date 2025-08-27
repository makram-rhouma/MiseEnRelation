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
$required_fields = ['name', 'company', 'email', 'phone', 'service'];
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
$company = htmlspecialchars(trim($input['company']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($input['phone']));
$service = htmlspecialchars(trim($input['service']));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Service names mapping
$services = [
    'lodge' => 'Beehive Lodge',
    'service' => 'Beehive Service', 
    'store' => 'Beehive Store',
    'all' => 'Tous les services'
];

$service_name = isset($services[$service]) ? $services[$service] : $service;

// Email configuration
$to = 'demo@beehivegroup.com'; // Change to your actual email
$subject = 'Nouvelle demande de démonstration - Beehive Group';
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
        .service-badge { background: #D4A017; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .footer { background: #333; color: white; text-align: center; padding: 20px; border-radius: 0 0 10px 10px; }
        .priority { background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐝 Beehive Group</h1>
            <p><span class="priority">PRIORITÉ ÉLEVÉE</span></p>
            <h2>Nouvelle Demande de Démonstration</h2>
        </div>
        <div class="content">
            <div class="field">
                <label>Nom du contact:</label>
                <div>' . $name . '</div>
            </div>
            <div class="field">
                <label>Entreprise:</label>
                <div>' . $company . '</div>
            </div>
            <div class="field">
                <label>Email:</label>
                <div><a href="mailto:' . $email . '">' . $email . '</a></div>
            </div>
            <div class="field">
                <label>Téléphone:</label>
                <div><a href="tel:' . $phone . '">' . $phone . '</a></div>
            </div>
            <div class="field">
                <label>Service d\'intérêt:</label>
                <div><span class="service-badge">' . $service_name . '</span></div>
            </div>
            <div class="field" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px;">
                <h3 style="margin-top: 0; color: #D4A017;">Actions recommandées:</h3>
                <ul>
                    <li>Contacter le prospect dans les 2h</li>
                    <li>Programmer la démonstration dans les 24-48h</li>
                    <li>Préparer les supports pour: <strong>' . $service_name . '</strong></li>
                    <li>Envoyer un email de confirmation</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>Demande reçue le ' . date('d/m/Y à H:i') . '</p>
            <p><strong>⚡ Réponse requise sous 2h maximum</strong></p>
            <p><em>Beehive Group - Sales Team</em></p>
        </div>
    </div>
</body>
</html>';

// Send email
try {
    $mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        // Log successful submission
        error_log("Demo request from: $email ($company) - Service: $service_name");
        
        // Send confirmation email to client
        $client_subject = 'Confirmation - Demande de démonstration Beehive Group';
        $client_body = '
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4A017, #B8860B); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #333; color: white; text-align: center; padding: 20px; border-radius: 0 0 10px 10px; }
        .highlight { background: #fff3cd; border-left: 4px solid #D4A017; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐝 Beehive Group</h1>
            <h2>Demande de Démonstration Confirmée</h2>
        </div>
        <div class="content">
            <p>Bonjour <strong>' . $name . '</strong>,</p>
            
            <p>Nous avons bien reçu votre demande de démonstration pour <strong>' . $service_name . '</strong>.</p>
            
            <div class="highlight">
                <h3 style="margin-top: 0;">🚀 Prochaines étapes:</h3>
                <ol>
                    <li>Un de nos experts vous contactera dans les <strong>2 heures</strong></li>
                    <li>Nous programmerons ensemble votre démonstration personnalisée</li>
                    <li>Vous découvrirez comment Beehive Group peut transformer votre activité</li>
                </ol>
            </div>
            
            <p><strong>Informations de contact d\'urgence:</strong><br>
            📧 demo@beehivegroup.com<br>
            📞 +33 1 23 45 67 89</p>
            
            <p>Merci pour votre intérêt envers Beehive Group!</p>
            
            <p>Cordialement,<br>
            <strong>L\'équipe Beehive Group</strong></p>
        </div>
        <div class="footer">
            <p>Beehive Group - Votre partenaire digital premium</p>
        </div>
    </div>
</body>
</html>';
        
        $client_headers = [
            'From: demo@beehivegroup.com',
            'Reply-To: demo@beehivegroup.com',
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        mail($email, $client_subject, $client_body, implode("\r\n", $client_headers));
        
        echo json_encode([
            'success' => true, 
            'message' => 'Demande de démonstration envoyée avec succès! Nous vous contacterons dans les 2 heures.',
            'data' => [
                'service' => $service_name,
                'contact_time' => '2 heures maximum'
            ]
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    error_log("Demo form error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de l\'envoi de la demande. Veuillez réessayer ou nous contacter directement.'
    ]);
}
?>
