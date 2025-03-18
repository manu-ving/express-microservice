


export  const loginMailTemplate = (email : string,name : string ,deviceModel : string ,requestTime : string , platform : string) => `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f1f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .header { background-color: #008CFF; padding: 20px; text-align: center; }
        .header h1 { font-family: 'Luckiest Guy', cursive; color: #ffffff; margin: 0; font-size: 32px; }
        .content { padding: 30px 20px; text-align: center; color: #2e3842; }
        .content h2 { margin-bottom: 10px; color: #555; font-size: 24px; }
        .content p { margin: 10px 0; color: #555; }
        .button { display: inline-block; padding: 12px 24px; background-color: #008CFF; color: #ffffff; border-radius: 4px; text-decoration: none; font-weight: bold; }
        .info { background-color: #f1f4f6; padding: 20px; text-align: center; color: #555; font-size: 14px; }
        .footer { background-color: #f1f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        .footer .company-name span { font-family: 'Luckiest Guy', cursive; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VingLop</h1>
        </div>
        <div class="content">
            <h2>A new sign-in on ${deviceModel}</h2>
            <p><strong>${email}</strong></p>
            <hr>
            <p>We noticed a new sign-in on ${requestTime} to your VingLop account on an ${deviceModel} device ${platform}. If this was you, you don't need to do anything. If not, we’ll help you secure your account.</p>
            <a href="#" class="button">Check Activity</a>
        </div>
        <div class="info">
            <p>You can also see security activity at <a href="https://myaccount.vinglop.com/notifications">https://myaccount.vinglop.com/notifications</a></p>
        </div>
        <div class="footer">
            <p class="company-name">&copy; 2025 <span>VingLop</span>. All rights reserved.</p>
            <p>123 Street, City, Country</p>
        </div>
    </div>
</body>
</html>

    `


export const otpEmailTemplate = (otp : string) =>
    `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f1f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .header { background-color: #008CFF; padding: 20px; text-align: center; }
        .header img { width: 120px; }
        .header h1 { font-family: 'Luckiest Guy', cursive; color: #ffffff; margin: 0; font-size: 32px; }
        .content { padding: 40px 20px; text-align: center; color: #2e3842; }
        .content h2 { margin-bottom: 20px; color: #555; }
        .content .code { font-size: 36px; font-weight: bold; margin: 20px 0; }
        .content .expiry { font-size: 14px; color: #888; }
        .info { background-color: #f1f4f6; padding: 20px; text-align: center; color: #555; font-size: 14px; }
        .footer { background-color: #f1f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        .footer .company-name span { font-family: 'Luckiest Guy', cursive; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VingLop</h1>
        </div>
        <div class="content">
            <h2>Verification Code</h2>
            <div class="code">${otp}</div>
            <p class="expiry">(This code will expire 10 minutes after it was sent.)</p>
        </div>
        <div class="info">
            <p>VingLop will never email you and ask you to disclose or verify your password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link. Instead, report the email to VingLop for investigation.</p>
        </div>
        <div class="footer">
            <p class="company-name">&copy; 2025 <span>VingLop</span>. All rights reserved.</p>
            <p>123 Street, City, Country</p>
        </div>
    </div>
</body>
</html>

    `


export  const pureTextLoginMailTemplate = (name : string,deviceModel : string ,requestTime : string , platform : string)=>
    `
        "Successful Login: Explore New Arrivals and Exclusive Offers!",
                \`Hi ${name},\` +
                "\\n" +
                "We noticed a successful login to your [Your Store Name] account. If this was you, great! You're all set to explore the latest deals and exclusive offers.  \\n" +
                "\\n" +
                "**Login Details:**  \\n" +
                "- **Date & Time:** [${requestTime}]  \\n" +
                "- **Device:** [${deviceModel}]  \\n" +
                "- **PlatForm [${platform}]  \\n" +
                "\\n" +
                "If this wasn't you, we recommend securing your account immediately by resetting your password.  \\n" +
                "\\n" +
                "🔒 [For reset the  password goto -> settings -> resetPassword]  \\n" +
                "\\n" +
                "Thank you for choosing [VingLop]. Happy shopping!  \\n" +
                "\\n" +
                "Best regards,  \\n" +
                "The [VingLop] Team  ",
    `