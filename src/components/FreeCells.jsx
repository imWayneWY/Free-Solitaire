import React, { useCallback } from 'react';
import Card from './Card';
import styles from './FreeCells.module.css';

export default ({cards, onDrop, onDragStart}) => {
  const canDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }
  const handleDrop = useCallback((index) => {
    onDrop(index);
  },[onDrop])
  const handleDrag = (id) => {
    for(let i=0; i<4; i++) {
      if (cards[i] && cards[i].id === id) {
        onDragStart(-1,i);
      }
    }
  }
  return(
    <div className={styles.root}>
      {
        cards.map((card,index) => 
          <div key={index} onDrop={() => handleDrop(index)} onDragOver={canDrop} onDragEnter={canDrop} className={styles.freeCell}>
            {
              card && <div className={styles.card}><Card card={card} handleDrag={handleDrag} draggable="true" handleClick={() => false}/></div>
            }
          </div>
        )
      }
    </div>
  )
}