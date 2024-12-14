import React from 'react';
import { FaFilePdf, FaRocket, FaCloud, FaUserAlt, FaIdCard, FaFileExport } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Multi-Format',
    description: 'Compatible with PDF, DOCX, XLSX, CSV, and TXT.',
    icon: <FaFilePdf className="text-red-500 text-6xl" />,
  },
  {
    title: 'Speed',
    description: 'Get results in seconds thanks to our AI technology.',
    icon: <FaRocket className="text-yellow-400 text-6xl" />,
  },
  {
    title: 'Cloud Integration',
    description: 'Direct access to Google Drive, Dropbox, and OneDrive.',
    icon: <FaCloud className="text-blue-400 text-6xl" />,
  },
  {
    title: 'Intuitive Interface',
    description: 'Designed for ease of use by anyone.',
    icon: <FaUserAlt className="text-green-500 text-6xl" />,
  },
  {
    title: 'Sensitive Data Recognition',
    description: 'Extract data like names, birthdates, and more.',
    icon: <FaIdCard className="text-purple-400 text-6xl" />,
  },
  {
    title: 'Custom Export',
    description: 'Download results in JSON, CSV, or Excel.',
    icon: <FaFileExport className="text-teal-400 text-6xl" />,
  },
];

const Features = () => {
  return (
    <section className="features py-20 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-white">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-xl"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.5 }}
                className="icon text-6xl mb-4 text-white hover:text-yellow-400 transition-all"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
