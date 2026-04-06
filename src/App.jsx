import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiChevronDown, FiChevronUp, FiMove, FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';

// 可拖动的模块组件
const DraggableSection = ({ section, index, moveSection, children, isExpanded, resumeData }) => {
  const ref = React.useRef(null);
  
  // 个人信息模块不可拖动
  if (section === 'personal') {
    return <div>{children}</div>;
  }
  
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isExpanded,
  });
  
  const [{ isOver }, drop] = useDrop({
    accept: 'SECTION',
    drop: (item) => moveSection(item.index, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isExpanded ? 'default' : 'move',
        transition: 'all 0.2s ease',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
};

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 模拟简历数据
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

// 模块类型配置
const sectionTypes = {
  summary: { name: '个人总结', icon: '📝' },
  experience: { name: '工作经验', icon: '💼' },
  education: { name: '教育背景', icon: '🎓' },
  skills: { name: '技能', icon: '🛠️' },
  project: { name: '项目经验', icon: '📦' },
  custom: { name: '通用模块', icon: '📄' }
};

function App() {
  // 从 localStorage 加载数据，如果没有则使用初始数据
  const loadFromLocalStorage = () => {
    const savedResumes = localStorage.getItem('resumeEditorResumes');
    if (savedResumes) {
      try {
        return JSON.parse(savedResumes);
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
        editingSectionId: null
      }
    ];
  };

  const [resumes, setResumes] = useState(loadFromLocalStorage());
  const [currentResumeId, setCurrentResumeId] = useState(() => {
    const savedCurrentResumeId = localStorage.getItem('resumeEditorCurrentResumeId');
    return savedCurrentResumeId || '1';
  });
  const [isCompressed, setIsCompressed] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [editingSectionName, setEditingSectionName] = useState(null);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const previewRef = useRef(null);

  // 监听滚动事件，控制底部信息栏显示
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 当简历数据变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('resumeEditorResumes', JSON.stringify(resumes));
  }, [resumes]);

  // 当当前选中的简历 ID 变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('resumeEditorCurrentResumeId', currentResumeId);
  }, [currentResumeId]);

  // 获取当前简历数据
  const currentResume = resumes.find(resume => resume.id === currentResumeId);
  const resumeData = currentResume?.data || initialResumeData;
  const expandedSections = currentResume?.expandedSections || {};
  const sectionsOrder = currentResume?.sectionsOrder || [];
  const sectionNames = currentResume?.sectionNames || {};
  const editingData = currentResume?.editingData;
  const editingSectionId = currentResume?.editingSectionId;

  // 获取所有模块
  const getAllSections = () => {
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
  };

  // 处理表单输入变化 - 个人信息或简单模块
  const handleInputChange = (sectionId, field, value) => {
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
  };

  // 处理子模块输入变化
  const handleItemInputChange = (sectionId, itemId, field, value) => {
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
  };

  // 处理添加子模块
  const handleAddItem = (sectionId, sectionType) => {
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
  };

  // 处理删除子模块
  const handleDeleteItem = (sectionId, itemId) => {
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
  };

  // 处理删除模块
  const handleDeleteSection = (sectionId) => {
    if (sectionId === 'personal') {
      alert('个人信息模块不可删除');
      return;
    }
    
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        const updatedSectionsOrder = resume.sectionsOrder.filter(id => id !== sectionId);
        const updatedSections = resume.data.sections.filter(s => s.id !== sectionId);
        const { [sectionId]: _, ...updatedExpandedSections } = resume.expandedSections;
        const { [sectionId]: __, ...updatedSectionNames } = resume.sectionNames;
        
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
  };

  // 处理修改模块名称
  const handleRenameSection = (sectionId, newName) => {
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
  };

  // 切换模块展开/收起
  const toggleSection = (sectionId) => {
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
  };

  // 处理拖动排序
  const handleDragEnd = (result) => {
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
  };

  // 移动模块
  const moveSection = (fromIndex, toIndex) => {
    const result = {
      source: { index: fromIndex },
      destination: { index: toIndex }
    };
    handleDragEnd(result);
  };

  // 开始编辑模块
  const handleStartEdit = (sectionId) => {
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
  };

  // 保存编辑
  const handleSaveEdit = () => {
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
          // 保存后保持编辑状态
          editingData: resume.editingData
        };
      }
      return resume;
    }));
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === currentResumeId) {
        // 找到当前展开的模块
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
  };

  // 处理创建新简历
  const handleCreateResume = () => {
    const newId = (resumes.length + 1).toString();
    const newData = createInitialResumeData();
    setResumes(prev => [...prev, {
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
      }
    }]);
    setCurrentResumeId(newId);
  };

  // 处理删除简历
  const handleDeleteResume = (resumeId) => {
    const newResumes = resumes.filter(resume => resume.id !== resumeId);
    setResumes(newResumes);
    
    // 如果删除的是当前选中的简历，切换到第一个简历
    if (currentResumeId === resumeId && newResumes.length > 0) {
      setCurrentResumeId(newResumes[0].id);
    }
    
    // 关闭确认弹窗
    setShowDeleteConfirm(false);
    setResumeToDelete(null);
  };

  // 处理重命名简历
  const handleRenameResume = (resumeId, newName) => {
    setResumes(prev => prev.map(resume => {
      if (resume.id === resumeId) {
        return { ...resume, name: newName };
      }
      return resume;
    }));
  };

  // 处理智能压缩
  const handleCompress = () => {
    setIsCompressed(prev => !prev);
  };

  // 处理PDF导出
  const handleExport = () => {
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
  };

  // 处理新增模块
  const handleAddSection = (type) => {
    const newId = generateId();
    const newSection = {
      id: newId,
      type: type
    };

    // 根据模块类型设置默认数据
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
  };

  // 渲染模块内容
  const renderSectionContent = (section, isExpanded) => {
    const sectionId = section.id;
    const isPersonal = section.type === 'personal';
    const isEditing = editingSectionId === sectionId;
    // 当模块展开时，始终使用编辑数据
    const currentData = isExpanded && editingData && editingSectionId === sectionId ? editingData : section;

    if (isExpanded) {
      return (
        <div 
          style={{ 
            padding: '20px', 
            backgroundColor: '#1e1e1e', 
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #3a3a3a' }}>
            {editingSectionName === sectionId ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={sectionNames[sectionId] || ''}
                  onChange={(e) => setResumes(prev => prev.map(resume => {
                    if (resume.id === currentResumeId) {
                      return {
                        ...resume,
                        sectionNames: {
                          ...resume.sectionNames,
                          [sectionId]: e.target.value
                        }
                      };
                    }
                    return resume;
                  }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSection(sectionId, sectionNames[sectionId])}
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a', 
                    color: '#3B82F6', 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold',
                    padding: '6px 10px',
                    borderRadius: '4px'
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleRenameSection(sectionId, sectionNames[sectionId])}
                  style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  确定
                </button>
                <button
                  onClick={() => setEditingSectionName(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#e0e0e0',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  取消
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ margin: 0, color: '#3B82F6', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {sectionNames[sectionId] || sectionTypes[section.type]?.name || ''}
                </h3>
                {!isPersonal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSectionName(sectionId);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#e0e0e0',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiEdit size={16} />
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e0e0e0',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onClick={() => toggleSection(sectionId)}
              >
                <FiChevronUp size={20} />
              </div>
            </div>
          </div>
          
          {isPersonal && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-name`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>姓名 <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  value={currentData.name}
                  onChange={(e) => handleInputChange(sectionId, 'name', e.target.value)}
                  required
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-title`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>职位 <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  value={currentData.title}
                  onChange={(e) => handleInputChange(sectionId, 'title', e.target.value)}
                  required
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-email`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>邮箱 <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="email"
                  value={currentData.email}
                  onChange={(e) => handleInputChange(sectionId, 'email', e.target.value)}
                  required
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-phone`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>电话 <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="tel"
                  value={currentData.phone}
                  onChange={(e) => handleInputChange(sectionId, 'phone', e.target.value)}
                  required
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }} key={`${sectionId}-address`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>地址</label>
                <input
                  type="text"
                  value={currentData.address}
                  onChange={(e) => handleInputChange(sectionId, 'address', e.target.value)}
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
            </div>
          )}
          
          {currentData.type === 'summary' && (
            <div className="form-group">
              <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>个人总结</label>
              <ReactQuill
                value={currentData.content || ''}
                onChange={(content) => handleInputChange(sectionId, 'content', content)}
                placeholder="请输入个人总结（非必填）"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
                style={{ borderRadius: '6px' }}
              />
            </div>
          )}
          
          {(currentData.type === 'experience' || currentData.type === 'education' || currentData.type === 'project') && currentData.items && (
            <>
              {currentData.items.map((item, idx) => (
                <div key={item.id} style={{ marginBottom: idx < currentData.items.length - 1 ? '24px' : '0', paddingBottom: idx < currentData.items.length - 1 ? '20px' : '0', borderBottom: idx < currentData.items.length - 1 ? '1px solid #3a3a3a' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.1rem', fontWeight: '600' }}>
                      {currentData.type === 'experience' && `工作经历 ${idx + 1}`}
                      {currentData.type === 'education' && `教育经历 ${idx + 1}`}
                      {currentData.type === 'project' && `项目经历 ${idx + 1}`}
                    </h4>
                    <button 
                      onClick={() => handleDeleteItem(sectionId, item.id)}
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: '#dc2626', 
                        border: 'none', 
                        padding: '4px', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  
                  {currentData.type === 'experience' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div key={`${item.id}-company`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>公司名称</label>
                          <input
                            type="text"
                            placeholder="公司名称"
                            value={item.company}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'company', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div key={`${item.id}-position`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>职位</label>
                          <input
                            type="text"
                            placeholder="职位"
                            value={item.position}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'position', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>时间段</label>
                          <input
                            type="text"
                            placeholder="时间段"
                            value={item.period}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                      </div>
                      <div key={`${item.id}-description`}>
                        <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>工作描述</label>
                        <ReactQuill
                          value={item.description || ''}
                          onChange={(content) => handleItemInputChange(sectionId, item.id, 'description', content)}
                          placeholder="工作描述"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link'],
                              ['clean']
                            ]
                          }}
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                    </>
                  )}
                  
                  {currentData.type === 'education' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div key={`${item.id}-school`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>学校名称</label>
                          <input
                            type="text"
                            placeholder="学校名称"
                            value={item.school}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'school', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div key={`${item.id}-degree`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>学位/专业</label>
                          <input
                            type="text"
                            placeholder="学位"
                            value={item.degree}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'degree', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>时间段</label>
                          <input
                            type="text"
                            placeholder="时间段"
                            value={item.period}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                      </div>
                      <div key={`${item.id}-description`}>
                        <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>描述</label>
                        <ReactQuill
                          value={item.description || ''}
                          onChange={(content) => handleItemInputChange(sectionId, item.id, 'description', content)}
                          placeholder="描述"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link'],
                              ['clean']
                            ]
                          }}
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                    </>
                  )}
                  
                  {currentData.type === 'project' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div key={`${item.id}-projectName`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>项目名称</label>
                          <input
                            type="text"
                            placeholder="项目名称"
                            value={item.projectName}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'projectName', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div key={`${item.id}-role`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>角色</label>
                          <input
                            type="text"
                            placeholder="角色"
                            value={item.role}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'role', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                          <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>时间段</label>
                          <input
                            type="text"
                            placeholder="时间段"
                            value={item.period}
                            onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                          />
                        </div>
                      </div>
                      <div key={`${item.id}-description`}>
                        <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>项目描述</label>
                        <ReactQuill
                          value={item.description || ''}
                          onChange={(content) => handleItemInputChange(sectionId, item.id, 'description', content)}
                          placeholder="项目描述"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link'],
                              ['clean']
                            ]
                          }}
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* 添加子模块按钮 */}
              <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleAddItem(sectionId, currentData.type)}
                  style={{ 
                    backgroundColor: '#3B82F6', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <FiPlus size={16} style={{ marginRight: '6px' }} />
                  {currentData.type === 'experience' && '新增工作经历'}
                  {currentData.type === 'education' && '新增教育经历'}
                  {currentData.type === 'project' && '新增项目经历'}
                </button>
              </div>
            </>
          )}
          
          {currentData.type === 'skills' && (
            <div className="form-group" key={`${sectionId}-skills`}>
              <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>技能</label>
              <ReactQuill
                value={currentData.content || ''}
                onChange={(content) => handleInputChange(sectionId, 'content', content)}
                placeholder="请输入技能，用逗号分隔"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
                style={{ borderRadius: '6px' }}
              />
            </div>
          )}
          
          {currentData.type === 'custom' && (
            <>
              <div className="form-group" style={{ marginBottom: '16px' }} key={`${sectionId}-custom-title`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>标题</label>
                <input
                  type="text"
                  placeholder="标题"
                  value={currentData.title}
                  onChange={(e) => handleInputChange(sectionId, 'title', e.target.value)}
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', color: 'white', width: '100%', padding: '10px', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" key={`${sectionId}-custom-content`}>
                <label style={{ color: '#e0e0e0', display: 'block', marginBottom: '6px' }}>内容</label>
                <ReactQuill
                  value={currentData.content || ''}
                  onChange={(content) => handleInputChange(sectionId, 'content', content)}
                  placeholder="内容"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  style={{ borderRadius: '6px' }}
                />
              </div>
            </>
          )}
          
          {/* 保存和取消按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #3a3a3a' }}>
            <button
              onClick={handleCancelEdit}
              style={{
                backgroundColor: '#3a3a3a',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500'
              }}
            >
              取消
            </button>
            <button
              onClick={handleSaveEdit}
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500'
              }}
            >
              保存
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div 
          style={{ 
            padding: '20px', 
            backgroundColor: '#1e1e1e', 
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            lineHeight: '1.6',
            cursor: 'pointer'
          }}
          onClick={() => toggleSection(sectionId)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #3a3a3a' }}>
            {editingSectionName === sectionId ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={sectionNames[sectionId] || ''}
                  onChange={(e) => setResumes(prev => prev.map(resume => {
                    if (resume.id === currentResumeId) {
                      return {
                        ...resume,
                        sectionNames: {
                          ...resume.sectionNames,
                          [sectionId]: e.target.value
                        }
                      };
                    }
                    return resume;
                  }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSection(sectionId, sectionNames[sectionId])}
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a', 
                    color: '#3B82F6', 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold',
                    padding: '6px 10px',
                    borderRadius: '4px'
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleRenameSection(sectionId, sectionNames[sectionId])}
                  style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  确定
                </button>
                <button
                  onClick={() => setEditingSectionName(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#e0e0e0',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  取消
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ margin: 0, color: '#3B82F6', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {sectionNames[sectionId] || sectionTypes[section.type]?.name || ''}
                </h3>
                {!isPersonal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSectionName(sectionId);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#e0e0e0',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiEdit size={16} />
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!isPersonal && (
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(sectionId);
                  }}
                >
                  <FiTrash2 size={18} />
                </button>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e0e0e0'
              }}>
                <FiChevronDown size={20} />
              </div>
            </div>
          </div>
          
          {isPersonal && (
            <>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>
                {section.name}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#e0e0e0' }}>
                {section.phone} | {section.email}
              </div>
            </>
          )}
          
          {section.type === 'summary' && (
            <div style={{ color: '#e0e0e0' }}>
              {section.content ? <div dangerouslySetInnerHTML={{ __html: section.content }} /> : '无个人总结'}
            </div>
          )}
          
          {section.type === 'experience' && section.items && section.items.length > 0 && (
            section.items.map((item, idx) => (
              <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
                  {item.company || '未填写公司'}
                </div>
                <div style={{ fontSize: '1rem', color: '#e0e0e0' }}>
                  {item.position || '未填写职位'} | {item.period || '未填写时间'}
                </div>
              </div>
            ))
          )}
          
          {section.type === 'education' && section.items && section.items.length > 0 && (
            section.items.map((item, idx) => (
              <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
                  {item.school || '未填写学校'}
                </div>
                <div style={{ fontSize: '1rem', color: '#e0e0e0' }}>
                  {item.degree || '未填写学位'} | {item.period || '未填写时间'}
                </div>
              </div>
            ))
          )}
          
          {section.type === 'project' && section.items && section.items.length > 0 && (
            section.items.map((item, idx) => (
              <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
                  {item.projectName || '未填写项目名称'}
                </div>
                <div style={{ fontSize: '1rem', color: '#e0e0e0' }}>
                  {item.role || '未填写角色'} | {item.period || '未填写时间'}
                </div>
              </div>
            ))
          )}
          
          {section.type === 'skills' && (
            <div style={{ color: '#e0e0e0' }}>
              {section.content || '无技能信息'}
            </div>
          )}
          
          {section.type === 'custom' && (
            <>
              {section.title && (
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
                  {section.title}
                </div>
              )}
              <div style={{ color: '#e0e0e0' }}>
                {section.content ? (
                  section.content.length > 100 ? (
                    <div dangerouslySetInnerHTML={{ __html: section.content.substring(0, 100) + '...' }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  )
                ) : '无内容'}
              </div>
            </>
          )}
        </div>
      );
    }
  };

  // 渲染预览模块
  const renderPreviewSection = (section) => {
    if (section.type === 'personal') return null;

    let content = null;
    
    switch (section.type) {
      case 'summary':
        if (!section.content) return null;
        content = <div dangerouslySetInnerHTML={{ __html: section.content }} />;
        break;
      case 'experience':
        if (!section.items || section.items.length === 0) return null;
        content = section.items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: index < section.items.length - 1 ? '16px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {item.company && item.position && <span><strong>{item.company}</strong> | {item.position}</span>}
              {item.period && <span>{item.period}</span>}
            </div>
            {item.description && item.description.trim() !== '<p><br></p>' && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
          </div>
        ));
        break;
      case 'education':
        if (!section.items || section.items.length === 0) return null;
        content = section.items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: index < section.items.length - 1 ? '8px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {item.school && <strong>{item.school}</strong>}
                {item.school && item.degree && ' | '}
                {item.degree}
              </span>
              {item.period && <span>{item.period}</span>}
            </div>
            {item.description && item.description.trim() !== '<p><br></p>' && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
          </div>
        ));
        break;
      case 'skills':
        if (!section.content) return null;
        content = <div dangerouslySetInnerHTML={{ __html: section.content }} />;
        break;
      case 'project':
        if (!section.items || section.items.length === 0) return null;
        content = section.items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: index < section.items.length - 1 ? '16px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {item.projectName && item.role && <span><strong>{item.projectName}</strong> | {item.role}</span>}
              {item.period && <span>{item.period}</span>}
            </div>
            {item.description && item.description.trim() !== '<p><br></p>' && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
          </div>
        ));
        break;
      case 'custom':
        if (!section.title && !section.content) return null;
        content = (
          <>
            {section.title && <p><strong>{section.title}</strong></p>}
            {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} />}
          </>
        );
        break;
    }

    if (!content) return null;

    return (
      <div key={section.id} className="resume-section">
        <h2>{sectionNames[section.id] || sectionTypes[section.type]?.name}</h2>
        {content}
      </div>
    );
  };

  const allSections = getAllSections();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        {/* 头部 */}
        <header className="header">
          <h1>简历编辑器</h1>
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
            <button className="btn btn-sm btn-secondary" onClick={handleCreateResume}>
              新建简历
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => {
              if (resumes.length <= 1) {
                alert('至少需要保留一份简历');
                return;
              }
              setResumeToDelete(currentResumeId);
              setShowDeleteConfirm(true);
            }}>
              删除简历
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => {
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
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px',
                    padding: '8px 0',
                    minWidth: '160px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
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
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a2a'}
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
          </div>
        </header>

        {/* 主内容区 */}
        <main className="main">
          {/* 左侧编辑区 */}
          <section className="editor">
            <h2>编辑简历</h2>

            {allSections.map((section, index) => (
              <div key={section.id} style={{ marginBottom: '16px' }}>
                <DraggableSection 
                  section={section.id} 
                  index={index} 
                  moveSection={moveSection}
                  isExpanded={expandedSections[section.id]}
                  resumeData={resumeData}
                >
                  {renderSectionContent(section, expandedSections[section.id])}
                </DraggableSection>
              </div>
            ))}
          </section>

          {/* 右侧预览区 */}
          <aside className="preview">
            <h2>实时预览</h2>
            <div className={`resume-preview ${isCompressed ? 'compressed' : ''}`} ref={previewRef}>
              <div className="resume-header">
                <h1>{resumeData.personal.name}</h1>
                <p>{resumeData.personal.title}</p>
                <p>{resumeData.personal.email} | {resumeData.personal.phone}</p>
                {resumeData.personal.address && <p>{resumeData.personal.address}</p>}
              </div>

              {allSections.map(section => renderPreviewSection(section))}
            </div>
          </aside>
        </main>

        {/* 删除确认弹窗 */}
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
            <div style={{
              backgroundColor: '#1e1e1e',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              width: '100%'
            }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>确认删除</h3>
              <p style={{ color: '#e0e0e0', marginBottom: '24px' }}>确定要删除当前简历吗？此操作不可恢复。</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setResumeToDelete(null);
                  }}
                  style={{
                    backgroundColor: '#3a3a3a',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => resumeToDelete && handleDeleteResume(resumeToDelete)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部 */}
        <footer className={`footer ${isFooterVisible ? 'visible' : ''}`}>
          <p>© 2026 简历编辑器 - 专业简历制作工具</p>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
