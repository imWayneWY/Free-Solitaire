import React, { useEffect } from 'react';
import Columns from './Columns';
import styles from './CascadeColumns.module.css';
import {withRouter} from 'react-router-dom'

const CascadeColumns = ({cards, onDragStart, onDrop, handleClickCard,history}) => {
  useEffect(() => {
    let flg = true; // if all the cards have been sorted
    if (cards.length === 0) {
      // haven't been init
      flg = false;
    } else {
      cards.some(col => {
        for(let i=0;i<col.length-1; i++){
          if(col[i].value - col[i+1].value !==1 || col[i].color === col[i+1].color) {
            // haven't been finished
            flg = false;
            break;
          }
        }
        // no need to do the loop anymore
        if (!flg) { return true }
      })
    }
    // succ!
    flg && history.push('/end');
  },[cards,history])
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

export default withRouter(CascadeColumns);