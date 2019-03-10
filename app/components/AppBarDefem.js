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

const appBarStyle = {
  backgroundColor: '#2196f3'
};

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
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
