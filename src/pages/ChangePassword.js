import React from 'react'
import axios from "axios";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPasswordState, setOldPassword] = useState("");
  const [newPasswordState, setNewPassword] = useState("");
  let navigate = useNavigate();

  const ChangePassword = () => {
    axios.put(`http://localhost:3001/auth/changepassword`, {
      oldPassword: oldPasswordState,
      newPassword: newPasswordState,
    },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }).then((response) => {
        //delete comment then refresh comment list
        if (response.data.error) {
          alert(response.data.error);
        }
          else {
            alert("Change Password Successful");
            localStorage.removeItem("accessToken");
            //setAuthState({ username: "", id: 0, status: false });
            navigate('/login');
          }
      });
  }



  return (
    <div>
      <h1>Change Your Password</h1>
      <div className="addCommentContainer">
        <input type="text"
          placeholder="Old password"
          value={oldPasswordState}
          onChange={(event) => { setOldPassword(event.target.value) }}
        />
        <input type="text"
          placeholder="New password"
          value={newPasswordState}
          onChange={(event) => { setNewPassword(event.target.value) }}
        />
        <button onClick={() => { ChangePassword() }}> Change Password</button>
      </div>
    </div>
  )
}

export default ChangePassword