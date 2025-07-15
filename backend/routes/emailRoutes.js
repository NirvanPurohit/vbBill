// backend/routes/emailRoutes.js
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import 'dotenv/config'
const router = express.Router();

// Configure multer for file upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});
// Remove this after debugging!
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  // For 
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

  // For other email providers, use SMTP settings:
  // host: 'smtp.your-email-provider.com',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS
  // }
});

// Route to send invoice email
router.post('/send-invoice-email', upload.single('file'), async (req, res) => {
  try {
    const { email, invoiceNo, customerName, invoiceDate, totalAmount } = req.body;
    const pdfFile = req.file;

    if (!email || !pdfFile || !invoiceNo) {
      return res.status(400).json({
        success: false,
        message: 'Email, PDF file, and invoice number are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const emailSubject = `Invoice #${invoiceNo} - ${customerName || 'Your Invoice'}`;
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
              Invoice Notification
            </h2>
            <p>Dear ${customerName || 'Valued Customer'},</p>
            <p>Please find attached your invoice with the following details:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Invoice Number:</td>
                  <td style="padding: 8px 0;">#${invoiceNo}</td>
                </tr>
                ${invoiceDate ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Invoice Date:</td>
                  <td style="padding: 8px 0;">${new Date(invoiceDate).toLocaleDateString()}</td>
                </tr>` : ''}
                ${totalAmount ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #27ae60;">₹${parseFloat(totalAmount).toFixed(2)}</td>
                </tr>` : ''}
              </table>
            </div>
            <p>If you have any questions regarding this invoice, please don't hesitate to contact us.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                Thank you for your business!<br>
                <strong>Your Company Name</strong><br>
                Email: support@yourcompany.com<br>
                Phone: +91-XXXXXXXXXX
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Your Company Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: emailBody,
      attachments: [
        {
          filename: pdfFile.originalname || `Invoice-${invoiceNo}.pdf`,
          content: pdfFile.buffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Invoice email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);

    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        message: 'Email authentication failed. Please check email credentials.'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        success: false,
        message: 'Unable to connect to email server. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
