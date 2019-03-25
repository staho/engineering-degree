import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FirstStep from './FirstStep';
import NextStep from './NextStep';
import FinalStep from './FinalStep';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
});

class AddFunctionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      functionName: '',
      functionDesc: '',
      functionVariables: [[]], // {name: 'var name', desc: 'var desc'}
      step: 0,
      noOfRows: 0, // this is pointles, add Finish button - this will tell you how many rows he needs
      noOfVarsInRow: 0 // after each var, add new line, that will determine no of vars in row
    };
  }

  handleFirstStepChanges = smallEvent => {
    this.setState(smallEvent);
  };

  handleNextStepChanges = stepNo => smallEvent => {
    // this.setState()
  };

  handleNextClick = () => {
    console.log(this.state.step);
    const currentStep = this.state.step;

    this.setState({ step: currentStep + 1 });
  };

  handleBackClick = () => {
    // TODO
  };

  handleClose = () => {
    this.props.handleClose();
    this.setState({ step: 0 });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.props;

    let currentStepComponent = (
      <FirstStep handleChange={this.handleFirstStepChanges} />
    );
    if (this.state.step !== 0 && this.state.step <= this.state.noOfRows) {
      currentStepComponent = (
        <NextStep
          stepNo={this.state.step}
          handleChange={this.handleNextStepChanges(this.state.step)}
          noOfVars={this.state.noOfVarsInRow}
        />
      );
    }
    if (this.state.step !== 0 && this.state.step > this.state.noOfRows) {
      currentStepComponent = <FinalStep />;
    }

    return (
      <div className={classes.root}>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new function</DialogTitle>
          {currentStepComponent}
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            {/* Add save/cancel button + handler */}
            <Button onClick={this.handleNextClick} color="primary">
            {/* change this to sth that works */}
              {this.state.step < this.state.noOfRow + 1? 'Next' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddFunctionModal);
