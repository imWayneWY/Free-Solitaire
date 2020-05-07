import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import End from './pages/End';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/game' component={Game} />
          <Route path='/end' component={End} />
          <Route path='/' component={Welcome} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
