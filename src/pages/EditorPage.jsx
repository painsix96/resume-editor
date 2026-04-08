import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiChevronDown, FiPlus, FiTrash2, FiSun, FiMoon } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';

import DraggableSection from '../components/DraggableSection';
import SectionContent from '../components/SectionContent';
import PreviewSection from '../components/PreviewSection';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const createInitialResumeData = () => ({
  personal: {
    id: 'personal',
    type: 'personal',
    name: '张三',
    title: '前端开发工程师',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区'
  },
  sections: [
    {
      id: generateId(),
      type: 'summary',
      content: '具有5年前端开发经验，熟悉React、Vue等前端框架，擅长构建响应式网页和单页应用。'
    },
    {
      id: generateId(),
      type: 'experience',
      items: [
        {
          id: generateId(),
          company: 'ABC科技有限公司',
          position: '前端开发工程师',
          period: '2020-至今',
          description: '负责公司官网和内部系统的前端开发，使用React和TypeScript构建现代化Web应用。'
        }
      ]
    },
    {
      id: generateId(),
      type: 'education',
      items: [
        {
          id: generateId(),
          school: '北京大学',
          degree: '计算机科学与技术',
          period: '2016-2020',
          description: '获得学士学位，主修计算机科学。'
        }
      ]
    },
    {
      id: generateId(),
      type: 'skills',
      content: 'React, Vue, JavaScript, TypeScript, HTML5, CSS3, Bootstrap, Git'
    }
  ]
});

const initialResumeData = createInitialResumeData();

const sectionTypes = {
  summary: { name: '个人总结', icon: '📝' },
  experience: { name: '工作经验', icon: '💼' },
  education: { name: '教育背景', icon: '🎓' },
  skills: { name: '技能', icon: '🛠️' },
  project: { name: '项目经验', icon: '📦' },
  custom: { name: '通用模块', icon: '📄' }
};

