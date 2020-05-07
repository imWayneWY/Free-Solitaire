import React from 'react';
import Card from './Card';
import styles from './Columns.module.css';

export default ({col, colIndex, onDragStart, onDrop, handleClickCard}) => {
  const handleDrag = (id) => {
    if(id === col[col.length-1].id){
      onDragStart(colIndex, col.length-1);
    } else {
      let flg = true; // flg is to record if the drag is allowed
      let index = -1;
      for(let i = col.length-1; i>0; i--){
        if (col[i-1].value - col[i].value !== 1 || col[i].color === col[i-1].color) {
          // not allowed
          flg = false;
          break;
        }
        if (flg && col[i-1].id === id) {
          index = i-1;
          break;
        }
      }
      if(flg){
        onDragStart(colIndex, index);
      } else {
        console.log('false')
        return;
      }
    }
  }

  const canDrop = (e) => {
    // to make this div can be dropped
    e.stopPropagation();
    e.preventDefault();
  }

  const handleDrop = ()  => {
    onDrop(colIndex);
  }

  const handleClick = () => {
    handleClickCard(colIndex);
  }
  return(
    <div className={styles.root} onDrop={handleDrop} onDragOver={canDrop} onDragEnter={canDrop} >
      {
        col.map((card,index) => 
          <div key={index} className={styles.card} style={{top: `${index*30}px`}}>
            <Card card={card} handleDrag={handleDrag} draggable="true" handleClick={handleClick}/>
          </div>)
      }
    </div>
  )
}