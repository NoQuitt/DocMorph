import React from 'react';
import { motion } from 'framer-motion';

const Security = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 px-6 bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <motion.img
          src="/assets/images/security.png"
          alt="File Security"
          className="w-full mx-auto shadow-xl rounded-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-extrabold text-white mb-6">
            File Security Guaranteed
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            Security is our top priority. Uploaded files are processed securely and automatically removed.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Security;
