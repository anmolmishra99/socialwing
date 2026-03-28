// src/components/layout/GovernmentLayout.tsx
import React from 'react';
import collectorOfficeImage from '../../assets/collector-office.jpeg';

const GovernmentLayout = ({ 
  children, 
  title = "SARAL Bhoomi",
  subtitle = "System for Automated Resourceful Acquisition of Land"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative">
      {/* Blurred Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={collectorOfficeImage} 
          alt="Collector Office Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/70 to-orange-50/40"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default GovernmentLayout;