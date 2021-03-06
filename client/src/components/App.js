import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <main>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/:userId" component={Dashboard} />
            </Switch>
          </Router>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
