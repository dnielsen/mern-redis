import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App';
import Home from './components/Home';
import Auth from './components/Auth';
import NotFound from './components/App/NotFound';
import './styles/styles.scss';

render((
  <Router>
        <App>
            <Switch>
                <Route exact path="/" component={Auth}/>
                <Route path="/home" component = {Home} />
                <Route component={NotFound}/>
            </Switch>
        </App>
  </Router>
), document.getElementById('app'));
