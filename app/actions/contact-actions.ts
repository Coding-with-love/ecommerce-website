"use server"

import sgMail from "@sendgrid/mail"

// Define the type for the form data
type ContactFormData = {
  name: string
  email: string
  phone: string
  inquiry: string
  message: string
}

/**
 * Server action to send contact form data via SendGrid
 */
export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate the form data
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        message: "Please fill out all required fields",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    // Check for SendGrid API key
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
      console.error("SendGrid API key is missing")
      return {
        success: false,
        message: "Email service configuration error. Please contact the administrator.",
      }
    }

    // Set the API key
    sgMail.setApiKey(apiKey)

    // Format the inquiry type for better readability
    const inquiryType = formData.inquiry.charAt(0).toUpperCase() + formData.inquiry.slice(1)

    // Create the email message
    const msg = {
      to: process.env.EMAIL_TO, // Your business email
      from: process.env.EMAIL_TO, // Verified sender email in SendGrid
      replyTo: formData.email, // Set reply-to as the customer's email
      subject: `New ${inquiryType} Inquiry from ${formData.name}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Inquiry Type: ${inquiryType}
Message:
${formData.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
  <hr style="border: 1px solid #eee; margin: 20px 0;">
  <p><strong>Name:</strong> ${formData.name}</p>
  <p><strong>Email:</strong> ${formData.email}</p>
  <p><strong>Phone:</strong> ${formData.phone}</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ccc; margin: 20px 0;">
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\n/g, "<br>")}</p>
  </div>
  <hr style="border: 1px solid #eee; margin: 20px 0;">
  <p style="color: #777; font-size: 12px;">This email was sent from the contact form on Modest Threads website.</p>
</div>
      `,
    }

    // Send the email
    await sgMail.send(msg)

    // Log success (but don't include sensitive data)
    console.log(`Contact form submission successful from ${formData.email}`)

    return {
      success: true,
      message: "Message sent successfully",
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error sending email via SendGrid:", error)

    // Check if it's a SendGrid API error
    if (error.response && error.response.body) {
      console.error("SendGrid API error details:", error.response.body)
    }

    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    }
  }
}

