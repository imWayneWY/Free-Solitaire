import React  from 'react';
import Card from './Card';
import Icon from './Icon';
import styles from './Foundations.module.css';


export default ({cards,onDrop}) => {
  const canDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }
  const handleDrop = (type) => {
    onDrop(type);
  }
  const handleDrag = (id) => {
    return;
  }
  return(
    <div className={styles.root}>
      <div className={styles.foundation} onDragOver={canDrop} onDragEnter={canDrop} style={{color: 'red'}} onDrop={()=>handleDrop('heart')}>
        {
          cards['heart'].length > 0 
          ? <div className={styles.card}><Card card={cards['heart'][cards['heart'].length-1]} handleDrag={handleDrag} draggable="false" handleClick={() => false}/></div> 
          : <div className={styles.icon}><Icon type="heart" /></div>
        }
      </div>
      <div className={styles.foundation} onDragOver={canDrop} onDragEnter={canDrop} onDrop={()=>handleDrop('spade')}>
        {
          cards['spade'].length > 0 
          ? <div className={styles.card}><Card card={cards['spade'][cards['spade'].length-1]} handleDrag={handleDrag} draggable="false" handleClick={() => false}/></div> 
          : <div className={styles.icon}><Icon type="spade" /> </div>
        }
      </div>
      <div className={styles.foundation} onDragOver={canDrop} onDragEnter={canDrop} style={{color: 'red'}} onDrop={()=>handleDrop('diamond')}>
        {
          cards['diamond'].length > 0 
          ? <div className={styles.card}><Card card={cards['diamond'][cards['diamond'].length-1]} handleDrag={handleDrag} draggable="false" handleClick={() => false}/></div> 
          : <div className={styles.icon}><Icon type="diamond" /></div>
        }
      </div>
      <div className={styles.foundation} onDragOver={canDrop} onDragEnter={canDrop} onDrop={()=>handleDrop('club')}>
        {
          cards['club'].length > 0 
          ? <div className={styles.card}><Card card={cards['club'][cards['club'].length-1]} handleDrag={handleDrag} draggable="false" handleClick={() => false}/></div> 
          : <div className={styles.icon}><Icon type="club" /></div>
        }
      </div>
    </div>
  )
}