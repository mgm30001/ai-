import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import StyleSelection from './components/style/StyleSelectionFixed';
import CreationInput from './components/creation/CreationInput';
import Interaction from './components/interaction/Interaction';
import NovelLibrary from './components/library/NovelLibrary';
import TestComponent from './components/TestComponent';
import InstallPWA from './components/shared/InstallPWA';

function App() {
  const [activeTab, setActiveTab] = useState('style');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleNextStep = () => {
    switch (activeTab) {
      case 'style':
        setActiveTab('create');
        break;
      case 'create':
        setActiveTab('interact');
        break;
      case 'interact':
        setActiveTab('library');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        className="sticky top-0 z-50"
      />
      <InstallPWA />
      <main className="container mx-auto px-4 py-8">
        {process.env.NODE_ENV === 'development' && <TestComponent />}
        {activeTab === 'style' && (
          <StyleSelection 
            onStyleSelect={handleStyleSelect} 
            onNextStep={handleNextStep} 
          />
        )}        {activeTab === 'create' && (
          <CreationInput 
            selectedStyle={selectedStyle} 
            onPrevStep={() => setActiveTab('style')}
            onNextStep={handleNextStep}
          />
        )}        {activeTab === 'interact' && (
          <Interaction 
            onPrevStep={() => setActiveTab('create')}
            onNextStep={handleNextStep}
          />
        )}
        {activeTab === 'library' && (
          <NovelLibrary />
        )}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}

export default App;
