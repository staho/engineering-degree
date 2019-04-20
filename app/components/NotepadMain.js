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
  NOTEPAD_UNMOUNT,
  DELIMITER_CHANGE_RECEIVE,
  TEMPLATE_OPENED,
  RENDER_TEMPLATE
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

class NotepadMain extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      prevDate: new Date(),
      text: '',
      focusedFunction: {
        focusedVarNo: undefined
      },
      openRoutesDrawer: false,
      delimiter: ' ',
      functionsDef: {}
    };

    ipcRenderer.on(FUNCTIONS_DEF_LOAD, (event, data) => {
      //todo: in data send parameter to distinct is that functions_def or template
      const parsedFunDefs = JSON.parse(data);
      this.setState({ functionsDef: parsedFunDefs });
    });

    ipcRenderer.on(REQUEST_DATA_TO_SAVE, (event, data) => {
      const path = data;
      this.prepareAndSendData(path, true);
    });

    ipcRenderer.on(FILE_OPENED, (event, data) => {
      console.log(data)
      if(data.text) 
        this.setState({ text: data });
      else (data.functionsTemplate)
        this.loadTemplate(data.functionsTemplate)
          
    });

    ipcRenderer.on(DELIMITER_CHANGE_RECEIVE, (event, data) => {
      this.onDelimiterChange(data);
    });

    ipcRenderer.on(TEMPLATE_OPENED, (event, data) => {
      
      // this.loadTemplate(data);
    });
  }

  componentDidMount = () => {
    ipcRenderer.send(CATCH_ON_MAIN, 'ping');
    console.log("mount")

  };

  componentWillUnmount = () => {
    console.log("unmount")
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

  //it should able to work with a data from TEMPLATE_OPEN and FILE_OPENED 
  loadTemplate = data => {
    console.log("heeee", data)
    // const templateFunctions = data.functionsTemplate;
    const functionsDefToState = { functions: data}
    this.setState({ functionsDef: functionsDefToState });
    let textValue = '';

    data.forEach(fun => {
      let singleFunction = `*${fun.name.toUpperCase()}\n`;
      fun.variables.forEach(() => (singleFunction += '\n'));

      textValue += singleFunction;
    });

    console.log(textValue)
    this.setState({text: textValue}, () => {console.log(this.state)})
    console.log(data.template);
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
    if (event.keyCode === 9) {
      event.preventDefault();
      const val = event.target.value;

      const start = event.target.selectionStart;

      const end = event.target.selectionEnd;

      let textTemp = event.target.value;

      // set textarea value to: text before caret + tab + text after caret
      textTemp = `${val.substring(0, start)}\t${val.substring(end)}`;

      // put caret at right position again
      // event.target.selectionStart = event.selectionEnd = start + 1;

      this.setState({ text: textTemp });
    }
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

  onDelimiterChange = newDelimiter => {
    if (newDelimiter.isRegExp) {
      this.setState({ delimiter: new RegExp(newDelimiter.realValue, 'g') });
    } else {
      this.setState({ delimiter: newDelimiter.realValue });
    }
  };

  processChange = event => {
    console.log(this.state.delimiter.toString());
    const currentValue = event.target.value;
    if (!currentValue || !this.state.functionsDef) return;

    const splittedString = currentValue.split('\n');
    let currentLineStart = 0;

    let varCounter = 0;

    let currentFocused = {};

    let tempFocused = {};

    splittedString.forEach(line => {
      const lineEnd = currentLineStart + line.length;

      if (line.startsWith('*')) {
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
        const splittedByDelimiter = line.split(this.state.delimiter);
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

    this.setState({
      focusedFunction: currentFocused
    });
  };

  render() {
    const { classes } = this.props;
    let textValue = this.state.text;

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
          expanded
        />
      );
    }
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
            value={textValue}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NotepadMain);
