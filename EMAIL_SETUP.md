# Email Notification Setup Guide

## 📧 Email Configuration

To enable email notifications when appointments are assigned, you need to configure email credentials in your environment variables.

### 1. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to .env file**:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 2. Other Email Services

#### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Custom SMTP
```env
EMAIL_HOST=smtp.your-domain.com
EMAIL_PORT=587
EMAIL_USER=your-email@your-domain.com
EMAIL_PASS=your-password
```

### 3. Environment Variables

Add these to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: Custom email settings
EMAIL_FROM_NAME=Elderly Personal Assistance
EMAIL_FROM_ADDRESS=noreply@elderlycare.com
```

### 4. Install Dependencies

Make sure nodemailer is installed:

```bash
cd backend
npm install nodemailer
```

### 5. Test Email Functionality

You can test email sending by:

1. **Assign an appointment** in the admin dashboard
2. **Check server logs** for email sending confirmation
3. **Check recipient email** (assistant and customer)

### 6. Email Templates

The system sends two types of emails:

#### For Assistants:
- **Subject**: "New Appointment Assignment - Elderly Personal Assistance"
- **Content**: Appointment details and instructions to log in

#### For Customers:
- **Subject**: "Assistant Assigned to Your Appointment - Elderly Personal Assistance"
- **Content**: Assistant information and appointment confirmation

### 7. Production Setup

For production, consider using:
- **SendGrid** - Reliable email service
- **AWS SES** - Amazon's email service
- **Mailgun** - Email API service

### 8. Troubleshooting

**Common Issues:**

1. **"Invalid login"** - Check app password is correct
2. **"Connection refused"** - Check firewall/network settings
3. **Emails not received** - Check spam folder

**Debug Mode:**
Enable email debugging in the console by checking server logs when assignments are made.

### 9. Security Notes

- ✅ Never commit email credentials to git
- ✅ Use app passwords, not regular passwords
- ✅ Use environment variables for all credentials
- ✅ Consider using OAuth2 for production

### 10. Email Service Comparison

| Service | Free Tier | Setup Difficulty | Reliability |
|---------|-----------|------------------|-------------|
| Gmail | 100 emails/day | Easy | High |
| SendGrid | 100 emails/day | Medium | Very High |
| AWS SES | 200 emails/day | Hard | Very High |
| Mailgun | 100 emails/day | Medium | High |

Choose based on your needs and technical expertise!
