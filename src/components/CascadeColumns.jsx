import React from 'react';
import Columns from './Columns';
import styles from './CascadeColumns.module.css';

export default ({cards, onDragStart, onDrop, handleClickCard}) => {

  return(
    <div className={styles.root}>
      {
        cards.map((col, index) => 
          <Columns key={index} col={col} colIndex={index} onDragStart={onDragStart} onDrop={onDrop} handleClickCard={handleClickCard}/>
        )
      }
    </div>
  )
}