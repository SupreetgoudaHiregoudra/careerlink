const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// SEND CONTACT EMAIL
router.post("/send", async (req, res) => {
  try {

    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // VALIDATION
    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // EMAIL CONTENT
    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: "careerlinkadmin@gmail.com",

      subject: `CareerLink Contact: ${subject}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Message</h2>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <p>${message}</p>
        </div>
      `,
    };

    // SEND MAIL
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Message sent successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
});

module.exports = router;