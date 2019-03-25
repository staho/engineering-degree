import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBarDefem from './AppBarDefem';
import AppRoutesDrawer from './AppRoutesDrawer';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
});

class TemplateEditor extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRoutesDrawerClose = () => {
    this.setState({ openRoutesDrawer: false });
  };

  onOpenRoutesDrawer = () => {
    this.setState({ openRoutesDrawer: true });
  };

  render() {
    const { classes } = this.props;

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
        <div className={classes.panels} />
      </div>
    );
  }
}

export default withStyles(styles)(TemplateEditor);
