import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Upload Your Documents',
    description:
      'Upload files in PDF, DOCX, XLSX, or CSV formats directly from your computer or cloud storage.',
    image: '/assets/extract.gif',
  },
  {
    title: 'Extract or Fill Data',
    description:
      'Extract sensitive data using AI or quickly fill in forms with relevant information.',
    image: '/assets/describe.gif',
  },
  {
    title: 'Download the Edited File',
    description: 'Download the completed and ready-to-use document in seconds.',
    image: '/assets/fill.gif',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-800 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-12 animate-pulse">
          How It Works
        </h2>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col lg:flex-row items-center justify-center space-y-10 lg:space-y-0 lg:space-x-10 ${
                index % 2 === 0 ? '' : 'lg:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 1 }}
            >
              <motion.img
                src={step.image}
                alt={step.title}
                className="w-11/12 sm:w-3/4 lg:w-1/3 rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="text-left px-4 sm:px-6 lg:px-8 max-w-xl">
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-lg text-gray-300 mt-4">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
