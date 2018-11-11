import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class FunctionDescriptor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const { text } = this.props;
    const { focused } = this.props;
    const { description } = this.props;

    return (
      <ExpansionPanel expanded={focused}>
        <ExpansionPanelSummary>
          <Typography
            variant="headline"
            component="h3"
            className={classes.heading}
          >
            {text}
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Typography>{description}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

FunctionDescriptor.propTypes = {
  text: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FunctionDescriptor);
