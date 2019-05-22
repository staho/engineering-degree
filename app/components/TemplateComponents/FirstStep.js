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

class FirstStep extends Component {

  constructor(props) {
    super(props)
    this.state = {
      functionDesc: "",
      functionName: "",
      noOfRows: "",
      noOfVarsInRow: "" 
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.values) {
      return nextProps.values
    }
    return null;
  }

  handleChange = event => {
    this.props.handleChange({ [event.target.id]: event.target.value });
    let tempState = {...this.state}
    tempState[event.target.id] = event.target.value
    this.setState(tempState)
  };

  render() {
    const { classes } = this.props;

    return (
      <DialogContent>
        <DialogContentText>
          Enter name of the template below. Be aware of that it is keyword you
          will use in further structure editing.
        </DialogContentText>
        <div className={classes.container}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="functionName"
            label="Function name"
            type="text"
            fullWidth
            value={this.state.functionName}
            className={classes.textFieldMain}
            onChange={this.handleChange}
          />
          <TextField
            
            margin="dense"
            id="functionDesc"
            label="Function description"
            type="text"
            fullWidth
            value={this.state.functionDesc}
            className={classes.textFieldMain}
            onChange={this.handleChange}
          />

          <TextField
            required
            margin="normal"
            id="noOfRows"
            label="Number of var rows"
            type="number"
            value={this.state.noOfRows}
            className={classes.textFieldDetail}
            onChange={this.handleChange}
          />
          <TextField
            required
            margin="normal"
            id="noOfVarsInRow"
            label="Number of vars in row"
            type="number"
            value={this.state.noOfVarsInRow}
            className={classes.textFieldDetail}
            onChange={this.handleChange}
          />
        </div>
      </DialogContent>
    );
  }
}

export default withStyles(styles)(FirstStep);