function EditorPage() {
  const loadFromLocalStorage = useCallback(() => {
    const savedResumes = localStorage.getItem('resumeEditorResumes');
    if (savedResumes) {
      try {
        const parsedResumes = JSON.parse(savedResumes);
        return parsedResumes.map(resume => ({
          ...resume,
          isCompressed: resume.isCompressed !== undefined ? resume.isCompressed : false,
          compressionLevel: resume.compressionLevel !== undefined ? resume.compressionLevel : 0
        }));
      } catch (error) {
        console.error('Failed to parse saved resumes:', error);
      }
    }
    return [
      {
        id: '1',
        name: '简历1',
        data: initialResumeData,
        expandedSections: {
          personal: false,
          [initialResumeData.sections[0].id]: false,
          [initialResumeData.sections[1].id]: false,
          [initialResumeData.sections[2].id]: false,
          [initialResumeData.sections[3].id]: false
        },
        sectionsOrder: [
          'personal',
          ...initialResumeData.sections.map(s => s.id)
        ],
        sectionNames: {
          personal: '个人信息',
          [initialResumeData.sections[0].id]: '个人总结',
          [initialResumeData.sections[1].id]: '工作经验',
          [initialResumeData.sections[2].id]: '教育背景',
          [initialResumeData.sections[3].id]: '技能'
        },
        editingData: null,
        editingSectionId: null,
        isCompressed: false,
        compressionLevel: 0
      }
    ];
  }, []);

  const [resumes, setResumes] = useState(loadFromLocalStorage());
  const [currentResumeId, setCurrentResumeId] = useState(() => {
    const savedCurrentResumeId = localStorage.getItem('resumeEditorCurrentResumeId');
    return savedCurrentResumeId || '1';
  });
  const [editingSectionName, setEditingSectionName] = useState(null);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showSectionDeleteConfirm, setShowSectionDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('resumeEditorDarkMode');
    return savedDarkMode === 'true';
  });
  const previewRef = useRef(null);
  const editorRef = useRef(null);
  const sectionRefs = useRef({});
  const sectionToScrollRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumeEditorResumes', JSON.stringify(resumes));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [resumes]);

  useEffect(() => {
    localStorage.setItem('resumeEditorCurrentResumeId', currentResumeId);
  }, [currentResumeId]);

  useEffect(() => {
    localStorage.setItem('resumeEditorDarkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const currentResume = useMemo(() => {
    return resumes.find(resume => resume.id === currentResumeId);
  }, [resumes, currentResumeId]);

  const resumeData = useMemo(() => {
    return currentResume?.data || initialResumeData;
  }, [currentResume]);

  const expandedSections = useMemo(() => {
    return currentResume?.expandedSections || {};
  }, [currentResume]);

  const sectionsOrder = useMemo(() => {
    return currentResume?.sectionsOrder || [];
  }, [currentResume]);

  const sectionNames = useMemo(() => {
    return currentResume?.sectionNames || {};
  }, [currentResume]);

  const editingData = useMemo(() => {
    return currentResume?.editingData;
  }, [currentResume]);

  const editingSectionId = useMemo(() => {
    return currentResume?.editingSectionId;
  }, [currentResume]);

  const isCompressed = useMemo(() => {
    return currentResume?.isCompressed || false;
  }, [currentResume]);

  const compressionLevel = useMemo(() => {
    return currentResume?.compressionLevel || 0;
  }, [currentResume]);

  useEffect(() => {
    if (sectionToScrollRef.current) {
      const sectionId = sectionToScrollRef.current;
      const sectionRef = sectionRefs.current[sectionId];
      if (sectionRef) {
        sectionRef.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      sectionToScrollRef.current = null;
    }
  }, [expandedSections]);

  const handleInputChange = useCallback((sectionId, field, value) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        if (resume.editingSectionId === sectionId && resume.editingData) {
          return {
            ...resume,
            editingData: { ...resume.editingData, [field]: value }
          };
        }
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleItemInputChange = useCallback((sectionId, itemId, field, value) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId && resume.editingSectionId === sectionId && resume.editingData) {
        return {
          ...resume,
          editingData: {
            ...resume.editingData,
            items: resume.editingData.items.map(item => {
              if (item.id === itemId) {
                return { ...item, [field]: value };
              }
              return item;
            })
          }
        };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleAddItem = useCallback((sectionId, sectionType) => {
    const newItem = { id: generateId() };
    
    switch (sectionType) {
      case 'experience':
        newItem.company = '';
        newItem.position = '';
        newItem.period = '';
        newItem.description = '';
        break;
      case 'education':
        newItem.school = '';
        newItem.degree = '';
        newItem.period = '';
        newItem.description = '';
        break;
      case 'project':
        newItem.projectName = '';
        newItem.role = '';
        newItem.period = '';
        newItem.description = '';
        break;
    }
    
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId && resume.editingSectionId === sectionId && resume.editingData) {
        return {
          ...resume,
          editingData: {
            ...resume.editingData,
            items: [...(resume.editingData.items || []), newItem]
          }
        };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleDeleteItem = useCallback((sectionId, itemId) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId && resume.editingSectionId === sectionId && resume.editingData) {
        return {
          ...resume,
          editingData: {
            ...resume.editingData,
            items: resume.editingData.items.filter(item => item.id !== itemId)
          }
        };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleDeleteSection = useCallback((sectionId) => {
    if (sectionId === 'personal') {
      alert('个人信息模块不可删除');
      return;
    }
    
    setSectionToDelete(sectionId);
    setShowSectionDeleteConfirm(true);
  }, []);
  
  const confirmDeleteSection = useCallback(() => {
    if (sectionToDelete) {
      setResumes(prev => prev.map(resume => {
        if (resume.id === currentResumeId) {
          const updatedSectionsOrder = resume.sectionsOrder.filter(id => id !== sectionToDelete);
          const updatedSections = resume.data.sections.filter(s => s.id !== sectionToDelete);
          const { [sectionToDelete]: _, ...updatedExpandedSections } = resume.expandedSections;
          const { [sectionToDelete]: __, ...updatedSectionNames } = resume.sectionNames;
          
          return {
            ...resume,
            data: { ...resume.data, sections: updatedSections },
            sectionsOrder: updatedSectionsOrder,
            expandedSections: updatedExpandedSections,
            sectionNames: updatedSectionNames
          };
        }
        return resume;
      }));
      
      setShowSectionDeleteConfirm(false);
      setSectionToDelete(null);
    }
  }, [sectionToDelete, currentResumeId]);

  const handleRenameSection = useCallback((sectionId, newName) => {
    if (newName.trim()) {
      setResumes(prev => prev.map(resume => {
        if (resume.id === currentResumeId) {
          return {
            ...resume,
            sectionNames: {
              ...resume.sectionNames,
              [sectionId]: newName.trim()
            }
          };
        }
        return resume;
      }));
    }
    setEditingSectionName(null);
  }, [currentResumeId]);

  const isTogglingRef = useRef(false);

  const handlePreviewSectionClick = useCallback((sectionId) => {
    if (isTogglingRef.current) return;
    
    isTogglingRef.current = true;
    
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        if (sectionId === 'personal') return resume;
        
        const section = resume.data.sections.find(s => s.id === sectionId);
        const isAlreadyExpanded = resume.expandedSections[sectionId];
        
        if (!isAlreadyExpanded) {
          sectionToScrollRef.current = sectionId;
          return {
            ...resume,
            expandedSections: {
              ...resume.expandedSections,
              [sectionId]: true
            },
            editingSectionId: sectionId,
            editingData: section ? { ...section } : null
          };
        } else {
          sectionToScrollRef.current = sectionId;
        }
      }
      return resume;
    }));
    
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 150);
  }, [currentResumeId]);

  const toggleSection = useCallback((sectionId) => {
    if (isTogglingRef.current) return;
    
    isTogglingRef.current = true;
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        const newExpanded = !resume.expandedSections[sectionId];
        if (newExpanded) {
          const section = resume.data.sections.find(s => s.id === sectionId);
          return {
            ...resume,
            expandedSections: {
              ...resume.expandedSections,
              [sectionId]: newExpanded
            },
            editingSectionId: sectionId,
            editingData: sectionId === 'personal' 
              ? { ...resume.data.personal }
              : section ? { ...section } : null
          };
        } else {
          return {
            ...resume,
            expandedSections: {
              ...resume.expandedSections,
              [sectionId]: newExpanded
            },
            editingSectionId: null,
            editingData: null
          };
        }
      }
      return resume;
    }));
    
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 150);
  }, [currentResumeId]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        const items = Array.from(resume.sectionsOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        return { ...resume, sectionsOrder: items };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const moveSection = useCallback((fromIndex, toIndex) => {
    const result = {
      source: { index: fromIndex },
      destination: { index: toIndex }
    };
    handleDragEnd(result);
  }, [handleDragEnd]);

  const handleStartEdit = useCallback((sectionId) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        const section = resume.data.sections.find(s => s.id === sectionId);
        return {
          ...resume,
          editingSectionId: sectionId,
          editingData: sectionId === 'personal' 
            ? { ...resume.data.personal }
            : section ? { ...section } : null
        };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleSaveEdit = useCallback(() => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId && resume.editingSectionId && resume.editingData) {
        const updatedData = { ...resume.data };
        if (resume.editingSectionId === 'personal') {
          updatedData.personal = resume.editingData;
        } else {
          updatedData.sections = updatedData.sections.map(section => {
            if (section.id === resume.editingSectionId) {
              return resume.editingData;
            }
            return section;
          });
        }
        return {
          ...resume,
          data: updatedData,
          editingData: resume.editingData
        };
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleCancelEdit = useCallback(() => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        const expandedSectionId = Object.entries(resume.expandedSections).find(([_, isExpanded]) => isExpanded)?.[0];
        
        if (expandedSectionId) {
          return {
            ...resume,
            editingSectionId: null,
            editingData: null,
            expandedSections: {
              ...resume.expandedSections,
              [expandedSectionId]: false
            }
          };
        }
      }
      return resume;
    }));
  }, [currentResumeId]);

  const handleCreateResume = useCallback(() => {
    const newData = createInitialResumeData();
    setResumes(prev => {
      const newId = (prev.length + 1).toString();
      const newResume = {
        id: newId,
        name: `简历${newId}`,
        data: newData,
        expandedSections: {
          personal: false,
          [newData.sections[0].id]: false,
          [newData.sections[1].id]: false,
          [newData.sections[2].id]: false,
          [newData.sections[3].id]: false
        },
        sectionsOrder: [
          'personal',
          ...newData.sections.map(s => s.id)
        ],
        sectionNames: {
          personal: '个人信息',
          [newData.sections[0].id]: '个人总结',
          [newData.sections[1].id]: '工作经验',
          [newData.sections[2].id]: '教育背景',
          [newData.sections[3].id]: '技能'
        },
        isCompressed: false,
        compressionLevel: 0
      };
      setCurrentResumeId(newId);
      return [...prev, newResume];
    });
  }, []);

  const handleDeleteResume = useCallback((resumeId) => {
    setResumes(prevResumes => {
      const newResumes = prevResumes.filter(resume => resume.id !== resumeId);
      
      if (currentResumeId === resumeId && newResumes.length > 0) {
        setCurrentResumeId(newResumes[0].id);
      }
      
      return newResumes;
    });
    
    setShowDeleteConfirm(false);
    setResumeToDelete(null);
  }, [currentResumeId]);

  const handleRenameResume = useCallback((resumeId, newName) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === resumeId) {
        return { ...resume, name: newName };
      }
      return resume;
    }));
  }, []);

  const handleCompress = useCallback(() => {
    requestAnimationFrame(() => {
      if (previewRef.current) {
        const a4PageHeight = 1123;
        
        const applyCompression = async () => {
          const initialHeight = previewRef.current.scrollHeight;
          
          if (initialHeight <= a4PageHeight) {
            setResumes(prev => prev.map(resume => {
              if (resume.id === currentResumeId) {
                return {
                  ...resume,
                  isCompressed: false,
                  compressionLevel: 0
                };
              }
              return resume;
            }));
            return;
          }
          
          let testHeight = initialHeight;
          let bestLevel = 0;
          
          const levels = [0, 1, 2, 3];
          
          for (const level of levels) {
            setResumes(prev => prev.map(resume => {
              if (resume.id === currentResumeId) {
                return {
                  ...resume,
                  isCompressed: level > 0,
                  compressionLevel: level
                };
              }
              return resume;
            }));
            
            await new Promise(resolve => setTimeout(resolve, 80));
            
            if (previewRef.current) {
              testHeight = previewRef.current.scrollHeight;
              
              if (testHeight <= a4PageHeight) {
                bestLevel = level;
                break;
              }
              
              if (level === 3) {
                bestLevel = 3;
              }
            }
          }
          
          setResumes(prev => prev.map(resume => {
            if (resume.id === currentResumeId) {
              return {
                ...resume,
                isCompressed: bestLevel > 0,
                compressionLevel: bestLevel
              };
            }
            return resume;
          }));
        };
        
        applyCompression();
      }
    });
  }, [currentResumeId]);

  const handleExport = useCallback(() => {
    if (previewRef.current) {
      const opt = {
        margin: 5,
        filename: `${resumeData.personal.name}_简历.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(previewRef.current).save();
    }
  }, [resumeData.personal.name]);

  const handleAddSection = useCallback((type) => {
    const newId = generateId();
    const newSection = {
      id: newId,
      type: type
    };

    switch (type) {
      case 'summary':
        newSection.content = '';
        break;
      case 'experience':
        newSection.items = [];
        break;
      case 'education':
        newSection.items = [];
        break;
      case 'skills':
        newSection.content = '';
        break;
      case 'project':
        newSection.items = [];
        break;
      case 'custom':
        newSection.title = '';
        newSection.content = '';
        break;
    }

    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        return {
          ...resume,
          data: {
            ...resume.data,
            sections: [...resume.data.sections, newSection]
          },
          sectionsOrder: [...resume.sectionsOrder, newId],
          expandedSections: {
            ...resume.expandedSections,
            [newId]: false
          },
          sectionNames: {
            ...resume.sectionNames,
            [newId]: sectionTypes[type].name
          }
        };
      }
      return resume;
    }));
    
    setShowAddSectionMenu(false);
  }, [currentResumeId]);

  const allSections = useMemo(() => {
    const sections = [];
    sectionsOrder.forEach(id => {
      if (id === 'personal') {
        sections.push({ id: 'personal', type: 'personal', ...resumeData.personal });
      } else {
        const section = resumeData.sections.find(s => s.id === id);
        if (section) {
          sections.push(section);
        }
      }
    });
    return sections;
  }, [sectionsOrder, resumeData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <header className="header">
          <Link to="/resume-editor/" className="header-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>一页简历</span>
          </Link>
          <div className="resume-management">
            <select 
              value={currentResumeId} 
              onChange={(e) => setCurrentResumeId(e.target.value)}
              className="resume-select"
            >
              {resumes.map(resume => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary" onClick={handleCreateResume}>
              新建简历
            </button>
            <button className="btn btn-danger" onClick={() => {
              if (resumes.length <= 1) {
                alert('至少需要保留一份简历');
                return;
              }
              setResumeToDelete(currentResumeId);
              setShowDeleteConfirm(true);
            }}>
              删除简历
            </button>
            <button className="btn btn-secondary" onClick={() => {
              const newName = prompt('请输入新的简历名称:', currentResume?.name);
              if (newName) handleRenameResume(currentResumeId, newName);
            }}>
              重命名
            </button>
          </div>
          <div className="actions" style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
              >
                <FiPlus size={16} style={{ marginRight: '6px' }} />
                新增模块
              </button>
              
              {showAddSectionMenu && (
                <div 
                  className="add-section-menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'var(--module-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    padding: '8px 0',
                    minWidth: '160px',
                    zIndex: 1000,
                    boxShadow: 'var(--shadow-hover)'
                  }}
                >
                  {Object.entries(sectionTypes).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => handleAddSection(type)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-color)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'var(--transition)',
                        fontFamily: 'var(--font-sans)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--secondary-color)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ marginRight: '8px' }}>{config.icon}</span>
                      {config.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="btn btn-secondary" onClick={handleCompress}>
              {isCompressed ? '取消一页' : '智能一页'}
            </button>
            <button className="btn btn-primary" onClick={handleExport}>
              导出PDF
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={toggleDarkMode}
              title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>
        </header>

        <main className="main">
          <section className="editor" ref={editorRef}>
            <h2>编辑简历</h2>

            {allSections.map((section, index) => (
              <div 
                key={section.id} 
                style={{ marginBottom: '16px' }}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current[section.id] = el;
                  }
                }}
              >
                <DraggableSection 
                  section={section.id} 
                  index={index} 
                  moveSection={moveSection}
                  isExpanded={expandedSections[section.id]}
                  resumeData={resumeData}
                >
                  <SectionContent 
                    section={section}
                    isExpanded={expandedSections[section.id]}
                    editingSectionId={editingSectionId}
                    editingData={editingData}
                    sectionNames={sectionNames}
                    sectionTypes={sectionTypes}
                    currentResumeId={currentResumeId}
                    editingSectionName={editingSectionName}
                    toggleSection={toggleSection}
                    handleInputChange={handleInputChange}
                    handleItemInputChange={handleItemInputChange}
                    handleAddItem={handleAddItem}
                    handleDeleteItem={handleDeleteItem}
                    handleRenameSection={handleRenameSection}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleDeleteSection={handleDeleteSection}
                    setResumes={setResumes}
                    setEditingSectionName={setEditingSectionName}
                  />
                </DraggableSection>
              </div>
            ))}
          </section>

          <aside className="preview">
            <h2>实时预览</h2>
            <div 
              className={`resume-preview ${
                compressionLevel === 1 ? 'compressed-level-1' : 
                compressionLevel === 2 ? 'compressed-level-2' : 
                compressionLevel === 3 ? 'compressed' : ''
              }`} 
              ref={previewRef}
            >
              <div className="resume-header">
                <h1>{resumeData.personal.name}</h1>
                <p>{resumeData.personal.title}</p>
                <p>{resumeData.personal.email} | {resumeData.personal.phone}</p>
                {resumeData.personal.address && <p>{resumeData.personal.address}</p>}
              </div>

              {allSections.map(section => (
                <PreviewSection 
                  key={section.id}
                  section={section} 
                  sectionNames={sectionNames} 
                  sectionTypes={sectionTypes} 
                  onClick={handlePreviewSectionClick}
                />
              ))}
            </div>
          </aside>
        </main>

        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="delete-confirm-modal" style={{
              backgroundColor: 'var(--modal-bg)',
              padding: '24px',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-hover)',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: '16px', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>确认删除</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>确定要删除当前简历吗？此操作不可恢复。</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setResumeToDelete(null);
                  }}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDarkMode ? '#35354E' : '#E8EDF3';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--input-bg)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => resumeToDelete && handleDeleteResume(resumeToDelete)}
                  style={{
                    backgroundColor: 'var(--error-color)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--error-color)'}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showSectionDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="delete-confirm-modal" style={{
              backgroundColor: 'var(--modal-bg)',
              padding: '24px',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-hover)',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: '16px', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>确认删除</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>确定要删除此模块吗？此操作不可恢复。</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowSectionDeleteConfirm(false);
                    setSectionToDelete(null);
                  }}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDarkMode ? '#35354E' : '#E8EDF3';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--input-bg)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }}
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteSection}
                  style={{
                    backgroundColor: 'var(--error-color)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--error-color)'}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DndProvider>
  );
}

export default EditorPage;
