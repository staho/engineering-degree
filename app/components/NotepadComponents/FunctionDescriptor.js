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
    fontWeight: theme.typography.fontWeightRegular,
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
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
    const { focusedVarLineNo } = this.props;
    const { expanded } = this.props;
    const { desc } = this.props.definition;
    let expandIcon = <div />;
    if(this.props.expandIcon) {
      expandIcon = this.props.expandIcon;
    }
    
    let enumerateVars = 1;
    let enumerateLines = 0;

    const variables = [];
    if(expanded && typeof definition.variables !== "undefined"){
    definition.variables.forEach(arrOfVariables => {
      arrOfVariables.forEach(variable => {
        variables.push(
          <ListItem key={`function-list-item-${variable.name}`}>
            <ListItemText disableTypography>
              <Typography
                gutterBottom
                color={enumerateVars === focusedVarNo && enumerateLines === focusedVarLineNo ? 'error' : 'default'}
              >
                <Typography
                  component="span"
                  variant="subtitle2"
                  gutterBottom
                >{`Zmienna: ${variable.name}`}</Typography>
                {`${variable.desc}`}
              </Typography>
            </ListItemText>
          </ListItem>
        );
        enumerateVars += 1;
      });
      if(focusedVarNo > arrOfVariables.length && enumerateLines === focusedVarLineNo) {
        variables.push(
          <ListItem>
            <ListItemText disableTypography>
              <Typography
                gutterBottom
                color='error'
              >
                <Typography
                  component="span"
                  variant="subtitle2"
                  color='error'
                  gutterBottom
                >ZA DUŻO ZMIENNYCH</Typography>
                {`Została wprowadzona za duża ilość zmiennych dla zadanej funkcji. Usuń wartości które nie zostały zadeklarowe w definicji.`}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      }

      const lengthOfVars = definition.variables.length;
      if (
        lengthOfVars > 1 &&
        definition.variables[lengthOfVars - 1] !== arrOfVariables
      ) {
        variables.push(<Divider key={`divider-${enumerateVars}${enumerateLines}`} />);
      }
      enumerateVars = 1;
      enumerateLines += 1;
      // todo: if enumerateVars or lines are greater than variable matrix dimmensions, throw error on GUI
    });
  } else {
    variables.push(
      <ListItem key="function-list-item-variable-undef">
        <ListItemText disableTypography>
          <Typography
            gutterBottom
                >
            <Typography
              component="span"
              variant="subtitle2"
              gutterBottom
            >Ta funkcja nie została zdefiniowana w szablonie</Typography>
            {"Zdefiniuj funkcję i jej zmienne w edytorze szablonów"}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  }

    return (
      <ExpansionPanel expanded={expanded}
      onChange={this.props.onChange}>
        <ExpansionPanelSummary >
          <Typography
            variant="headline"
            component="h3"
            className={classes.heading}
          >
            {text}
          </Typography>
               {desc ? (
                 <Typography className={classes.secondaryHeading}>
                   {desc}
                 </Typography>
               ) : (
                 <div />
               )}
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
  focusedVarNo: PropTypes.number
};

export default withStyles(styles)(FunctionDescriptor);
