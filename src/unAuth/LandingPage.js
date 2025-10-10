import React from 'react';
import './LandingPage.css';
import NavBar from './components/NavBar';
import Bumpups from './components/Bumpups';
import Timestamp from './components/Timestamp';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="landing-container">
      <NavBar />
      <Bumpups />
      <Timestamp />
      <Footer />
    </div>
  );
}

export default LandingPage;
