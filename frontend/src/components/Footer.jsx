import React from 'react';
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';

const defaultConfig = {
  logo: {
    text: 'SwasthyaSewa',
    subtitle: 'Advanced Smart Clinic Management System',
  },
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Cancellation & Refund Policy', href: '/cancellation-refund-policy' },
    { label: 'Return & Refund Policy', href: '/return-refund-policy' },
  ],
  services: [
    { label: 'Online Appointment Booking', href: '/doctors' },
    { label: 'Patient & Doctor Records', href: '/MyProfile' },
  ],
  contact: {
    address: '1st Floor, NH-21, Booty More, Ranchi, Jharkhand 835217',
    phones: ['+91 8092599674'],
    email: 'support@swasthyasewa.com',
  },
  socials: [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
  ],
  copyright: '© 2026 SwasthyaSewa. All rights reserved.',
};

export function Footer({ config = {} }) {
  const finalConfig = { ...defaultConfig, ...config };

  return (
    <footer className="bg-white text-slate-900 border-t border-gray-100 mt-16">
      <div className="w-full py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                Swasthya<span className="text-primary">Sewa</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {finalConfig.logo.subtitle}
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              {finalConfig.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {finalConfig.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-2.5 group-hover:w-2.5 transition-all duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 tracking-wide">Our Services</h4>
            <ul className="space-y-2.5">
              {finalConfig.services.map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={service.href}
                    className="text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-2.5 group-hover:w-2.5 transition-all duration-200"></span>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 tracking-wide">Contact Info</h4>
            <div className="flex gap-2.5 text-xs sm:text-sm">
              <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-slate-600 leading-relaxed">
                {finalConfig.contact.address}
              </p>
            </div>
            {finalConfig.contact.phones.map((phone, idx) => (
              <div key={idx} className="flex gap-2.5 text-xs sm:text-sm items-center">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a
                  href={`tel:${phone}`}
                  className="text-slate-600 hover:text-primary transition"
                >
                  {phone}
                </a>
              </div>
            ))}

            <div className="flex gap-2.5 text-xs sm:text-sm items-center">
              <Mail size={18} className="text-primary flex-shrink-0" />
              <a
                href={`mailto:${finalConfig.contact.email}`}
                className="text-slate-600 hover:text-primary transition break-all"
              >
                {finalConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200 my-6"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>{finalConfig.copyright}</p>
          <p>Made with care for modern clinics</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;