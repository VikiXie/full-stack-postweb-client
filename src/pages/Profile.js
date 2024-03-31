import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    let { id } = useParams();
    let navigate = useNavigate();
    const [userState, setUserState] = useState("");
    const [listOfPostState, setListOfPostState] = useState([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        // get userid
        axios
            .get(`http://localhost:3001/auth/basicinfo/${id}`)
            .then((response) => {
                setUserState(response.data.username);
            })
        // get this userid's all posts
        axios
            .get(`http://localhost:3001/posts/byuserId/${id}`)
            .then((response) => {
                setListOfPostState(response.data);
            })
    })
    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h1>Username: {userState}</h1>
                {authState.username === userState && (
                    <button onClick={() => { navigate('/changepassword'); }}>  Change My Password</button>
                )}
            </div>
            <div className='listOfPosts'>
                {/* paste from Home page, same format of postlists */}
                {listOfPostState.map((value, key) => {
                    return (
                        <div key={key} className="post">
                            <div className="title"> {value.title}</div>
                            <div className="body" onClick={() => { navigate(`/post/${value.id}`) }}>
                                {value.postText}
                            </div>
                            {/* add like system on footer */}
                            <div className="footer"> {value.username}
                                {/* <ThumbUpAltIcon
                                onClick={() => { likeAPost(value.id) }}
                                // grasp the postId, if in likedPosts array,change it to unlike,vice versa（反之亦然）,"unlikeBttn" used with css
                                className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                            /> */}
                                {/* calculate the count of like */}
                                <label> {value.Likes.length}</label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile