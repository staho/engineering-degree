import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
// import HomePage from './containers/HomePage';
import NotepadMainPage from './containers/NotepadMainPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={NotepadMainPage} />
      <Route path={routes.NOTEPAD} component={NotepadMainPage} />
    </Switch>
  </App>
);
