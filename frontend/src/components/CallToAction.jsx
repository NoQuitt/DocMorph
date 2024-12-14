import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Try DocMorph AI Today!
        </motion.h2>
        <motion.p
          className="text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Revolutionize document management with tomorrow's technology, built for today's challenges.
        </motion.p>
        <div className="flex justify-center items-center space-x-8">
          <motion.a
            href="/application"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-8 bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-bold rounded-full shadow-lg hover:scale-125 transition-transform"
            whileHover={{ rotate: 15, scale: 1.2 }}
          >
            Get Started
          </motion.a>
          <motion.div
            className="text-center p-4 bg-opacity-20 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <p className="text-xl font-bold text-yellow-400">
              #HackTheFuture
            </p>
            <p className="text-sm text-gray-300">
              Conquer the Hackathon with DocMorph AI
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
