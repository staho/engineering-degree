import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';
import { FUNCTIONS_DEF_LOAD } from '../constants/constants';

const drawerWidth = 400;

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
  toolbar: theme.mixins.toolbar
});

class NotepadMain extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      functions: [],
      prevDate: new Date()
    };

    ipcRenderer.on(FUNCTIONS_DEF_LOAD, (event, data) => {
      const parsedFunDefs = JSON.parse(data);

      this.setState({ functionsDef: parsedFunDefs });
      console.log(parsedFunDefs);
    });
  }

  findFun = funBegin => element =>
    element.name.toUpperCase() === funBegin.toUpperCase();

  // todo: delagate it to redux state

  handleClick = event => {
    const caret = event.target.selectionStart;
    this.focusFunctionBasedOnCaret(caret);
  };

  handleKeyUp = event => {
    if (event.keyCode >= 35 && event.keyCode <= 40) {
      const caret = event.target.selectionStart;
      this.focusFunctionBasedOnCaret(caret);
    }
  };

  handleKeyDown = event => {
    if (event.keyCode === 9) event.preventDefault();
  };

  focusFunctionBasedOnCaret = caret => {
    const tempFunctions = [...this.state.functions];

    const newFunctions = tempFunctions.map(elem => {
      const tempElem = { ...elem };

      if (caret >= elem.functionStart && caret <= elem.functionEnd) {
        tempElem.focused = true;
      } else {
        tempElem.focused = false;
      }
      return tempElem;
    });

    this.setState({ functions: newFunctions });
  };

  preProcessChange = event => {
    const date = new Date();

    if (this.state.prevDate) {
      const diff = date.getTime() - this.state.prevDate.getTime();
      if (diff > 500) {
        this.processChange(event);
        this.setState({ prevDate: date });
      }
    }
  };

  processChange = event => {
    const currentValue = event.target.value;
    const splittedString = currentValue.split('\n');
    const text = currentValue.replace(/a/g, '');
    const caret =
      event.target.selectionStart - (currentValue.length - text.length);

    console.log(
      'Selection start:',
      event.target.selectionStart,
      ' caret: ',
      caret
    );
    const newFunctions = [];

    let currentLineStart = 0;

    splittedString.forEach(line => {
      if (line.startsWith('*') && this.state.functionsDef) {
        const functionText = line.replace('*', '');

        const funSearch = this.findFun(functionText);
        const foundDefinition = this.state.functionsDef.functions.find(
          funSearch
        );

        if (line.length > 1 && foundDefinition) {
          // this "true" should be replaced with condition functionBase.contains(line)
          const lineEnd = currentLineStart + line.length;
          let focused = false;
          if (caret >= currentLineStart && caret <= lineEnd) {
            focused = true;
          }

          newFunctions.push({
            text: foundDefinition.name,
            focused,
            functionStart: currentLineStart,
            functionEnd: lineEnd,
            definition: foundDefinition
          });
        }
      }

      console.log('Caret: ', caret, ' currLineStart: ', currentLineStart);

      currentLineStart += line.length + 1; // +1 is a \n
    });

    console.log('-----------------------', newFunctions);

    this.setState({ functions: newFunctions }, () => {
      console.log(this.state.functions);
    });
  };

  render() {
    const { classes } = this.props;

    let functionDescriptors = [];

    if (this.state.functions.length > 0) {
      let descIndex = 0;
      functionDescriptors = this.state.functions
        .filter(el => el.focused)
        .map(fun => (
          <FunctionDescriptor
            key={`function-descriptor-${(descIndex += 1)}`}
            text={fun.text}
            focused={fun.focused}
            definition={fun.definition}
          />
        ));
    }

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classes.appBar}
          style={appBarStyle}
        >
          <Toolbar />
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          {functionDescriptors}
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
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NotepadMain);
