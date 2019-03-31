import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textFieldDetail: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '47%'
  },
  textFieldMain: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class NextStep extends Component {
  handleChange = (noOfVar, type) => event => {
    const text = event.target.value;

    let smallEvent = {
      type: type,
      noOfVar: noOfVar,
      text: text
    };

    this.props.handleChange(smallEvent);
  };

  createFields = (noOfVars, classes) => {
    const vars = [];
    for (let i = 0; i < noOfVars; i += 1) {
      vars.push(
        <div
          key={`variable-definition-${this.props.stepNo}-${i}`}
          className={classes.container}
        >
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            label="Variable name"
            type="text"
            className={classes.textFieldDetail}
            onChange={this.handleChange(i, 'name')}
          />
          <TextField
            margin="normal"
            id="desc"
            label="Description"
            type="text"
            multiline
            className={classes.textFieldDetail}
            onChange={this.handleChange(i, 'desc')}
          />
        </div>
      );
    }
    return vars;
  };

  render() {
    const { classes } = this.props;
    const { stepNo } = this.props;
    const { noOfVars } = this.props;
    // console.log(noOfVars);

    return (
      <DialogContent>
        <DialogContentText>
          {`Enter the variables of ${stepNo} row. If you don't want that much vars leave fields blank`}
        </DialogContentText>
        {/* {} */}

        {/* <div className={classes.container}> */}
        {this.createFields(noOfVars, classes)}
        {/* </div> */}
      </DialogContent>
    );
  }
}

export default withStyles(styles)(NextStep);
