import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Auth from './components/Auth';
import Login from './components/Login';
import {Route} from 'react-router-dom';

axios.defaults.withCredentials = true; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList : [],
      userListVisible:false,
    }
  }
  componentDidMount() {
    console.log(localStorage.getItem("token"))
    let options = { 
      headers: {
          Authorization: localStorage.getItem("token"),
      }}
    axios
    .get('http://localhost:5000/api/users',options)
    .then(response => {
      console.log(response)
      this.setState({userList: response.data})
    })
    .catch(err => {
      console.log(err)
    })
  }
  toggleUserList = () => {
    this.setState({userListVisible: !this.state.userListVisible})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to your home page.</h1>
          <button onClick={this.toggleUserList}>Show UserList</button>
          <div>
            { this.state.userListVisible ? 
            this.state.userList.map(user => <div key={user.username}>{user.username}</div>)
            :
            <div></div>
            }
          </div>
        </header>
      </div>
    );
  }
}

export default Auth(App)(Login);
