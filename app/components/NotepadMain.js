import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
// import Paper from '@material-ui/core/Paper';
// import Input from '@material-ui/core/Input';
// import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';

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
      functions: []
    };
  }

  // todo: delagate it to redux state
  processChange = event => {
    const currentValue = event.target.value;
    const splittedString = currentValue.split('\n');
    const text = currentValue.replace(/a/g, '');
    const caret =
      event.target.selectionStart - (currentValue.length - text.length);
    const newFunctions = [];

    let currentLineStart = 0;

    splittedString.forEach(line => {
      if (line.startsWith('*') && true) {
        // this "true" should be replaced with condition functionBase.contains(line)
        const lineEnd = currentLineStart + line.length;
        let focused = false;
        if (caret >= currentLineStart && caret <= lineEnd) {
          focused = true;
        }

        newFunctions.push({
          text: line.replace('*', ''),
          focused,
          functionStart: currentLineStart,
          functionEnd: lineEnd
        });
      }
      console.log('Caret: ', caret, ' currLineStart: ', currentLineStart);

      currentLineStart += line.length + 1; // +1 is a \n
    });

    console.log('-----------------------', newFunctions);

    this.setState({ functions: newFunctions });
  };

  render() {
    const { classes } = this.props;

    let functionDescriptors = [];

    if (this.state.functions.length > 0) {
      let descIndex = 0;
      functionDescriptors = this.state.functions.map(fun => (
        <FunctionDescriptor
          key={`function-descriptor-${(descIndex += 1)}`}
          text={fun.text}
          focused={fun.focused}
          description="blah"
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

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <TextField multiline fullWidth onChange={this.processChange} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NotepadMain);
