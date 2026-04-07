import React from 'react';
import { FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ReactQuill from 'react-quill';

const SectionContent = ({ 
  section, 
  isExpanded, 
  editingSectionId, 
  editingData, 
  sectionNames, 
  sectionTypes, 
  currentResumeId, 
  editingSectionName,
  toggleSection, 
  handleInputChange, 
  handleItemInputChange, 
  handleAddItem, 
  handleDeleteItem, 
  handleRenameSection, 
  handleCancelEdit, 
  handleSaveEdit, 
  handleDeleteSection,
  setResumes,
  setEditingSectionName
}) => {
  const sectionId = section.id;
  const isPersonal = section.type === 'personal';
  const currentData = isExpanded && editingData && editingSectionId === sectionId ? editingData : section;

  if (isExpanded) {
    return (
      <div 
        style={{ 
          padding: '24px', 
          backgroundColor: 'var(--module-bg)', 
          borderRadius: 'var(--border-radius)',
          color: 'var(--text-color)',
          fontSize: '1rem',
          lineHeight: '1.6',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => toggleSection(sectionId)}>
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
                  backgroundColor: 'var(--input-bg)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--primary-color)', 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-sans)'
                }}
                autoFocus
              />
              <button
                onClick={() => handleRenameSection(sectionId, sectionNames[sectionId])}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition)'
                }}
              >
                确定
              </button>
              <button
                onClick={() => setEditingSectionName(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition)'
                }}
              >
                取消
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>
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
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '6px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)'
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
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)',
                  transition: 'var(--transition)'
                }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(sectionId);
              }}
            >
              <FiChevronUp size={20} />
            </div>
          </div>
        </div>
        
        {isPersonal && (
          <div className="personal-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-name`}>
              <input
                type="text"
                value={currentData.name}
                onChange={(e) => handleInputChange(sectionId, 'name', e.target.value)}
                required
                placeholder="姓名 *"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-title`}>
              <input
                type="text"
                value={currentData.title}
                onChange={(e) => handleInputChange(sectionId, 'title', e.target.value)}
                required
                placeholder="职位 *"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-email`}>
              <input
                type="email"
                value={currentData.email}
                onChange={(e) => handleInputChange(sectionId, 'email', e.target.value)}
                required
                placeholder="邮箱 *"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }} key={`${sectionId}-phone`}>
              <input
                type="tel"
                value={currentData.phone}
                onChange={(e) => handleInputChange(sectionId, 'phone', e.target.value)}
                required
                placeholder="电话 *"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }} key={`${sectionId}-address`}>
              <input
                type="text"
                value={currentData.address}
                onChange={(e) => handleInputChange(sectionId, 'address', e.target.value)}
                placeholder="地址"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
          </div>
        )}
        
        {currentData.type === 'summary' && (
          <div className="form-group">
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
                  <h4 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '600' }}>
                    {currentData.type === 'experience' && (item.company || `工作经历 ${idx + 1}`)}
                    {currentData.type === 'education' && (item.school || `教育经历 ${idx + 1}`)}
                    {currentData.type === 'project' && (item.projectName || `项目经历 ${idx + 1}`)}
                  </h4>
                  <button 
                    onClick={() => handleDeleteItem(sectionId, item.id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: 'var(--error-color)', 
                      border: '1px solid var(--error-color)', 
                      padding: '6px', 
                      borderRadius: 'var(--border-radius)', 
                      cursor: 'pointer', 
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                
                {currentData.type === 'experience' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div key={`${item.id}-company`}>
                        <input
                          type="text"
                          placeholder="公司名称"
                          value={item.company}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'company', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div key={`${item.id}-position`}>
                        <input
                          type="text"
                          placeholder="职位"
                          value={item.position}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'position', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                        <input
                          type="text"
                          placeholder="时间段"
                          value={item.period}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                    </div>
                    <div key={`${item.id}-description`}>
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
                        <input
                          type="text"
                          placeholder="学校名称"
                          value={item.school}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'school', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div key={`${item.id}-degree`}>
                        <input
                          type="text"
                          placeholder="学位/专业"
                          value={item.degree}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'degree', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                        <input
                          type="text"
                          placeholder="时间段"
                          value={item.period}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                    </div>
                    <div key={`${item.id}-description`}>
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
                        <input
                          type="text"
                          placeholder="项目名称"
                          value={item.projectName}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'projectName', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div key={`${item.id}-role`}>
                        <input
                          type="text"
                          placeholder="角色"
                          value={item.role}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'role', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }} key={`${item.id}-period`}>
                        <input
                          type="text"
                          placeholder="时间段"
                          value={item.period}
                          onChange={(e) => handleItemInputChange(sectionId, item.id, 'period', e.target.value)}
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
                        />
                      </div>
                    </div>
                    <div key={`${item.id}-description`}>
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
                  backgroundColor: 'var(--primary-color)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 'var(--border-radius)', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition)'
                }}
              >
                新增{currentData.type === 'experience' ? '工作经历' : currentData.type === 'education' ? '教育经历' : '项目经历'}
              </button>
            </div>
          </>
        )}
        
        {currentData.type === 'skills' && (
          <div className="form-group" key={`${sectionId}-skills`}>
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
              <input
                type="text"
                placeholder="标题"
                value={currentData.title}
                onChange={(e) => handleInputChange(sectionId, 'title', e.target.value)}
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius)', fontFamily: 'var(--font-sans)', transition: 'var(--transition)' }}
              />
            </div>
            <div className="form-group" key={`${sectionId}-custom-content`}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleCancelEdit}
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              padding: '12px 24px',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: '0.9375rem',
              fontWeight: '500',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#35354E';
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.boxShadow = 'var(--shadow)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--input-bg)';
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            取消
          </button>
          <button
            onClick={handleSaveEdit}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: '0.9375rem',
              fontWeight: '500',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition)',
              boxShadow: 'var(--shadow)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-hover)';
              e.target.style.boxShadow = 'var(--shadow-hover)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color)';
              e.target.style.boxShadow = 'var(--shadow)';
              e.target.style.transform = 'translateY(0)';
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
        className="section-collapsed"
        style={{ 
          padding: '20px', 
          backgroundColor: 'var(--module-bg)', 
          borderRadius: 'var(--border-radius)',
          color: 'var(--text-color)',
          fontSize: '1rem',
          lineHeight: '1.6',
          cursor: 'pointer',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow)',
          transition: 'var(--transition)'
        }}
        onClick={() => toggleSection(sectionId)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
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
                  backgroundColor: 'var(--input-bg)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--primary-color)', 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-sans)'
                }}
                autoFocus
              />
              <button
                onClick={() => handleRenameSection(sectionId, sectionNames[sectionId])}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition)'
                }}
              >
                确定
              </button>
              <button
                onClick={() => setEditingSectionName(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition)'
                }}
              >
                取消
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>
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
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '6px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)'
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
                  color: 'var(--error-color)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection(sectionId);
                }}
                onMouseEnter={(e) => e.target.style.color = '#DC2626'}
                onMouseLeave={(e) => e.target.style.color = 'var(--error-color)'}
              >
                <FiTrash2 size={18} />
              </button>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              <FiChevronDown size={20} />
            </div>
          </div>
        </div>
        
        {isPersonal && (
          <>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-color)' }}>
              {section.name}
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {section.phone} | {section.email}
            </div>
          </>
        )}
        
        {section.type === 'summary' && (
          <div style={{ color: 'var(--text-color)' }}>
            {section.content ? <div dangerouslySetInnerHTML={{ __html: section.content }} /> : '无个人总结'}
          </div>
        )}
        
        {section.type === 'experience' && section.items && section.items.length > 0 && (
          section.items.map((item, idx) => (
            <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)' }}>
                {item.company || '未填写公司'}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                {item.position || '未填写职位'} | {item.period || '未填写时间'}
              </div>
            </div>
          ))
        )}
        
        {section.type === 'education' && section.items && section.items.length > 0 && (
          section.items.map((item, idx) => (
            <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)' }}>
                {item.school || '未填写学校'}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                {item.degree || '未填写学位'} | {item.period || '未填写时间'}
              </div>
            </div>
          ))
        )}
        
        {section.type === 'project' && section.items && section.items.length > 0 && (
          section.items.map((item, idx) => (
            <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? '16px' : '0' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)' }}>
                {item.projectName || '未填写项目名称'}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                {item.role || '未填写角色'} | {item.period || '未填写时间'}
              </div>
            </div>
          ))
        )}
        
        {section.type === 'skills' && (
          <div style={{ color: 'var(--text-color)' }}>
            {section.content || '无技能信息'}
          </div>
        )}
        
        {section.type === 'custom' && (
          <>
            {section.title && (
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)' }}>
                {section.title}
              </div>
            )}
            <div style={{ color: 'var(--text-color)' }}>
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

export default React.memo(SectionContent, (prevProps, nextProps) => {
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.editingSectionId === nextProps.editingSectionId &&
    prevProps.editingData === nextProps.editingData &&
    prevProps.editingSectionName === nextProps.editingSectionName &&
    prevProps.sectionNames[prevProps.section.id] === nextProps.sectionNames[nextProps.section.id]
  );
});
