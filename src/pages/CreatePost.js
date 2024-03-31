// import React, { useRef, useEffect } from "react";
// if not login,show login page
import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// if not login,show login page
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  // if not login olf function

  // const navigate = useNavigate();
  // // check login states
  // const isMounted = useRef(true);
  //    //检查组件是否已经卸载
  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);
  //     // check token and component states
  // useEffect(() => {
  //   const accessToken = sessionStorage.getItem("accessToken");
  //   if (!accessToken && isMounted.current) {
  //     alert("Please log in to create a post.");
  //     navigate("/login");
  //   }
  // }, [navigate]);

  // if not login olf function

  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
    // username: "",
    // give username automatically
    // username: sessionStorage.getItem("username")|| "",
  };

  // if not login,show login page
  useEffect(() => {
     if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
    // username: Yup.string().min(3).max(15).required(),
  });

  const onSubmit = (data) => {
    // data are validationSchema
    // after login and non login page different, i don't need username fillin anymore, 
    // grab from middleware, has to use header in this situation
    axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }
    ).then((response) => {
      navigate('/');
    });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />
          {/* <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John123...)"
          /> */}
          {/* <p className="usernameDisplay">{sessionStorage.getItem("username")}</p> */}


          {/* <button type="submit" className="centeredButton"> Create Post</button> */}
          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;