import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BaseCrudService } from '@/integrations';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await BaseCrudService.create('contactformsubmissions', {
        _id: crypto.randomUUID(),
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message,
        submissionDate: new Date(),
      });

      setSubmitSuccess(true);
      setFormData({ name: '', phoneNumber: '', email: '', message: '' });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="bg-background border border-white/10 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-white/10 px-6 py-6 flex justify-between items-center">
                <h2 className="font-heading text-2xl text-pearl-ivory">Get In Touch</h2>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-12 h-12 bg-muted-forest-green/20 border border-muted-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-muted-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl text-pearl-ivory mb-2">Thank You!</h3>
                    <p className="font-paragraph text-champagne-beige/70">
                      We've received your message. Our team will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                        placeholder="Tell us about your interest in Meenakshi Pearl..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-black hover:bg-primary/90 font-paragraph text-base py-3 rounded-lg mt-6 transition-all"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="font-paragraph text-xs text-white/30 text-center mt-4">
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
