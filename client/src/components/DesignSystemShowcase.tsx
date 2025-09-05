// src/components/DesignSystemShowcase.tsx
import React, { useState } from 'react';

const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [seniorMode, setSeniorMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={`${seniorMode ? 'senior-mode' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      <div className="container">
        {/* Header */}
        <header className="section">
          <h1 className="text-center">Virtual Gardening Companion Design System</h1>
          <div className="flex-center gap-md mb-lg">
            <button 
              className={`btn ${seniorMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSeniorMode(!seniorMode)}
            >
              {seniorMode ? 'Disable' : 'Enable'} Senior Mode
            </button>
            <button 
              className={`btn ${highContrast ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setHighContrast(!highContrast)}
            >
              {highContrast ? 'Disable' : 'Enable'} High Contrast
            </button>
          </div>
        </header>

        {/* Colors Section */}
        <section className="section">
          <h2 className="section-title">Color Palette</h2>
          <div className="grid grid-3">
            <ColorSwatch name="Primary Green" value="#008f58" />
            <ColorSwatch name="Secondary Green" value="#2fd88d" />
            <ColorSwatch name="Light Green" value="#a4f6ca" />
            <ColorSwatch name="Accent Green" value="#00bf63" />
            <ColorSwatch name="Black" value="#001000" />
            <ColorSwatch name="White" value="#ffffff" />
            <ColorSwatch name="Light Gray" value="#f8f9fa" />
            <ColorSwatch name="Medium Gray" value="#6c757d" />
            <ColorSwatch name="Border Gray" value="#e9ecef" />
            <ColorSwatch name="Success" value="#28a745" />
            <ColorSwatch name="Warning" value="#ffc107" />
            <ColorSwatch name="Error" value="#dc3545" />
            <ColorSwatch name="Info" value="#17a2b8" />
          </div>
        </section>

        {/* Typography Section */}
        <section className="section">
          <h2 className="section-title">Typography</h2>
          <div className="card">
            <h1>Heading 1 (28px Bold)</h1>
            <h2>Heading 2 (24px Semi-bold)</h2>
            <h3>Heading 3 (20px Semi-bold)</h3>
            <p className="text-body-large">Body Large (18px Regular)</p>
            <p>Body (16px Regular)</p>
            <p className="text-body-small">Body Small (14px Regular)</p>
            <p className="text-caption">Caption (12px Regular)</p>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="section">
          <h2 className="section-title">Buttons</h2>
          <div className="flex-center gap-md flex-wrap">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-primary" disabled>Disabled Button</button>
            <button className="btn btn-icon">
              <span className="icon">➕</span>
              Icon Button
            </button>
          </div>
        </section>

        {/* Cards Section */}
        <section className="section">
          <h2 className="section-title">Cards</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3>Standard Card</h3>
              <p>This is a standard card with some sample content. Cards are used to display related information in a contained format.</p>
            </div>
            
            <div className="card card--plant">
              <img 
                src="https://via.placeholder.com/80x80" 
                alt="Plant" 
                className="card__image"
              />
              <div className="card__content">
                <h3 className="card__title">Snake Plant</h3>
                <p className="card__description">Sansevieria trifasciata</p>
                <div className="flex gap-sm mt-sm">
                  <span className="status status--water">Water: 7 days</span>
                  <span className="status status--light">Low light</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="section">
          <h2 className="section-title">Form Elements</h2>
          <div className="grid grid-2">
            <div>
              <label htmlFor="standard-input" className="mb-sm">Standard Input</label>
              <input 
                id="standard-input"
                type="text" 
                className="input" 
                placeholder="Enter plant name..."
              />
            </div>
            <div>
              <label htmlFor="search-input" className="mb-sm">Search Input</label>
              <input 
                id="search-input"
                type="search" 
                className="input input--search" 
                placeholder="Search plants..."
              />
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="section">
          <h2 className="section-title">Navigation</h2>
          <div className="card">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'all' ? 'tab--active' : 'tab--inactive'}`}
                onClick={() => setActiveTab('all')}
              >
                All Plants
              </button>
              <button 
                className={`tab ${activeTab === 'indoor' ? 'tab--active' : 'tab--inactive'}`}
                onClick={() => setActiveTab('indoor')}
              >
                Indoor
              </button>
              <button 
                className={`tab ${activeTab === 'outdoor' ? 'tab--active' : 'tab--inactive'}`}
                onClick={() => setActiveTab('outdoor')}
              >
                Outdoor
              </button>
            </div>
            
            <div className="nav-bottom" style={{ position: 'relative', marginTop: '20px' }}>
              <a href="#garden" className="nav-item nav-item--active">
                <span className="nav-icon">🌿</span>
                <span>Garden</span>
              </a>
              <a href="#plants" className="nav-item">
                <span className="nav-icon">🌱</span>
                <span>Plants</span>
              </a>
              <a href="#tasks" className="nav-item">
                <span className="nav-icon">✅</span>
                <span>Tasks</span>
              </a>
              <a href="#profile" className="nav-item">
                <span className="nav-icon">👤</span>
                <span>Profile</span>
              </a>
            </div>
          </div>
        </section>

        {/* Status Indicators Section */}
        <section className="section">
          <h2 className="section-title">Status Indicators</h2>
          <div className="flex-center gap-md flex-wrap">
            <span className="status status--light">Needs Light</span>
            <span className="status status--water">Needs Water</span>
            <span className="status status--happy">Healthy</span>
            <span className="status status--angry">Needs Care</span>
          </div>
        </section>

        {/* Icons Section */}
        <section className="section">
          <h2 className="section-title">Icons</h2>
          <div className="flex-center gap-lg">
            <div className="text-center">
              <span className="icon icon-light">☀️</span>
              <p>Light</p>
            </div>
            <div className="text-center">
              <span className="icon icon-water">💧</span>
              <p>Water</p>
            </div>
            <div className="text-center">
              <span className="icon icon-happy">😊</span>
              <p>Happy</p>
            </div>
            <div className="text-center">
              <span className="icon icon-angry">😠</span>
              <p>Angry</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper component for color swatches
const ColorSwatch: React.FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="card">
    <div 
      className="mb-sm" 
      style={{ 
        backgroundColor: value, 
        height: '60px', 
        borderRadius: '8px',
        border: value === '#ffffff' ? '1px solid #e9ecef' : 'none'
      }}
    ></div>
    <h3 className="card__title">{name}</h3>
    <p className="card__description">{value}</p>
  </div>
);

export default DesignSystemShowcase;