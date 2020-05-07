import React from 'react';
import styles from './Card.module.css';

export default ({card, handleDrag, draggable, handleClick}) => {
  const onDragStart = () => {
    handleDrag(card.id);
  }
  const onClick = (e) => {
    e.stopPropagation();
    handleClick();
  }
  return(
    <div className={styles.root} style={{color: card.color}} draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <span>{card.type}</span>
      <span>{card.value}</span>
    </div>
  )
}