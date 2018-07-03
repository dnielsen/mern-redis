import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            firstname : '',
            lastname : '',
            index : 0
        }
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
    }
    
    login() {
        if( this.state.email !== '' && this.state.password != '') {
            fetch('/api/user/login', {
                method: 'POST', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    email : this.state.email,
                    password : this.state.password
                })
            })
            .then(res => res.json())
            .then(json => {
                if( json.success )  {
                    localStorage.setItem('token', json.token)
                    localStorage.setItem('email', json.user.email)
                    localStorage.setItem('password', this.state.password)
                    localStorage.setItem('firstname', json.user.firstname)
                    localStorage.setItem('lastname', json.user.lastname)
                    this.setState({
                        index : 2
                    })
                }
                else {
                    alert('Failed to login')
                }
            });
        }
        else {
            alert('Please fill required information')
        }
    }
    signup() {
        if( this.state.email !== '' && this.state.password !== '' && this.state.firstname !== '' && this.state.lastname !== '' ) {
            fetch('/api/user/signup', {
                method: 'POST', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    email : this.state.email,
                    password : this.state.password,
                    firstname : this.state.firstname,
                    lastname : this.state.lastname
                })
            })
            .then(res => res.json())
            .then(json => {
                if( json.success )  {
                    this.setState({
                        index : 0
                    })
                }
                else {
                    alert('Failed to signup')
                }
            });
        }
        else {
            alert('Please fill required information')
        }
    }

    handleChange(attr, event){
		this.setState({
			[attr]: event.target.value
		});
	}

    render() {
        if( this.state.index === 0 ) {
            return (
                <div>
                    <input type="text" name="name" placeholder = "Email" onChange={this.handleChange.bind(this, 'email')} />
                    <input type="text" name="name" type = "password" placeholder = "Password" onChange={this.handleChange.bind(this, 'password')} />
                    <div>
                        <button onClick={this.login}>Login</button>
                        <button onClick={ () => {
                            this.setState({
                                index : 1
                            })
                        }}>Sign up</button>
                    </div>
                </div>
            );   
        }
        if( this.state.index === 1 ) {
            return (
                <div>
                    <input type="text" name="name" placeholder = "Email" onChange={this.handleChange.bind(this, 'email')} />
                    <input type="text" name="name" type = "password" placeholder = "Password" onChange={this.handleChange.bind(this, 'password')} />
                    <div>
                        <input type="text" name="name" placeholder = "FirstName" onChange={this.handleChange.bind(this, 'firstname')} />
                        <input type="text" name="name" placeholder = "LastName" onChange={this.handleChange.bind(this, 'lastname')} />
                    </div>
                    <div>
                        <button onClick={this.signup}>Sign up</button>
                    </div>
                </div>
            );
        }
        if ( this.state.index === 2 ) {
            return ( <Redirect to={'/home'} /> )
        }
        return <div/>
    }
}

export default Auth;
