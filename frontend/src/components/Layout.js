import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

/**
 * Layout component that wraps page content with a common header and footer.
 * Ensures consistent structure across all authenticated views.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered inside the layout
 * @returns {JSX.Element} The layout with header, main content, and footer
 */
function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;