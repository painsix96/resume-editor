import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableSection = ({ section, index, moveSection, children, isExpanded, resumeData }) => {
  const ref = React.useRef(null);
  
  // 个人信息模块不可拖动
  if (section === 'personal') {
    return <div style={{ marginBottom: '16px' }}>{children}</div>;
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
        marginBottom: '16px',
        cursor: isExpanded ? 'default' : 'move',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableSection;