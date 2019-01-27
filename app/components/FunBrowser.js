import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import AppRoutesDrawer from './AppRoutesDrawer';

const appBarStyle = {
  backgroundColor: '#2196f3'
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

class FunBrowser extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      openRoutesDrawer: false
    };
  }

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
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
              onClick={this.onOpenRoutesDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.title}>
              DEFEM Preprocessor - Function browser
            </Typography>
          </Toolbar>
        </AppBar>
        <AppRoutesDrawer
          open={this.state.openRoutesDrawer}
          onClose={this.onRoutesDrawerClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(FunBrowser);
