import { Link } from 'react-router-dom';
import { useState } from 'react';

function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: '✨',
      title: '拖拽编辑',
      description: '通过简单的拖拽操作，轻松调整简历模块顺序，让内容组织更加灵活高效。',
      details: ['模块自由排序', '实时反馈动画', '一键添加/删除']
    },
    {
      icon: '👁️',
      title: '实时预览',
      description: '编辑内容即时同步到预览区，所见即所得，告别反复切换的烦恼。',
      details: ['即时同步更新', '精准还原效果', '多设备适配']
    },
    {
      icon: '📄',
      title: '智能一页',
      description: '一键智能压缩，自动调整排版，确保简历完美适配一页A4纸。',
      details: ['智能算法优化', '保持可读性', '专业排版']
    },
    {
      icon: '💾',
      title: '本地存储',
      description: '数据安全存储在您的浏览器本地，无需担心隐私泄露，支持多简历管理。',
      details: ['隐私安全保障', '多简历管理', '自动保存']
    },
    {
      icon: '📥',
      title: 'PDF导出',
      description: '一键导出高质量PDF格式简历，完美保留排版效果，随时投递。',
      details: ['高清输出', '格式完美', '一键下载']
    },
    {
      icon: '🎨',
      title: '富文本编辑',
      description: '支持丰富的文本格式化功能，让您的简历内容更加专业美观。',
      details: ['格式自由', '列表支持', '链接插入']
    }
  ];

  const faqs = [
    {
      question: '使用一页简历需要付费吗？',
      answer: '完全免费！一页简历是一款开源免费的在线简历编辑工具，所有功能均可免费使用，无需注册，即开即用。'
    },
    {
      question: '我的简历数据安全吗？',
      answer: '非常安全。所有简历数据完全存储在您的浏览器本地（localStorage），不会上传到任何服务器。您的隐私数据只属于您自己。'
    },
    {
      question: '支持哪些简历格式导出？',
      answer: '目前支持导出为PDF格式，完美保留简历排版效果，适合打印和在线投递。未来将支持更多格式。'
    },
    {
      question: '可以在手机上使用吗？',
      answer: '支持！一页简历采用响应式设计，完美适配桌面端、平板和手机设备，随时随地编辑您的简历。'
    },
    {
      question: '如何管理多份简历？',
      answer: '系统支持创建、重命名和删除多份简历，您可以在简历下拉菜单中轻松切换和管理不同的简历版本。'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-container">
          <a href="/resume-editor/" className="nav-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>一页简历</span>
          </a>
          <div className="nav-links">
            <a href="#features">功能特点</a>
            <a href="#faq">常见问题</a>
            <Link to="/editor" className="nav-cta">开始使用</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            专业简历，一键创建
          </h1>
          <p className="hero-subtitle">
            免费在线简历编辑器，拖拽编辑、实时预览、智能压缩，<br className="desktop-break" />
            帮助您快速创建专业的单页简历。
          </p>
          <div className="hero-cta">
            <Link to="/editor" className="btn-primary-large">
              立即开始
            </Link>
            <a href="#features" className="btn-secondary-large">
              了解更多
            </a>
          </div>
          <div className="hero-preview">
            <div className="preview-window">
              <img 
                src="/resume-editor/截屏 1.png" 
                alt="简历编辑器预览" 
                className="preview-image"
                loading="lazy"
                onLoad={(e) => e.target.style.opacity = '1'}
                style={{ opacity: '0', transition: 'opacity 0.5s ease-in-out' }}
              />
              <div className="preview-placeholder"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="section-title">清爽便捷的简历制作</h2>
          <p className="section-subtitle">简单拖拽编辑，实时预览效果，智能排版优化，轻松创建专业简历</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-details">
                  {feature.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-content">
            <h2 className="showcase-title">简单三步，创建专业简历</h2>
            <div className="showcase-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>填写内容</h3>
                <p>输入个人信息、工作经历、教育背景等内容</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>调整排版</h3>
                <p>拖拽调整模块顺序，使用智能压缩优化布局</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>导出PDF</h3>
                <p>一键导出高质量PDF，随时投递简历</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">常见问题</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <svg 
                    className="faq-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none"
                  >
                    <path 
                      d="M5 7.5L10 12.5L15 7.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="footer-copyright">
              © 2026 一页简历
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
