import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';
import AppRoutesDrawer from './AppRoutesDrawer';
import AppBarDefem from './AppBarDefem';
import AddFunctionModal from './TemplateComponents/AddFunctionModal';
import FunctionDescriptor from './NotepadComponents/FunctionDescriptor';
import {
  REQUEST_TEMPLATE_TO_SAVE,
  SEND_DATA_TO_SAVE,
  EXPORT_TEMPLATE_TO_RENDER,
  STORE_TEMPLATE,
  RESTORE_TEMPLATE,
  CATCH_ON_TEMPLATE
} from '../constants/constants';
import routes from '../constants/routes';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  panels: {
    width: '100vw',
    height: 'calc(100vh - 85px)',
    marginTop: '72px',
    // paddingBottom: '20px',
    overflow: 'auto'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    backgroundColor: '#2196f3'
  },
  fab2: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 10,
    backgroundColor: '#f50057'
  },
  myButton: {
    color: theme.palette.background.paper
  }
});

class TemplateEditor extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      functions: [],
      expanded: null
    };

    ipcRenderer.on(RESTORE_TEMPLATE, (event, data) => {
      if (typeof data === 'string') {
        const jsData = JSON.parse(data);
        this.loadTemplate(jsData);
      } else if (data.length) {
        this.loadTemplate(data);
      }
    });

    ipcRenderer.on(REQUEST_TEMPLATE_TO_SAVE, (event, data) => {
      const path = data;
      this.prepareAndSendTemplate(path);
    });
  }

  componentDidMount = () => {
    ipcRenderer.send(CATCH_ON_TEMPLATE, '');
    // ipcRenderer.send(CATCH_ON_MAIN, 'template');
  };

  loadTemplate = data => {
    if (Array.isArray(data)) this.setState({ functions: data });
  };

  prepareAndSendTemplate = path => {
    const jsonFunctions = JSON.stringify(this.state.functions);

    const data = {
      text: jsonFunctions,
      path
    };
    ipcRenderer.send(SEND_DATA_TO_SAVE, data);
  };

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  storeTemplates = () => {
    ipcRenderer.send(STORE_TEMPLATE, this.state.functions);
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  handleExportClick = () => {
    const dataToExport = this.state.functions;
    dataToExport.force = true;

    ipcRenderer.send(EXPORT_TEMPLATE_TO_RENDER, dataToExport);
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  onFunctionModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  onFunctionModalClose = smallEvent => {
    const tempFunctions = [...this.state.functions];
    if (smallEvent.isCanceled) {
      this.setState({ modalOpen: false });
    } else {
      tempFunctions.push(smallEvent.function); // add check if var is already in state
      this.setState({ modalOpen: false, functions: tempFunctions }, () =>
        this.storeTemplates()
      );
    }
  };

  createFunctionDescriptors = expanded => {
    const funs = this.state.functions;
    return funs.map((fun, index) => (
      <FunctionDescriptor
        key={`function-descriptor-panel-${fun.name}`}
        text={fun.name}
        focused // deprecated
        expanded={expanded === `panel${index}`}
        definition={fun}
        focusedVarNo={0}
        onChange={this.handleChange(`panel${index}`)}
        expandIcon={<ExpandMoreIcon />}
      />
    ));
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <AppBarDefem
          onOpenRoutesDrawer={this.onOpenRoutesDrawer}
          type="TEMPLATE_EDITOR"
          onSearch={this.onSearch}
        />
        <AppRoutesDrawer
          open={this.state.openRoutesDrawer}
          onClose={this.onRoutesDrawerClose}
        />
        <div className={classes.panels}>
          {this.createFunctionDescriptors(expanded)}
        </div>

        <AddFunctionModal
          open={this.state.modalOpen}
          handleClose={this.onFunctionModalClose}
        />
        <Fab className={classes.fab2} onClick={this.handleExportClick}>
          <Link to={routes.NOTEPAD}>
            <PlaylistAddCheckIcon
              className={classes.myButton}
              color="primary"
            />
          </Link>
        </Fab>
        <Fab className={classes.fab} onClick={this.onFunctionModalOpen}>
          <AddIcon className={classes.myButton} />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TemplateEditor);
