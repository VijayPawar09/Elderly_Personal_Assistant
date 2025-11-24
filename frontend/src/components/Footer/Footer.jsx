import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AboutFooter = () => {
  return (
    <div className="bg-gradient-to-r from-purple-300 via-purple-500 to-purple-600">
      <section id="about" className="py-5 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6">
            About Us
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform is designed to assist elderly individuals with their
            day-to-day tasks through the support of our trusted assistants.
            Whether it's managing medications, scheduling appointments, or
            simply offering companionship, our mission is to empower seniors to
            live independently with dignity, comfort, and peace of mind.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="Contact" className="bg-gray-100 text-gray-800 mt-[-1px]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & Tagline */}
          <div>
            <h1 className="text-2xl font-bold text-indigo-700 mb-2">
              Personal Assistance
            </h1>
            <p className="text-gray-600">
              Your reliable assistant for everyday tasks of elderly people.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Contact
            </h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-600" />
                vijayp8477@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-indigo-600" />
                +91 84599-35504
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" />
                123 Assistance Tower, Pune
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Follow Us
            </h2>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-3 bg-white border border-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-3 bg-white border border-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition duration-300 shadow-sm"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-3 bg-white border border-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Personal Assistance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AboutFooter;
