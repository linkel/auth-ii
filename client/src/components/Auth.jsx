import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true; 

const Auth = App => LoginPage => {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loggedIn : false,
                username : null,
                userList : []
            }
        }
        componentDidMount() {
            let options = { 
                headers: {
                    Authorization: localStorage.getItem("token"),
                }}
              axios
              .get('http://localhost:5000/api/users',options)
              .then(response => {
                console.log(response)
                this.setState({userList: response.data, loggedIn: true})
              })
              .catch(err => {
                console.log(err)
              })
        }
        handleLogin = e => {
            e.preventDefault();
            let loginObj = {
                username: e.target[0].value,
                password: e.target[1].value
            }
            
            axios // POST REQ
            .post('http://localhost:5000/api/login/', loginObj)
            .then(response => {
                localStorage.setItem("token",response.data.token)
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
                this.setState({loggedIn: true})
            })
            .catch(err => {
                console.log(err)
            })

        }
        handleRegister = e => {
            console.log("register was clicked")
            e.preventDefault();
            let registerObj = {
                username: e.target[0].value,
                password: e.target[1].value,
                department: e.target[2].value,
            }
            axios
            .post('http://localhost:5000/api/register/', registerObj)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        }
        signOut = e => {
            this.setState({loggedIn: false, userList:[]})
            localStorage.clear();
        }
        render() {
            if (this.state.loggedIn) {
                return (
                    <App signOut={this.signOut}/>
                )
            } else {
                return (
                    <div>
                        <LoginPage handleLogin={this.handleLogin} handleRegister={this.handleRegister}/>
                    </div>
                )
            }
        }
    }

}

export default Auth;