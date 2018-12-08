import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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
    const { definition } = this.props;
    const { focusedVarNo } = this.props;

    let enumerate = 0;

    const variables = [];
    definition.variables.forEach(arrOfVariables => {
      arrOfVariables.forEach(variable => {
        variables.push(
          <ListItem key={enumerate}>
            <ListItemText disableTypography>
              <Typography
                gutterBottom
                color={enumerate === focusedVarNo ? 'error' : 'default'}
              >
                <Typography variant="subtitle2" gutterBottom>{`Zmienna: ${
                  variable.name
                }`}</Typography>
                {`${variable.desc}`}
              </Typography>
            </ListItemText>
          </ListItem>
        );
        enumerate += 1;
      });
      variables.push(<Divider />);
    });

    console.log(variables);

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
          <List>{variables}</List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

FunctionDescriptor.propTypes = {
  text: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
  definition: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  focusedVarNo: PropTypes.number.isRequired
};

export default withStyles(styles)(FunctionDescriptor);
