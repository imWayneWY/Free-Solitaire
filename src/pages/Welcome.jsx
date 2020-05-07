import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Info.module.css';

const Welcome = () => {
  return(
    <div className={styles.root}>
      <h1>Welcome to online FreeCell Solitaire Game</h1>
      <p>Using React to implement a online version of FreeCell Solitaire Game. Hope you enjoy it :)</p>
      <Link className={styles.btn} to="/game">Start Play</Link>
    </div>
  )
}

export default Welcome;