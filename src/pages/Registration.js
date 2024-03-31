import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };
   let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(6).max(18).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then((response) => {
    
      if (response.data.error) {
        alert(response.data.error);
    } else {
        sessionStorage.setItem("accessToken", response.data);
        alert("Successful! Go to login page!");
        navigate('/login');//after logging in.show login page
    }
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
        
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John123...)"
          />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type ="password"
            id="inputCreatePost"
            name="password"
            placeholder="(Set password...)"
          />

          <button type="submit"> Register Now</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration