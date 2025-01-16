const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlogQuill OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            color: #007BFF;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            margin: 0 0 20px;
            text-align: center;
        }
        .footer {
            background-color: #f0f0f0;
            color: #666;
            text-align: center;
            padding: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BlogQuill</h1>
        </div>
        <div class="content">
            <h2>BlogQuill || OTP VERIFICATION MAIL</h2>
            <p>Dear User,</p>
            <p>Thank you for signing up with BlogQuill! To complete your registration, please use the OTP below to verify your email address.</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 5 minutes. Please do not share this code with anyone.</p>
            <p>If you did not request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 BlogQuill. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = { otpEmailTemplate };
