// @flow
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import { CATCH_ON_MAIN } from '../constants/constants';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  handleClick = () => {
    ipcRenderer.send(CATCH_ON_MAIN, 'ping');
    console.log('onClick');
  };

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        {/* <button onClick={this.handleClick}>CHCEHCE</button> */}
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
