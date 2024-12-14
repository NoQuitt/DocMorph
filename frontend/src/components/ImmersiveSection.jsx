import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const ImmersiveSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-parallax"
        style={{ y: y1 }}
      ></motion.div>
      <motion.div
        className="absolute top-0 right-0 w-full h-full bg-parallax-secondary"
        style={{ y: y2 }}
      ></motion.div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <h2 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
          A New Way of Thinking About Documents
        </h2>
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-gradient">
          <Typewriter
            words={[
              "Simplify document management.",
              "Save time with DocMorph AI.",
              "Harness the power of artificial intelligence.",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h2>
      </div>
    </section>
  );
};

export default ImmersiveSection;
