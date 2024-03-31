import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'// after logging in.show home page
import { AuthContext } from "../helpers/AuthContext";
function Login() {
    // initially, when open the page,give blank labels text
    const [userName, setUsername] = useState("");
    const [passWord, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);

    let navigate = useNavigate();

    // give the button event
    const login = () => {
        const data = { username: userName, password: passWord };
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            // First, routes/User.js conforms error massages and give the token(accessToken) !
            //Secondly, if there is the error ,set the alert and don't send the token
            // if there is right message, the token which can be identitied in Inspect/Application/Session storage the key and the Value

            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                // sessionStorage.setItem("username", response.data.username);
                setAuthState({ username: response.data.username, id: response.data.id, status: true });
                navigate('/');//after logging in.show home page
            }

        });
    };


    return (
        <div className="loginContainer">
            <label>Username:</label>
            <input
                type="text"
                // Once input any texts here, it will change the setUsername and userName
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />

            {/* Once click the button, it will call 'login' immediataly, post the userName and passWord to server */}
            <button onClick={login}> Login </button>
        </div>
    );
}

export default Login;