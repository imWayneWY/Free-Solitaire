import React, { useEffect, useState, useMemo } from 'react';
import Foundations from './../components/Foundations';
import CascadeColumns from './../components/CascadeColumns';
import FreeCells from './../components/FreeCells';
import {cardsJson} from './../genCardsJson.js';
import styles from './Game.module.css';

const Game = () => {
  const [msg, setMsg] = useState('Hi, welcome here. Hope you will enjoy this game');
  const [errHolding,setErrHolding] = useState(false);
  const [colCards, setColCards] = useState([]);
  const [foundCards, setFoundCards] = useState({
    heart: [],
    spade: [],
    diamond: [],
    club: [],
  });
  const [freeCards, setFreeCards] = useState([null,null,null,null]);

  const [activeLocation, setActiveLocation] = useState({});
  const encourageWords = [
    'Nice job',
    'Nice try',
    'Good thinking',
    'Nice move',
    'Good move',
    'Great try',
    'That is a great idea',
    'I love your thinking',
    'Good job',
    'Good try',
    'Awesome',
    'Great',
    'Not bad',
    'Well done',
    'Great, keep moving'
  ];
  const encourage = () => {
    return(encourageWords[parseInt(Math.random() * encourageWords.length)]);
  }
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
    setErrHolding(false);
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
    if(errHolding){
      setMsg('You can not hold unsorted cards')
      return;
    }
    // move to col
    let { fromColIndex, fromCardIndex } = activeLocation;
    if (fromColIndex === toColIndex) {
      setMsg('Hmm... interesting');
      return;
    }
    let toCol = colCards[toColIndex];
    if (fromColIndex >= 0) {
      // come from col
      let fromCol = colCards[fromColIndex];
      const moveCardsNum = fromCol.length - fromCardIndex;
      if (moveCardsNum > available+1) {
        setMsg('There is no enought space for this move');
        return;
      }
      let fromCard = fromCol[fromCardIndex];
      let toCard;
      if(toCol.length>0) {
        toCard = toCol[toCol.length-1];
      }
      if (toCard && (toCard.value - fromCard.value !== 1 || toCard.color === fromCard.color)) {
        setMsg('This card can not place here');
        return;
      }

      let tmpCards = fromCol.splice(fromCardIndex, fromCol.length);
      toCol.splice(toCol.length,0,...tmpCards);
      setMsg(encourage());
      setNewColCards(fromColIndex,fromCol, toColIndex, toCol);
      
    } else {
      // come from free cell
      let tmpCard = freeCards[fromCardIndex];
      let toCard;
      if(toCol.length>0) {
        toCard = toCol[toCol.length-1];
      }
      if (toCard && (toCard.value - tmpCard.value !== 1 || toCard.color === tmpCard.color)) {
        setMsg('This card can not place here');
        return;
      }
      toCol.push(tmpCard);
      setMsg(encourage());
      setNewColCards(-1,null,toColIndex,toCol);
      setNewFreeCards(fromCardIndex,-1,null);
    }
  }

  const onDropFreeCells = (toCellIndex) => {
    if(errHolding){
      setMsg('You can not hold unsorted cards')
      return;
    }
    // move to free cells
    let { fromColIndex, fromCardIndex } = activeLocation;
    if (freeCards[toCellIndex]) {
      setMsg('This cell already has a card');
      return;
    }
    if (fromColIndex >= 0) {
      let fromCol = colCards[fromColIndex];
      if (fromCol.length-1 !== fromCardIndex) {
        setMsg('Only one card can be placed in free cell');
        return;
      }

      let tmpCard = fromCol.splice(fromCardIndex, 1)[0];
      setMsg(encourage());
      setNewColCards(fromColIndex, fromCol);
      setNewFreeCards(-1,toCellIndex, tmpCard);
    } else {
      let tmpCard = freeCards[fromCardIndex];
      setMsg(encourage());
      setNewFreeCards(fromCardIndex, toCellIndex, tmpCard);
    }
  }

  const onDropFound = (type) => {
    if(errHolding){
      setMsg('You can not hold unsorted cards')
      return;
    }
    let {fromColIndex, fromCardIndex } = activeLocation;
    let toFoundCardCol = foundCards[type];
    if (fromColIndex >= 0) {
      let fromCol = colCards[fromColIndex];
      if (fromCol.length-1 !== fromCardIndex) {
        // not single card, return
        setMsg('Only one card can be placed in foundation position');
        return;
      }
      let fromCard = fromCol[fromCardIndex];
      if (type !== fromCard.type) {
        setMsg('Wrong type for this position');
        return;
      }
      let toCard;
      if ( toFoundCardCol.length>0 ) {
        toCard=toFoundCardCol[toFoundCardCol.length-1];
      }
      if (toCard && fromCard.value - toCard.value !== 1) {
        setMsg('Not its turn yet');
        return;
      } else if (!toCard && fromCard.value !== 1) {
        setMsg('Not its turn yet');
        return;
      }
      let tmpCard = fromCol.splice(fromCardIndex,1)[0];
      setMsg(encourage());
      setNewColCards(fromColIndex,fromCol);
      setNewFoundCards(type,tmpCard);
    } else {
      let fromCard = freeCards[fromCardIndex];
      if(type !== fromCard.type){
        setMsg('Wrong type for this position');
        return;
      }
      let toCard;
      if ( toFoundCardCol.length>0 ) {
        toCard=toFoundCardCol[toFoundCardCol.length-1];
      }
      if (toCard && fromCard.value - toCard.value !== 1) {
        setMsg('Not its turn yet')
        return;
      }
      setMsg(encourage());
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
      setMsg(encourage());
      setNewColCards(fromColIndex,fromCol);
      setNewFreeCards(-1,index,tmpCard);
    } else {
      setMsg('Oops, all the free cells have been used')
    }
  }

  const onErrorHold = () => {
    setErrHolding(true);
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
      <div className={styles.msg}>{msg}</div>
      <CascadeColumns className={styles.cascadeColumns} cards={colCards} onDragStart={onDragStart} onDrop={onDropCols} handleClickCard={handleClickCard} onErrorHold={onErrorHold}/>
    </div>

  )
}

export default Game;