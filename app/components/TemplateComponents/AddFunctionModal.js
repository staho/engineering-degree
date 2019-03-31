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
      functionVariables: [], // {name: 'var name', desc: 'var desc'}
      step: 0,
      noOfRows: 0, // this is pointles, add Finish button - this will tell you how many rows he needs
      noOfVarsInRow: 0 // after each var, add new line, that will determine no of vars in row
    };
  }

  handleFirstStepChanges = smallEvent => {
    this.setState(smallEvent);
  };

  handleNextStepChanges = stepNo => smallEvent => {
    let tempVars = [...this.state.functionVariables];
    if (tempVars[stepNo - 1] === undefined) {
      tempVars[stepNo - 1] = [];
    }
    if (tempVars[stepNo - 1][smallEvent.noOfVar] === undefined) {
      tempVars[stepNo - 1][smallEvent.noOfVar] = {};
    }

    if (smallEvent.type === 'name')
      tempVars[stepNo - 1][smallEvent.noOfVar].name = smallEvent.text;
    else if (smallEvent.type === 'desc')
      tempVars[stepNo - 1][smallEvent.noOfVar].desc = smallEvent.text;

    this.setState({ functionVariables: tempVars });
  };

  handleNextClick = event => {
    console.log(this.state.step);
    console.log();
    const option = event.target.textContent;
    const currentStep = this.state.step;

    if (option === 'Next') {
      this.setState({ step: currentStep + 1 });
    } else {
      this.handleClose();
    }
  };

  handleBackClick = () => {
    // TODO
  };

  handleSaveClick = () => {
    this.setState(
      { step: 0 },
      this.props.handleClose({
        function: {
          name: this.state.functionName.toUpperCase(),
          desc: this.state.functionDesc,
          variables: this.state.functionVariables
        }
      })
    );
  };

  handleCancel = () => {
    this.setState({
      functionName: '',
      functionDesc: '',
      functionVariables: [],
      step: 0,
      noOfRows: 0,
      noOfVarsInRow: 0
    }, this.props.handleClose());
  };

  render() {
    const { classes } = this.props;
    const { open } = this.props;

    let saveNextButtonLabel = (
      <Button onClick={this.handleNextClick} color="primary">
        {'Next'}
      </Button>
    );

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
      saveNextButtonLabel = (
        <Button onClick={this.handleSaveClick} color="primary">
          {'Save'}
        </Button>
      );
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
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            {/* Add save/cancel button + handler */}

            {/* change this to sth that works */}
            {saveNextButtonLabel}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddFunctionModal);
