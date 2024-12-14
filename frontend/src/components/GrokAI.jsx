import React from 'react';
import { motion } from 'framer-motion';

const GrokAI = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg">
        {/* Testo */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Grok AI at the Core of Technology
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            DocMorph AI harnesses the power of Grok AI, an advanced artificial intelligence engine. It's designed to understand complex document content and deliver precise results.
          </p>
          <p className="text-lg text-gray-300">
            Grok AI not only analyzes files but also reprocesses them with utmost precision, ensuring accurate and reliable outputs.
          </p>
        </motion.div>
        {/* Immagine */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src="/assets/images/grok.png"
            alt="Grok AI Technology"
            className="w-full mx-auto rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-yellow-400/50"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GrokAI;
