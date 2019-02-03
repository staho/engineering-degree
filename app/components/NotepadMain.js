import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';
import AppRoutesDrawer from './AppRoutesDrawer';
import AppBarDefem from './AppBarDefem';
import {
  FUNCTIONS_DEF_LOAD,
  CATCH_ON_MAIN,
  REQUEST_DATA_TO_SAVE,
  SEND_DATA_TO_SAVE,
  FILE_OPENED,
  NOTEPAD_UNMOUNT
} from '../constants/constants';
// import { t } from 'testcafe';

const drawerWidth = 400;

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
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
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

const delimiter = ' ';

class NotepadMain extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      prevDate: new Date(),
      currentTextValue: '',
      text: '',
      focusedFunction: {
        focusedVarNo: undefined
      },
      openRoutesDrawer: false
    };

    ipcRenderer.on(FUNCTIONS_DEF_LOAD, (event, data) => {
      const parsedFunDefs = JSON.parse(data);
      this.setState({ functionsDef: parsedFunDefs });
    });

    ipcRenderer.on(REQUEST_DATA_TO_SAVE, (event, data) => {
      const path = data;
      console.log('Path in main: ', path);
      this.prepareAndSendData(path, true);
    });

    ipcRenderer.on(FILE_OPENED, (event, data) => {
      this.setState({ text: data });
    });
  }

  componentDidMount = () => {
    console.log('XDDXDXDs');
    ipcRenderer.send(CATCH_ON_MAIN, 'ping');
  };

  componentWillUnmount = () => {
    const data = {
      text: this.state.currentTextValue
    };
    ipcRenderer.send(NOTEPAD_UNMOUNT, data);
  };

  prepareAndSendData = path => {
    const data = {
      text: this.state.currentTextValue,
      path
    };
    console.log('Request', data);
    ipcRenderer.send(SEND_DATA_TO_SAVE, data);
  };

  findFun = funBegin => element =>
    element.name.toUpperCase() === funBegin.toUpperCase();

  // todo: delagate it to redux state

  handleClick = event => {
    this.focusFunctionBasedOnCaret(event);
  };

  handleKeyUp = event => {
    if (event.keyCode >= 35 && event.keyCode <= 40) {
      this.focusFunctionBasedOnCaret(event);
    }
  };

  handleKeyDown = event => {
    if (event.keyCode === 9) event.preventDefault();
  };

  focusFunctionBasedOnCaret = event => {
    this.processChange(event);
  };

  preProcessChange = event => {
    this.setState({ text: event.target.value });
    const date = new Date();

    if (this.state.prevDate) {
      const diff = date.getTime() - this.state.prevDate.getTime();
      if (diff > 250) {
        this.processChange(event);
        this.setState({ prevDate: date });
      }
    }
  };

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  processChange = event => {
    const currentValue = event.target.value;

    if (!currentValue) return;

    const splittedString = currentValue.split('\n');

    let currentLineStart = 0;
    let varCounter = 0;

    let currentFocused = {};
    let tempFocused = {};

    splittedString.forEach(line => {
      const lineEnd = currentLineStart + line.length;

      if (line.startsWith('*') && this.state.functionsDef) {
        const functionText = line.replace('*', '');

        const funSearch = this.findFun(functionText);
        const foundDefinition = this.state.functionsDef.functions.find(
          funSearch
        );

        if (line.length > 1 && foundDefinition) {
          tempFocused = {
            text: foundDefinition.name,
            definition: foundDefinition,
            focusedVarNo: null,
            functionEnd: lineEnd,
            functionStart: currentLineStart,
            variables: []
          };

          if (event.target.selectionStart >= currentLineStart) {
            currentFocused = tempFocused;
          }
        }
        varCounter = 0;
      } else {
        const splittedByDelimiter = line.split(delimiter); // what if someone makes two delimiters in row
        let tempLen = currentLineStart;

        splittedByDelimiter.forEach(elem => {
          varCounter += 1;
          if (
            event.target.selectionStart > tempLen &&
            event.target.selectionStart <= tempLen + elem.length
          ) {
            currentFocused.focusedVarNo = varCounter;
          }
          tempLen += elem.length + 1; // +1 for delimiter
        });
      }

      currentLineStart += line.length + 1; // +1 is a \n
    });

    console.log('Current focused: ', currentFocused);

    this.setState({
      focusedFunction: currentFocused,
      currentTextValue: currentValue
    });
  };

  render() {
    const { classes } = this.props;

    let functionDescriptor = <div />;

    const tempFocusedFunction = { ...this.state.focusedFunction };

    if (tempFocusedFunction.text) {
      functionDescriptor = (
        <FunctionDescriptor
          key="function-descriptor"
          text={tempFocusedFunction.text}
          focused // deprecated
          definition={tempFocusedFunction.definition}
          focusedVarNo={tempFocusedFunction.focusedVarNo}
        />
      );
    }
    // todo: move appbar to component above
    return (
      <div className={classes.root}>
        <AppBarDefem
          onOpenRoutesDrawer={this.onOpenRoutesDrawer}
          type="EDITOR"
        />
        <AppRoutesDrawer
          open={this.state.openRoutesDrawer}
          onClose={this.onRoutesDrawerClose}
        />
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          {functionDescriptor}
        </Drawer>

        <main
          className={classes.content}
          style={{ height: 'calc(100vh - 64px' }}
        >
          <div className={classes.toolbar} />
          <TextField
            style={{ height: 'calc(100vh - 120px', overflow: 'auto' }}
            multiline
            fullWidth
            onChange={this.preProcessChange}
            onClick={this.handleClick}
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown}
            value={this.state.text}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NotepadMain);
