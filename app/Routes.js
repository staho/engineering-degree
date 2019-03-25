import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
// import HomePage from './containers/HomePage';
import NotepadMainPage from './containers/NotepadMainPage';
import FunBrowserPage from './containers/FunBrowserPage';
import TemplateEditorPage from './containers/TemplateEditorPage';

export default () => (
  <App>
    <Switch>
      <Route exact path={routes.NOTEPAD} component={NotepadMainPage} />
      <Route exact path={routes.FUN_BROWSER} component={FunBrowserPage} />
      <Route
        exact
        path={routes.TEMPLATE_EDITOR}
        component={TemplateEditorPage}
      />
    </Switch>
  </App>
);
