import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ImmersiveSection from '../components/ImmersiveSection';
import Security from '../components/Security';
import GrokAI from '../components/GrokAI';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import MagicCursor from '../components/MagicCursor';


function LandingPage() {
  return (
    <div className="bg-black text-white">
      <MagicCursor />
      <Hero />
      <HowItWorks />
      <Features />
      <Security />
      <ImmersiveSection />
      <GrokAI />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default LandingPage;
