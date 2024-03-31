import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from 'react-router-dom';

function Post() {
    let { id } = useParams();
    //  postsState is a object not a array
    // initial isLiked state
    const [postState, setPostState] = useState({ Likes: [], isLiked: false });
    const { authState } = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {
        // 假设 axios 请求包含 accessToken
        axios.get(`http://localhost:3001/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {

            // update state, post&like
            setPostState({
                ...response.data.post, //post data
                isLiked: response.data.likedPost ? true : false // current user like state
            });
        });
    }, [id]);
    //  like a post in post/${id} page

    const likeThisPost = () => {
        axios.post(`http://localhost:3001/likes`, { PostId: id }, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {
            // alert(response.data.alertText);
            //automaticlly refresh the like count
            //  postState is a obect,itself has like attribute 

            // if (response.data.liked) {
            //     //  postState is a obect,itself has like attribute 
            //     // if true
            //     setPostState({ 
            //         ...postState, 
            //         Likes: [...postState.Likes, 0] // 
            //     });
            // } else {
            //     // if dislike
            //     const likesArray = postState.Likes;
            //     likesArray.pop(); 
            //     setPostState({ 
            //         ...postState, 
            //         Likes: likesArray
            //     });
            // }

            if (response.data.liked) {
                // if add new like
                setPostState(prevState => ({
                    ...prevState,
                    isLiked: true, // chage islike
                    Likes: [...prevState.Likes, 0] // add in array
                }));
            } else {
                // if cancel like
                const likesArray = postState.Likes;
                likesArray.pop();
                setPostState(prevState => ({
                    ...prevState,
                    isLiked: false, // chage islike
                    Likes: likesArray // pop like
                }));
            }
        });
    };


    //delete Post

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then(() => {
            //delete comment then refresh comment list
            alert("DELETED SUCCESSFULLY");
            navigate('/');
            // setPostState(postState.filter((val) => {
            //     return val.id !== id;
            // }));
        });
    };

    //edit Post title and body 

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter New Title:");
            axios.put("http://localhost:3001/posts/updateTitle", { newTitle: newTitle, id: id },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    }
                });
            // auto reload post
            setPostState(
                { ...postState, title: newTitle }
                //     prevState => ({
                //     ...prevState,
                //     isLiked: true, // chage islike
                //     Likes: [...prevState.Likes, 0] // add in array
                // })
            );
        }
        else {
            let newBody = prompt("Enter New Text:");
            axios.put("http://localhost:3001/posts/updatePostBody", { newBody: newBody, id: id },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    }
                });
            setPostState({ ...postState, postText: newBody });
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">

                    {/* click and edit post body and title */}
                    <div className="title"
                        onClick={() => {
                            if (authState.username === postState.username) {
                                editPost("title");
                            }
                        }}
                    >
                        {postState.title}
                    </div>
                    <div className="body"
                        onClick={() => {
                            if (authState.username === postState.username) {
                                editPost("body");
                            }
                        }}
                    >
                        {postState.postText}
                    </div>
                    <div className="footer">{postState.username}
                        {/* <button onClick={() => { likeThisPost(postState.id) }}>
                            Like
                        </button> */}
                        <ThumbUpAltIcon
                            onClick={likeThisPost}
                            style={{ color: postState.isLiked ? 'blue' : 'grey' }}
                        />
                        {/* calculate the count of like */}
                        <lable>{postState.Likes.length}</lable>
                        {/* delete post => like delete comment*/}
                        {authState.username === postState.username && (
                            <button onClick={() => { deletePost(postState.id) }}>  Delete Post</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <Comment />
            </div>
        </div>



    );

};

export default Post