import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full bg-warm-beige py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl md:text-6xl text-warm-espresso mb-4">
                Privacy Policy
              </h1>
              <p className="font-paragraph text-lg text-muted-gray max-w-3xl">
                Last updated: January 22, 2026
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Introduction */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Introduction
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  Welcome to our Privacy Policy page. Your privacy is critically important to us. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you visit our website and use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Information We Collect
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We collect information that you provide directly to us when you:
                </p>
                <ul className="font-paragraph text-base text-muted-gray leading-relaxed list-disc pl-6 space-y-2">
                  <li>Fill out contact forms on our website</li>
                  <li>Request information about our properties</li>
                  <li>Subscribe to our newsletters or marketing communications</li>
                  <li>Participate in surveys or promotional activities</li>
                  <li>Communicate with us via email or phone</li>
                </ul>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed mt-4">
                  The types of information we may collect include your name, email address, 
                  phone number, postal address, and any other information you choose to provide.
                </p>
              </div>

              {/* How We Use Your Information */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  How We Use Your Information
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="font-paragraph text-base text-muted-gray leading-relaxed list-disc pl-6 space-y-2">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you information about our properties and services</li>
                  <li>Process your requests and transactions</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Information Sharing and Disclosure
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information with:
                </p>
                <ul className="font-paragraph text-base text-muted-gray leading-relaxed list-disc pl-6 space-y-2">
                  <li>Service providers who assist us in operating our website and conducting our business</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Data Security
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or 
                  destruction. However, no method of transmission over the internet or electronic 
                  storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Your Rights
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  You have the right to:
                </p>
                <ul className="font-paragraph text-base text-muted-gray leading-relaxed list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Withdraw consent for marketing communications at any time</li>
                </ul>
              </div>

              {/* Cookies */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Cookies and Tracking Technologies
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website 
                  and store certain information. You can instruct your browser to refuse all cookies 
                  or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                  you may not be able to use some portions of our website.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Children's Privacy
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not 
                  knowingly collect personal information from children. If you are a parent or 
                  guardian and believe your child has provided us with personal information, 
                  please contact us.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Changes to This Privacy Policy
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new Privacy Policy on this page and updating the "Last 
                  updated" date at the top of this policy.
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h2 className="font-heading text-3xl text-warm-espresso">
                  Contact Us
                </h2>
                <p className="font-paragraph text-base text-muted-gray leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us through the contact form on our website or reach out to us 
                  directly.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
