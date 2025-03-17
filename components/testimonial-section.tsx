"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    content:
      "The quality and craftsmanship of my abaya exceeded all expectations. The attention to detail in the embroidery is simply exquisite.",
    name: "Sarah Ahmed",
    location: "Dubai, UAE",
  },
  {
    id: 2,
    content:
      "I've received countless compliments on my Modest Threads abaya. The fabric is luxurious and the fit is perfect. I'll definitely be ordering more.",
    name: "Aisha Khan",
    location: "London, UK",
  },
  {
    id: 3,
    content:
      "The customer service was exceptional and my custom order was handled with such care. The final piece is even more beautiful than I imagined.",
    name: "Fatima Rahman",
    location: "Toronto, Canada",
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <Quote className="h-12 w-12 mx-auto mb-8 opacity-20" />
        <div className="relative min-h-[200px] flex items-center justify-center">
          <div className="transition-all duration-500" style={{ opacity: 1 }}>
            <p className="text-xl md:text-2xl font-serif italic mb-8">"{testimonials[currentIndex].content}"</p>
            <div>
              <p className="font-medium">{testimonials[currentIndex].name}</p>
              <p className="text-sm opacity-70">{testimonials[currentIndex].location}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous testimonial</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next testimonial</span>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

