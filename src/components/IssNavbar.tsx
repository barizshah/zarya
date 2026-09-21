import React from 'react';

export type CameraId = 'hd' | 'sd' | '4k';

interface IssNavbarProps {
  activeCamera: CameraId;
  onSelectCamera: (cam: CameraId) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const IssNavbar: React.FC<IssNavbarProps> = ({
  activeCamera,
  onSelectCamera,
  activeSection,
  onSelectSection,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const handleNavClick = (sectionId: string) => {
    onSelectSection(sectionId);
    onCloseMobileMenu();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCameraClick = (cam: CameraId) => {
    onSelectCamera(cam);
    onCloseMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[1999] md:hidden transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar navigation */}
      <nav
        className={`sidebar ${isMobileMenuOpen ? 'mobile-sidebar active' : ''}`}
        id="desktopSidebar"
        style={isMobileMenuOpen ? { left: 0 } : undefined}
      >
        <div className="sidebar-section">
          <div className="sidebar-section-title">Live Streams</div>
          {/* 1. Sen 4K Camera */}
          <div
            className={`sidebar-item ${activeCamera === '4k' ? 'active' : ''}`}
            onClick={() => handleCameraClick('4k')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">videocam</span>
            </div>
            <div className="sidebar-item-text">4K Camera - Sen.com</div>
          </div>

          {/* 2. HD Camera */}
          <div
            className={`sidebar-item ${activeCamera === 'sd' ? 'active' : ''}`}
            onClick={() => handleCameraClick('sd')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">videocam</span>
            </div>
            <div className="sidebar-item-text">HD Camera</div>
          </div>

          {/* 3. SD Camera */}
          <div
            className={`sidebar-item ${activeCamera === 'hd' ? 'active' : ''}`}
            onClick={() => handleCameraClick('hd')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">videocam</span>
            </div>
            <div className="sidebar-item-text">SD Camera</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Learn</div>
          <div
            className={`sidebar-item content-nav-item ${activeSection === 'whoIsOnSection' ? 'active' : ''}`}
            onClick={() => handleNavClick('whoIsOnSection')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">people</span>
            </div>
            <div className="sidebar-item-text">Who is on the ISS</div>
          </div>

          <div
            className={`sidebar-item content-nav-item ${activeSection === 'camerasSection' ? 'active' : ''}`}
            onClick={() => handleNavClick('camerasSection')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">videocam</span>
            </div>
            <div className="sidebar-item-text">ISS Cameras</div>
          </div>

          <div
            className={`sidebar-item content-nav-item ${activeSection === 'spaceSection' ? 'active' : ''}`}
            onClick={() => handleNavClick('spaceSection')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">public</span>
            </div>
            <div className="sidebar-item-text">Space Exploration</div>
          </div>

          <div
            className={`sidebar-item content-nav-item ${activeSection === 'aboutSection' ? 'active' : ''}`}
            onClick={() => handleNavClick('aboutSection')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">info</span>
            </div>
            <div className="sidebar-item-text">About the ISS</div>
          </div>

          <div
            className={`sidebar-item content-nav-item ${activeSection === 'faqSection' ? 'active' : ''}`}
            onClick={() => handleNavClick('faqSection')}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-item-icon">
              <span className="material-icons">help_outline</span>
            </div>
            <div className="sidebar-item-text">FAQ</div>
          </div>
        </div>
      </nav>
    </>
  );
};
