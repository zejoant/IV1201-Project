function PersonPage({ currentUser, handleLogout }) {
  return (
    <div style={styles.container}>
      {/* 顶部导航栏 */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <h1 style={styles.logo}>👔 Recruitment Platform</h1>
          </div>
          <div style={styles.navActions}>
            <div style={styles.userBadge}>
              <div style={styles.avatar}>
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <span style={styles.username}>{currentUser.name}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <span>Logout</span>
              <span style={styles.logoutIcon}>→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main style={styles.main}>
        <div style={styles.content}>
          {/* 欢迎横幅 */}
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeContent}>
              <h2 style={styles.welcomeTitle}>
                Welcome back, <span style={styles.highlight}>{currentUser.name}</span>!
              </h2>
              <p style={styles.welcomeSubtitle}>
                Here's your account information and recent activity
              </p>
            </div>
            <div style={styles.welcomeDecoration}>
              <div style={styles.decorationCircle}></div>
            </div>
          </div>

          {/* 用户信息卡片 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <span style={styles.cardIcon}>👤</span>
                Personal Information
              </h3>
              <div style={styles.cardBadge}>Active</div>
            </div>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>User ID</span>
                <span style={styles.infoValue}>{currentUser.person_id}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Full Name</span>
                <span style={styles.infoValue}>{currentUser.name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Username</span>
                <span style={styles.infoValue}>{currentUser.username}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Account Type</span>
                <span style={styles.infoValue}>Recruitment Account</span>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.footerNote}>
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* 快速操作卡片 */}
          <div style={styles.actionsGrid}>
            <div style={styles.actionCard}>
              <div style={styles.actionIcon} className="action-icon-1">
                ✏️
              </div>
              <h4 style={styles.actionTitle}>Edit Profile</h4>
              <p style={styles.actionDescription}>
                Update your personal information
              </p>
              <button style={styles.actionButton}>Edit</button>
            </div>
            
            <div style={styles.actionCard}>
              <div style={styles.actionIcon} className="action-icon-2">
                🔒
              </div>
              <h4 style={styles.actionTitle}>Security</h4>
              <p style={styles.actionDescription}>
                Change password and security settings
              </p>
              <button style={styles.actionButton}>Settings</button>
            </div>
            
            <div style={styles.actionCard}>
              <div style={styles.actionIcon} className="action-icon-3">
                📊
              </div>
              <h4 style={styles.actionTitle}>Dashboard</h4>
              <p style={styles.actionDescription}>
                View your recruitment analytics
              </p>
              <button style={styles.actionButton}>View</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  // 导航栏样式
  navbar: {
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #eef2f7',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '50px',
    border: '1px solid #e2e8f0',
  },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#4a6cf7',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
  },
  username: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  logoutIcon: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
  },

  // 主要内容区域
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  // 欢迎横幅
  welcomeSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eef2f7',
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  highlight: {
    color: '#4a6cf7',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  welcomeDecoration: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  decorationCircle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a6cf7 0%, #764ba2 100%)',
    opacity: 0.1,
  },

  // 用户信息卡片
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eef2f7',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardIcon: {
    fontSize: '24px',
  },
  cardBadge: {
    padding: '6px 14px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '28px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '16px',
    color: '#1e293b',
    fontWeight: '600',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  cardFooter: {
    paddingTop: '24px',
    borderTop: '1px solid #eef2f7',
  },
  footerNote: {
    fontSize: '14px',
    color: '#94a3b8',
  },

  // 快速操作卡片
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eef2f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  actionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '20px',
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  actionDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 20px 0',
    lineHeight: 1.5,
  },
  actionButton: {
    padding: '10px 24px',
    backgroundColor: '#f8fafc',
    color: '#4a6cf7',
    border: '1px solid #4a6cf7',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: 'auto',
  },
};

// 添加CSS样式和动画
const cssStyles = `
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  
  .logout-button:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  .logout-button:hover .logout-icon {
    transform: translateX(3px);
  }
  
  .action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .action-button:hover {
    background-color: #4a6cf7;
    color: white;
  }
  
  .action-icon-1 {
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    color: #667eea;
  }
  
  .action-icon-2 {
    background: linear-gradient(135deg, #10b98115 0%, #05966915 100%);
    color: #10b981;
  }
  
  .action-icon-3 {
    background: linear-gradient(135deg, #f59e0b15 0%, #d9770615 100%);
    color: #f59e0b;
  }
  
  .info-value {
    transition: all 0.2s ease;
  }
  
  .info-value:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .nav-actions {
      width: 100%;
      justify-content: center;
    }
    
    .welcome-section {
      flex-direction: column;
      text-align: center;
    }
    
    .welcome-decoration {
      margin-top: 24px;
    }
    
    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// 将CSS样式添加到head中
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = cssStyles;
  document.head.appendChild(styleSheet);
}

export default PersonPage;