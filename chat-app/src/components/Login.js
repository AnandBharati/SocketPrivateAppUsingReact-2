import React, { useState } from 'react'
import './LoginStyle.css';
import { useDispatch} from 'react-redux';
import {addSelf, addUser} from '../redux/slice';
import {useNavigate} from 'react-router-dom'
import {io} from 'socket.io-client'

export const socket = io('http://localhost:5000',{autoConnect: false});

function Login() {
    const [myUsername, setMyUsername] = useState('');
    const [myPassword, setMyPassword] = useState('');
    ///const selector = useSelector(state=> state.chatReducers);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function submitSelf(e){
        e.preventDefault();
        socket.auth= {'username': myUsername};
        socket.connect();
        socket.on('ownerData',({username, id})=>{
            dispatch(addSelf({'username' :username, 'id': id}));
        })

        socket.on('allUsers', (data) => {
            dispatch(addUser(data));
          })
        navigate('/chatwindow');

    }

    return (
        <div className='login-container'>
            <div className="left-container"> </div>
            <div className="right-container">
                <h1>Chat App</h1>
                <div className="login-controls">
                    <h2>Login</h2>
                    <label htmlFor="username" >Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder='Enter Username'
                        value={myUsername}
                        onChange={(e) => setMyUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Enter Password'
                        value={myPassword}
                        onChange={(e) => setMyPassword(e.target.value)}
                    />
                    <input type="button" value="Login" onClick={(e)=>submitSelf(e)}/>
                </div>
            </div>
        </div>
    )
}

export default Login