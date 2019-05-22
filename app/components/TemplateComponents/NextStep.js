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
  constructor(props) {
    super(props);
    this.state = {
      fieldValues: {},
      stepNo: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp = {};
    if (nextProps.stepNo !== prevState.stepNo) {
      if (nextProps.values) {
        nextProps.values.forEach((elem, index) => {
          temp[`noOfVar-${index}-type-name`] = {
            text: elem.name,
            noOfVar: index,
            type: 'name'
          };
          temp[`noOfVar-${index}-type-desc`] = {
            text: elem.desc,
            noOfVar: index,
            type: 'name'
          };
        });
      }
      return {
        fieldValues: { ...temp },
        stepNo: nextProps.stepNo
      };
    } else return null;
  }

  handleChange = (noOfVar, type) => event => {
    const text = event.target.value;

    let smallEvent = {
      type: type,
      noOfVar: noOfVar,
      text: text
    };

    this.props.handleChange(smallEvent);

    let tempState = { ...this.state.fieldValues };
    tempState[`noOfVar-${noOfVar}-type-${type}`] = smallEvent;
    this.setState({ fieldValues: tempState });
  };

  createFields = (noOfVars, classes) => {
    const vars = [];
    for (let i = 0; i < noOfVars; i += 1) {
      let val1 = this.state.fieldValues[`noOfVar-${i}-type-name`];
      let val2 = this.state.fieldValues[`noOfVar-${i}-type-desc`];
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
            value={val1 === undefined ? '' : val1.text}
            className={classes.textFieldDetail}
            onChange={this.handleChange(i, 'name')}
          />
          <TextField
            margin="normal"
            id="desc"
            label="Description"
            type="text"
            multiline
            value={val2 === undefined ? '' : val2.text}
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
