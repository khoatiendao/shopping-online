// import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import MyProvider from './contexts/Myprovider';
import Login from './component/Logincomponent';
import Main from './component/Maincomponent';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'loading....'
    };
  }
  render() {
    return (
      <MyProvider>
        <Login />
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}
export default App;