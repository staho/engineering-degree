import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import AppRoutesDrawer from './AppRoutesDrawer';
import AppBarDefem from './AppBarDefem';
import AddFunctionModal from './TemplateComponents/AddFunctionModal';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
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
      modalOpen: false
    };
  }

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  onFunctionModalOpen = () => {
    this.setState({modalOpen: true})
  }

  onFunctionModalClose = () => {
    this.setState({modalOpen: false})
  }


  render() {
    const { classes } = this.props;

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