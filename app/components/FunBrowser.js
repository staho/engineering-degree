import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ipcRenderer } from 'electron';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { FUNCTIONS_DEF_LOAD, CATCH_ON_MAIN } from '../constants/constants';
import AppRoutesDrawer from './AppRoutesDrawer';
import AppBarDefem from './AppBarDefem';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';

const styles = theme => ({
  panels: {
    width: '100vw',
    height: 'calc(100vh - 85px)',
    marginTop: '72px',
    // paddingBottom: '20px',
    overflow: 'auto'
  },
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
});

class FunBrowser extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      openRoutesDrawer: false,
      expanded: null,
      searchText: ''
    };

    ipcRenderer.on(FUNCTIONS_DEF_LOAD, (event, data) => {
      const parsedFunDefs = JSON.parse(data);
      this.setState({ functionsDef: parsedFunDefs });
    });
  }

  componentDidMount = () => {
    ipcRenderer.send(CATCH_ON_MAIN, 'ping');
  };

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  onSearch = text => {
    this.setState({ searchText: text });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    let functionPanels = <div />;

    if (this.state.functionsDef !== undefined) {
      functionPanels = this.state.functionsDef.functions.map((fun, index) => {
        if (
          !fun.name.toUpperCase().includes(this.state.searchText) &&
          this.state.searchText !== ''
        )
          return <div />;

        return (
          <FunctionDescriptor
            key={`function-descriptor-panel-${index}`}
            text={fun.name}
            focused // deprecated
            expanded={expanded === `panel${index}`}
            definition={fun}
            focusedVarNo={0}
            onChange={this.handleChange(`panel${index}`)}
            expandIcon={<ExpandMoreIcon />}
          />
        );
      });
    }

    return (
      <div className={classes.root}>
        <AppBarDefem
          onOpenRoutesDrawer={this.onOpenRoutesDrawer}
          type="FUN_BROWSER"
          onSearch={this.onSearch}
        />
        <AppRoutesDrawer
          open={this.state.openRoutesDrawer}
          onClose={this.onRoutesDrawerClose}
        />
        <div className={classes.panels}>{functionPanels}</div>
      </div>
    );
  }
}

export default withStyles(styles)(FunBrowser);
