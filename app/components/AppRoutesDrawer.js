import React from 'react';
// import Drawer from '@material-ui/core/Drawer';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer
} from '@material-ui/core';
import { Notes, Bookmarks } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  list: {
    width: 250
  }
});

class AppRoutesDrawer extends React.Component<Props> {
  props: Props;

  render() {
    const { classes } = this.props;

    const listOfRoutes = (
      <div className={classes.list}>
        <List>
          <ListItem button key="notepad-main">
            <ListItemIcon>
              <Notes />
            </ListItemIcon>
            <ListItemText primary="Editor" />
          </ListItem>
          <ListItem button key="function-browser">
            <Link to={routes.FUN_BROWSER}>
              <ListItemIcon>
                <Bookmarks />
              </ListItemIcon>
              <ListItemText primary="Function browser" />
            </Link>
          </ListItem>
        </List>
      </div>
    );

    return (
      <Drawer
        open={this.props.open}
        onClose={this.props.onClose}
        variant="temporary"
      >
        <div
          tabIndex={0}
          role="button"
          onClick={this.props.onClose}
          onKeyDown={this.props.onClose}
        >
          {listOfRoutes}
        </div>
      </Drawer>
    );
  }
}

AppRoutesDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppRoutesDrawer);
