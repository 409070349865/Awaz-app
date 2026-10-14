import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mic2, History, BarChart3, GraduationCap } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: <Mic2 size={20} />, label: 'Translate' },
    { path: '/history', icon: <History size={20} />, label: 'History' },
    { path: '/stats', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/learn', icon: <GraduationCap size={20} />, label: 'Learn' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon flex-center">🗣️</div>
        <div className="logo-text-wrap">
          <h1 className="logo-text text-gradient">Awaz</h1>
          <span className="logo-sub">Voice Translator</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot online"></span>
          <span>Backend Connected</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
