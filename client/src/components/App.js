import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import NavBar from './Navbar';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
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
