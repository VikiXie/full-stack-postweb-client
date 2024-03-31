import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";// for delete comments


function Comment() {
    let { id } = useParams();
    const [commentState, setCommentState] = useState([]);
    const [createCommentState, setCreateCState] = useState("");
    // only authState is enough for delete comment
    const { authState } = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setCommentState(response.data);
        });

    }, [id]);


    const addComment = () => {
        axios.post("http://localhost:3001/comments", {
            commentBody: createCommentState,
            PostId: id,
        },
            {// Authentication
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            }
        ).then((response) => {
            if (response.data.error) {
                alert("Login First!");
                navigate('/login');//after logging in.show login page
            } else {
                
                const commentToAdd = { commentBody: createCommentState, username: response.data.username, };// add username
                //refresh comment list
                setCommentState([...commentState, commentToAdd]);
                setCreateCState("");
            }
        });
    };
    //delete comment

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then(() => {
            //delete comment then refresh comment list
            alert("DELETED SUCCESSFULLY");
            setCommentState(commentState.filter((val)=>{
                return val.id!== id;
            }));
        });
    };

    return (
        <div>
            <div className="addCommentContainer">
                <input type="text"
                    placeholder="Put your comment here..."
                    autoComplete="off"
                    value={createCommentState}
                    onChange={(event) => { setCreateCState(event.target.value) }}
                />
                <button onClick={addComment}> Add Comment</button>
            </div>

            <div className='listOfComments'>
                {commentState.map((value, key) => {
                    return (
                        <div key={key} className="comment">
                            {value.commentBody}
                            {/* as  */}
                            <label>Username: {value.username} </label>
                            {authState.username === value.username && (
                                <button onClick={() => { deleteComment(value.id) }}>  Delete comment</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

};

export default Comment