import React, { useMemo } from 'react';
import Icon from './Icon';
import styles from './Card.module.css';

export default ({card, handleDrag, draggable, handleClick}) => {
  const onDragStart = () => {
    handleDrag(card.id);
  }
  const onClick = (e) => {
    e.stopPropagation();
    handleClick();
  }

  const showValue = useMemo(()=>{
    switch(card.value){
      case 1:
        return 'A';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return card.value.toString();
    }
  },[card.value])

  return(
    <div className={styles.root} style={{color: card.color}} draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className={styles.title}>
        <div className={styles.value}>{showValue}</div>
        <div className={styles.smallIcon}><Icon type={card.type} /></div>
      </div>
      <div className={styles.icon}>
        <Icon type={card.type}/>
      </div>
      <div className={styles.footer}>
        <div className={styles.value}>{showValue}</div>
        <div className={styles.smallIcon}><Icon type={card.type} /></div>
      </div>
    </div>
  )
}