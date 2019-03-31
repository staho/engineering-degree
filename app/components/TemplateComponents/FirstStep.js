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
  handleChange = event => {
    this.props.handleChange({ [event.target.id]: event.target.value });
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
            className={classes.textFieldMain}
            onChange={this.handleChange}
          />
          <TextField
            
            margin="dense"
            id="functionDesc"
            label="Function description"
            type="text"
            fullWidth
            className={classes.textFieldMain}
            onChange={this.handleChange}
          />

          <TextField
            required
            margin="normal"
            id="noOfRows"
            label="Number of var rows"
            type="number"
            className={classes.textFieldDetail}
            onChange={this.handleChange}
          />
          <TextField
            required
            margin="normal"
            id="noOfVarsInRow"
            label="Number of vars in row"
            type="number"
            className={classes.textFieldDetail}
            onChange={this.handleChange}
          />
        </div>
      </DialogContent>
    );
  }
}

export default withStyles(styles)(FirstStep);
