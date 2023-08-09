import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import { checkNullOrBlank,checkPassword } from "../common/CommonValidation";
import Loading from "../common/Loading";
import {ApiRequest} from "../common/ApiRequest";

const LoginIndex = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false); // For Loading
    const [success, setSuccess] = useState([]); // for success message
    const [error, setError] = useState([]); // for error message
    const [userCode, setUserCode] = useState(""); // for shop code
    const [password, setPassword] = useState(""); // for password
    let err = [];

    const passwordChange = (e) => {
        setSuccess([]);
        setError([]);
        setPassword(e.target.value);
    }

    const userCodeChange = (e) => {
        setSuccess([]);
        setError([]);
      setUserCode(e.target.value);
    }

    const loginClick = async() => {
      setLoading(true);

        if(!checkNullOrBlank(password)){
            err.push("Please fill password");
        }
        if(!checkNullOrBlank(userCode)){
          err.push("Please fill userCode");
        }

        if(err.length > 0) {
          setSuccess([]);
          setError(err);
        }else{
          setError([]);
         

          let loginData = {
            method: "get",
            url: `admin/login`,
            params: {
            user_code : userCode,
            password : password
            },
          };
          let response = await ApiRequest(loginData);
          if (response.flag === false) {
            setError(response.message);
            setSuccess([]);
           // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          } else {
            if (response.data.status == "OK") {
              history.push(`/Dashboard`)
              localStorage.setItem(`LoginProcess`, "true");
              setError([]);
            } else {
              setError([response.data.message]);
              setSuccess([]);
            }
          }
          setLoading(false);
        }
       
    }
    return(
        <>
        <LoginForm
        loginClick={loginClick}
        passwordChange={passwordChange}
        password={password}
        userCodeChange={userCodeChange}
        userCode={userCode}
        success={success}
        error={error}
        />
        <Loading start={loading} />
        </>
    )
}

export default LoginIndex
