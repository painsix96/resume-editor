import React from 'react';

const PreviewSection = ({ section, sectionNames, sectionTypes, onClick }) => {
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
        <div key={item.id} style={{ marginBottom: index < section.items.length - 1 ? '8px' : '0' }}>
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
    <div 
      key={section.id} 
      className="resume-section"
      onClick={() => onClick(section.id)}
      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
    >
      <h2>{sectionNames[section.id] || sectionTypes[section.type]?.name}</h2>
      {content}
    </div>
  );
};

export default React.memo(PreviewSection, (prevProps, nextProps) => {
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.sectionNames[prevProps.section.id] === nextProps.sectionNames[nextProps.section.id] &&
    JSON.stringify(prevProps.section) === JSON.stringify(nextProps.section)
  );
});
