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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isEnglishOnly = (text: string): boolean => {
    // Allow only English letters, numbers, spaces, and common punctuation
    const englishRegex = /^[a-zA-Z0-9\s.,!?'\"-]*$/;
    return englishRegex.test(text);
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply restrictions only to message field
    if (name === 'message') {
      // Check if input is English only
      if (!isEnglishOnly(value)) {
        return;
      }
      
      // Check word limit (10 words max)
      if (countWords(value) > 10) {
        return;
      }
    }
    
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
        submissionDate: new Date(),
      });

      setSubmitSuccess(true);
      setFormData({ name: '', phoneNumber: '', email: '' });

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
            className="fixed inset-0 bg-black/60 z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="bg-background border border-foreground/20 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-foreground/20 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
                <h2 className="font-heading text-xl sm:text-2xl text-foreground">Get In Touch</h2>
                <button
                  onClick={onClose}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-muted-forest-green/20 border border-muted-forest-green rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-5 sm:w-6 h-5 sm:h-6 text-muted-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">Thank You!</h3>
                    <p className="font-paragraph text-sm sm:text-base text-foreground/70">
                      We've received your message. Our team will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block font-paragraph text-xs sm:text-sm text-foreground/90 mb-2 font-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-foreground/15 border border-foreground/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-paragraph text-sm sm:text-base text-warm-espresso placeholder-foreground/50 focus:outline-none focus:border-primary focus:bg-foreground/20 transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-paragraph text-xs sm:text-sm text-foreground/90 mb-2 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full bg-foreground/15 border border-foreground/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-paragraph text-sm sm:text-base text-warm-espresso placeholder-foreground/50 focus:outline-none focus:border-primary focus:bg-foreground/20 transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-paragraph text-xs sm:text-sm text-foreground/90 mb-2 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-foreground/15 border border-foreground/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-paragraph text-sm sm:text-base text-warm-espresso placeholder-foreground/50 focus:outline-none focus:border-primary focus:bg-foreground/20 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-black hover:bg-primary/90 font-paragraph text-sm sm:text-base py-2 sm:py-3 rounded-lg mt-4 sm:mt-6 transition-all"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="font-paragraph text-xs text-foreground/30 text-center mt-3 sm:mt-4">
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
