import React from 'react';
import axios from "axios";
import { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';


function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    // change button's color when click the like
    // => grasp the likedPosts from Post routes
    const [likedPosts, setLikedPosts] = useState([]);


    let navigate = useNavigate();

    useEffect(() => {
        // if not login do not show home page
        if (!localStorage.getItem("accessToken")) {
            navigate('/login');
        } else {
            axios.get("http://localhost:3001/posts",
                {// Authentication
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    }
                }
            ).then((response) => {
                // setListOfPosts(response.data);
                setListOfPosts(response.data.listOfPosts);
                // get likepost 's post id
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                );
            });
        }
    }, []);


    //  like a post
    const likeAPost = (postId) => {
        // give the postID and validateToken by headers
        axios.post("http://localhost:3001/likes", {
            PostId: postId
        },
            {// Authentication
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            }
        ).then((response) => {
            // alert(response.data.alertText);
            //automaticlly refresh the like count
            setListOfPosts(
                listOfPosts.map((post) => {
                    if (post.id === postId) {
                        if (response.data.liked) {
                            return { ...post, Likes: [...post.Likes, 0] };
                        } else {
                            const likesArray = post.Likes;
                            likesArray.pop();
                            return { ...post, Likes: likesArray };
                        }
                    } else {
                        return post;
                    }
                })
            );
            // change button's color when click the like automaticly
            if (likedPosts.includes(postId)) {
                // remove from likedPosts array
                setLikedPosts(likedPosts.filter((id) => { return id !== postId }));
            } else {
                // add into likedPosts array
                setLikedPosts([...likedPosts, postId]);
            }
        });
    };


    return (
        <div>
            {listOfPosts.map((value, key) => {
                return (
                    <div key={key} className="post">
                        <div className="title"> {value.title}</div>
                        <div className="body" onClick={() => { navigate(`/post/${value.id}`) }}>
                            {value.postText}
                        </div>
                        {/* add like system on footer */}
                        <div className="footer">
                            <div className="username">
                                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
                            </div>
                            <div className="buttons">
                                <ThumbUpAltIcon
                                    onClick={() => { likeAPost(value.id) }}
                                    // grasp the postId, if in likedPosts array,change it to unlike,vice versa（反之亦然）,"unlikeBttn" used with css
                                    className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                />
                                {/* calculate the count of like */}
                                <label> {value.Likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div >
    );
}

export default Home