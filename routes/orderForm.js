import express from 'express';
import OrderForm from '../model/OrderFormSchema.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: process.env.SERVICES,
  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_SMTP_PASSWORD,
  }
});

router.post('/submitForm', async (req, res) => {
  try {
    const { fullName, contact, email, location } = req.body;

    // Validate the incoming request body
    if (!fullName || !contact || !email || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const formData = {
      fullName,
      contact,
      email,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    const mailOptions = {
      from: email,
      to: [
        'daniel.jojo-koomson@outlook.com', 
        // 'christian.abbosey@smartinfraco.com', 
        'apps@smartinfraco.com', 
        'd.koomson@smartinfraco.com'
      ],
      subject: 'Internet Service Request ',
      text: `
        Customer Request Details
        -------------------------
        
        Full Name: ${fullName}
        Contact: ${contact}
        Email: ${email}
        Latitude: ${location.latitude}
        Longitude: ${location.longitude}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // Save form data to MongoDB
    const savedOrderForm = await OrderForm.create(formData);
    console.log('Form data saved to MongoDB:', savedOrderForm);

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    if (error.message.includes('email')) {
      res.status(400).json({ error: 'Email sending failed' });
    } else if (error.message.includes('validation')) {
      res.status(400).json({ error: 'Validation error' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
