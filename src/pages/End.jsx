import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Info.module.css';

const End = () => {
  return(
    <div className={styles.root}>
      <h1>Congratulations! You did it!</h1>
      <p>Want to try one more time?</p>
      <Link className={styles.btn} to="/game">Start</Link>
    </div>
  )
}

export default End;