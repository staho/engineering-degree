import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import AppRoutesDrawer from './AppRoutesDrawer';
import AppBarDefem from './AppBarDefem';
import AddFunctionModal from './TemplateComponents/AddFunctionModal';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  panels: {
    width: '100vw',
    height: 'calc(100vh - 85px)',
    marginTop: '72px',
    // paddingBottom: '20px',
    overflow: 'auto'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    backgroundColor: '#2196f3'
  },
  myButton: {
    color: theme.palette.background.paper
  }
});

class TemplateEditor extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      functions: [],
      expanded: null
    };
  }

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });

    // tempFunctions.push()
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  onFunctionModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  onFunctionModalClose = smallEvent => {
    let tempFunctions = [...this.state.functions];
    console.log(smallEvent);
    tempFunctions.push(smallEvent.function); //add check if var is already in state
    this.setState({ modalOpen: false, functions: tempFunctions });
  };

  createFunctionDescriptors = expanded => {
    const funs = this.state.functions;
    return funs.map((fun, index) => (
      <FunctionDescriptor
        key={`function-descriptor-panel-${index}`}
        text={fun.name}
        focused // deprecated
        expanded={expanded === `panel${index}`}
        definition={fun}
        focusedVarNo={0}
        onChange={this.handleChange(`panel${index}`)}
        expandIcon={<ExpandMoreIcon />}
      />
    ));
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;


    return (
      <div className={classes.root}>
        <AppBarDefem
          onOpenRoutesDrawer={this.onOpenRoutesDrawer}
          type="TEMPLATE_EDITOR"
          onSearch={this.onSearch}
        />
        <AppRoutesDrawer
          open={this.state.openRoutesDrawer}
          onClose={this.onRoutesDrawerClose}
        />
        <div className={classes.panels}>{this.createFunctionDescriptors(expanded)}</div>
       

        <AddFunctionModal
          open={this.state.modalOpen}
          handleClose={this.onFunctionModalClose}
        />
        <Fab className={classes.fab} onClick={this.onFunctionModalOpen}>
          <AddIcon className={classes.myButton} />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TemplateEditor);
