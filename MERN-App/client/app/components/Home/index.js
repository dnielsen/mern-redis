import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index : 0,
            email : localStorage.getItem('email') ? localStorage.getItem('email') : '',
            password : localStorage.getItem('password') ? localStorage.getItem('password') : '',
            firstname : localStorage.getItem('firstname') ? localStorage.getItem('firstname') : '',
            lastname : localStorage.getItem('lastname') ? localStorage.getItem('lastname') : ''
        }
        this.update = this.update.bind(this)
    }
    
    handleChange(attr, event){
		this.setState({
			[attr]: event.target.value
		});
    }

    update() {
        if( this.state.email !== '' && this.state.password !== '' && this.state.firstname !== '' && this.state.lastname !== '' ) {
            fetch('/api/user/profile', {
                method: 'POST', 
                headers: {
                    'Accept': 'application/json',
                    'access-token' : localStorage.getItem('token'),
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
                    alert('Updated!!!')
                    this.setState({
                        index : 0
                    })
                }
                else {
                    alert('User not exist')
                }
            });
        }
        else {
            alert('Please fill required information')
        }
    }
    
    render() {
        if (!localStorage.getItem('token')) {
            return ( <Redirect to={'/'} /> )
        }
        if( this.state.index === 0 ) {
            return (
                <div>
                    Congratulations! You have logged in successfully!!
                    <div>
                        <button onClick={() => {
                            this.setState({
                                index : 1
                            })
                        }}>Update Profile</button>
                    </div>
                </div>
            )
        }
        if ( this.state.index === 1 ) {
            return (
                <div>
                    <input type="text" name="name" value = {this.state.email} placeholder = "Email" onChange={this.handleChange.bind(this, 'email')} />
                    <input type="text" name="name" value = {this.state.password} type = "password" placeholder = "Password" onChange={this.handleChange.bind(this, 'password')} />
                    <div>
                        <input type="text" name="name" value = {this.state.firstname} placeholder = "FirstName" onChange={this.handleChange.bind(this, 'firstname')} />
                        <input type="text" name="name" value = {this.state.lastname} placeholder = "LastName" onChange={this.handleChange.bind(this, 'lastname')} />
                    </div>
                    <div>
                        <button onClick={this.update}>Update</button>
                    </div>
                </div>
            )
        }
        return <div/>
    }
}

export default Home;
