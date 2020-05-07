import React, { useEffect, useState, useMemo } from 'react';
import Foundations from './../components/Foundations';
import CascadeColumns from './../components/CascadeColumns';
import FreeCells from './../components/FreeCells';
import {cardsJson} from './../genCardsJson.js';
import styles from './Game.module.css';

const Game = () => {
  const [colCards, setColCards] = useState([]);
  const [foundCards, setFoundCards] = useState({
    heart: [],
    spade: [],
    diamond: [],
    club: [],
  });
  const [freeCards, setFreeCards] = useState([null,null,null,null]);

  const [activeLocation, setActiveLocation] = useState({});
  
  useEffect(()=>{
    let cards = JSON.parse(cardsJson);
    function randomsort(a,b){
      return Math.random()>.5 ? -1 : 1;
    }
    let randomCards = cards.sort(randomsort);
    let colCards = [[],[],[],[],[],[],[],[]];
    let colNum = 0;
    randomCards.forEach(card => {
      colCards[colNum].push(card);
      colNum===7 ? colNum=0 : colNum++ ;
    })
    setColCards(colCards);  
  },[]);

  const available = useMemo(() => {
    let num = 0;
    freeCards.forEach(card => !card && num++);
    colCards.forEach(col => (col && col.length===0) && num++);
    return num;
  },[freeCards,colCards]);

  // fromColIndex :  index of the column, if it is -1, then it's come from free cell
  // fromCardIndex : index of the card in the column
  const onDragStart = (fromColIndex, fromCardIndex) => {
    setActiveLocation({
      fromColIndex,
      fromCardIndex
    })
  }
  const setNewColCards = (fromColIndex, fromCol,toColIndex, toCol) => {
    const newColCards = [];
    for(let i=0; i< colCards.length; i++){
      if (i === fromColIndex) {
        newColCards[fromColIndex] = fromCol;
      } else if (i===toColIndex) {
        newColCards[toColIndex] = toCol;
      } else {
        newColCards[i] = colCards[i];
      }
    }
    setColCards(newColCards);
  }
  const setNewFreeCards = (fromCellIndex, toCellIndex, newCard) => {
    let newFreeCards = [];
    freeCards.forEach((card,index) => {
      if (index===fromCellIndex) {
        newFreeCards[index]=null;
      } else if (index===toCellIndex) {
        newFreeCards[index] = newCard;
      } else {
        newFreeCards[index] = card;
      }
    })
    setFreeCards(newFreeCards);
  }
  const setNewFoundCards = (type,newCard) => {
    let newArr = foundCards[type].push(newCard);
    let newFoundCards = Object.assign({}, foundCards, {type: newArr});
    setFoundCards(newFoundCards);
  }
  const onDropCols = (toColIndex) => {
      // move to col
      let { fromColIndex, fromCardIndex } = activeLocation;
      let toCol = colCards[toColIndex];
      if (fromColIndex >= 0) {
        // come from col
        let fromCol = colCards[fromColIndex];
        const moveCardsNum = fromCol.length - fromCardIndex;
        if (moveCardsNum > available+1) {
          // there is no enough space for this move
          return;
        }
        let fromCard = fromCol[fromCardIndex];
        let toCard;
        if(toCol.length>0) {
          toCard = toCol[toCol.length-1];
        }
        if (toCard && (toCard.value - fromCard.value !== 1 || toCard.color === fromCard.color)) {
          return;
        }

        let tmpCards = fromCol.splice(fromCardIndex, fromCol.length);
        toCol.splice(toCol.length,0,...tmpCards);

        setNewColCards(fromColIndex,fromCol, toColIndex, toCol);
        
      } else {
        // come from free cell
        let tmpCard = freeCards[fromCardIndex];
        let toCard;
        if(toCol.length>0) {
          toCard = toCol[toCol.length-1];
        }
        if (tmpCard && (toCard.value - tmpCard.value !== 1 || toCard.color === tmpCard.color)) {
          return;
        }
        toCol.push(tmpCard);
        setNewColCards(-1,null,toColIndex,toCol);
        setNewFreeCards(fromCardIndex,-1,null);
      }
  }

  const onDropFreeCells = (toCellIndex) => {
    // move to free cells
    let { fromColIndex, fromCardIndex } = activeLocation;
    if (freeCards[toCellIndex]) {
      // that cell has a card already 
      return;
    }
    if (fromColIndex >= 0) {
      let fromCol = colCards[fromColIndex];
      if (fromCol.length-1 !== fromCardIndex) {
        // not single card, return
        return;
      }

      let tmpCard = fromCol.splice(fromCardIndex, 1)[0];
      setNewColCards(fromColIndex, fromCol);
      setNewFreeCards(-1,toCellIndex, tmpCard);
    } else {
      let tmpCard = freeCards[fromCardIndex];
      setNewFreeCards(fromCardIndex, toCellIndex, tmpCard);
    }
  }

  const onDropFound = (type) => {
    let {fromColIndex, fromCardIndex } = activeLocation;
    let toFoundCardCol = foundCards[type];
    if (fromColIndex >= 0) {
      let fromCol = colCards[fromColIndex];
      if (fromCol.length-1 !== fromCardIndex) {
        // not single card, return
        return;
      }
      let fromCard = fromCol[fromCardIndex];
      if (type !== fromCard.type) {
        return;
      }
      let toCard;
      if ( toFoundCardCol.length>0 ) {
        toCard=toFoundCardCol[toFoundCardCol.length-1];
      }
      if (toCard && fromCard.value - toCard.value !== 1) {
        return;
      }
      let tmpCard = fromCol.splice(fromCardIndex,1)[0];
      setNewColCards(fromColIndex,fromCol);
      setNewFoundCards(type,tmpCard);
    } else {
      let fromCard = freeCards[fromCardIndex];
      if(type !== fromCard.type){
        return;
      }
      let toCard;
      if ( toFoundCardCol.length>0 ) {
        toCard=toFoundCardCol[toFoundCardCol.length-1];
      }
      if (toCard && fromCard.value - toCard.value !== 1) {
        return;
      }
      setNewFreeCards(fromCardIndex, -1, null);
      setNewFoundCards(type,fromCard);
    }
  }

  const handleClickCard = (fromColIndex) => {
    let flg = false;
    let index;
    for(let i=0; i<4; i++) {
      if (!freeCards[i]) {
        flg = true;
        index = i;
        break;
      }
    }
    if (flg) {
      let fromCol=colCards[fromColIndex];
      let tmpCard = fromCol.splice(fromCol.length-1,1)[0];
      setNewColCards(fromColIndex,fromCol);
      setNewFreeCards(-1,index,tmpCard);
    }
  }


  return(
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.freeCells}>
          <FreeCells cards={freeCards} onDrop={onDropFreeCells} onDragStart={onDragStart} />
        </div>
        <div className={styles.foundations}>
          <Foundations cards={foundCards} onDrop={onDropFound} />
        </div>
      </div>
      <CascadeColumns className={styles.cascadeColumns} cards={colCards} onDragStart={onDragStart} onDrop={onDropCols} handleClickCard={handleClickCard} />
    </div>

  )
}

export default Game;