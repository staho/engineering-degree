import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { fade } from '@material-ui/core/styles/colorManipulator';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const appBarStyle = {
  backgroundColor: '#2196f3'
};

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  }
});

const delimiters = [
  {
    value: 'SPACE',
    realValue: ' ',
    label: 'Space'
  },
  {
    value: 'TAB',
    realValue: '\t',
    label: 'Tab'
  },
  {
    value: ';',
    realValue: ';',
    label: 'Semicolon'
  }
];

const Transition = props => <Slide direction="up" {...props} />;

// TODO: Make settings pop-up
class AppBarDefem extends Component<Props> {
  static defaultProps = {
    type: 'xxx',
    onOpenRoutesDrawer: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      openSettings: false,
      // delimiter: ' ',
      delimiterLabel: 'Space'
    };
  }

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

  onSettingsClick = () => {
    this.setState({ openSettings: true });
  };

  onSettingsClose = () => {
    this.setState({ openSettings: false });
  };

  handleChange = event => {
    const delimiterObj = delimiters.find(
      delim => delim.label === event.target.value
    );
    this.setState({
      // delimiter: delimiterObj.realValue,
      delimiterLabel: delimiterObj.label
    });
  };

  render() {
    const { classes } = this.props;
    const { onOpenRoutesDrawer } = this.props;
    const { type } = this.props;

    let searchInput = <div />;

    if (type === 'FUN_BROWSER') {
      searchInput = (
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
          />
        </div>
      );
    }

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
          <IconButton
            className={classes.settingsButton}
            color="inherit"
            aria-label="Settings"
            onClick={this.onSettingsClick}
          >
            <SettingsIcon />
          </IconButton>
          {searchInput}
        </Toolbar>

        <Dialog
          open={this.state.openSettings}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.onSettingsClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Settings</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Choose your variable delimiter
            </DialogContentText>
            <TextField
              id="outlined-select-delimiter"
              select
              label="Select"
              className={classes.textField}
              value={this.state.delimiterLabel}
              onChange={this.handleChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              helperText="Please select your delimiter"
              margin="normal"
              variant="outlined"
            >
              {delimiters.map(option => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {/* <Divider /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onSettingsClose} color="primary">
              Discard
            </Button>
            <Button onClick={this.onSettingsClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    );
  }
}

AppBarDefem.propTypes = {
  type: PropTypes.string,
  onOpenRoutesDrawer: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(AppBarDefem);
