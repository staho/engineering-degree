import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({});

class FinalStep extends Component {
  render() {
    const { classes } = this.props;

    return (
      <DialogContent>
        <DialogContentText>
          Click save to add new function to template.
        </DialogContentText>
      </DialogContent>
    );
  }
}

export default withStyles(styles)(FinalStep);
