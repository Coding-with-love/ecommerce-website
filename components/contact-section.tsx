"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Instagram, Mail, Phone } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact-actions"

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "general",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, inquiry: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Call the server action to send email via SendGrid
      const result = await sendContactEmail(formState)

      if (result.success) {
        setIsSubmitted(true)
        setFormState({
          name: "",
          email: "",
          phone: "",
          inquiry: "general",
          message: "",
        })
      } else {
        setError(result.message || "Failed to send message. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Contact form error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-serif">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-olive-100">
                    <Mail className="h-5 w-5 text-olive-800" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">modesthreads.co@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-olive-100">
                    <Instagram className="h-5 w-5 text-olive-800" />
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-muted-foreground">@modesthreads.co</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-olive-50 p-6">
              <h3 className="text-xl font-serif mb-4">How We Can Help</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-olive-800 font-medium">•</span>
                  <span>Information about our collection and pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive-800 font-medium">•</span>
                  <span>Custom order inquiries and consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive-800 font-medium">•</span>
                  <span>Sizing and fabric information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive-800 font-medium">•</span>
                  <span>Shipping and delivery questions</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border">
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 text-center">
                  <p className="font-medium text-lg">Thank you for your message!</p>
                  <p className="mt-2">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-center mb-4">
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="rounded-none"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="rounded-none"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      required
                      className="rounded-none"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inquiry">Type of Inquiry</Label>
                    <Select value={formState.inquiry} onValueChange={handleSelectChange}>
                      <SelectTrigger id="inquiry" className="rounded-none">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="product">Product Information</SelectItem>
                        <SelectItem value="custom">Custom Order</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="rounded-none"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-none" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

