import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const appBarStyle = {
  backgroundColor: '#2196f3'
};

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
});

class AppBarDefem extends Component<Props> {
  static defaultProps = {
    type: 'xxx',
    onOpenRoutesDrawer: () => {}
  };

  typeChanger = type => {
    switch (type) {
      case 'EDITOR':
        return 'DEFEM Preprocessor - Structure editor';
      case 'FUN_BROWSER':
        return 'DEFEM Preprocessor - Function browser';
      default:
        return 'Error';
    }
  };

  render() {
    const { classes } = this.props;
    const { onOpenRoutesDrawer } = this.props;
    const { type } = this.props;

    return (
      <AppBar
        position="absolute"
        className={classes.appBar}
        style={appBarStyle}
      >
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={onOpenRoutesDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {this.typeChanger(type)}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

AppBarDefem.propTypes = {
  type: PropTypes.string,
  onOpenRoutesDrawer: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(AppBarDefem);
