import { Card, CardHeader, CardContent, TextField, Grid, Button, Snackbar, Typography } from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import React, { useState, useEffect } from 'react';
import axios from "../axios";
import { useHistory } from "react-router-dom";

const HomeScreen = (props) => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [feedback, setfeedback] = useState();
    const [feedbackColor, setFeedbackColor] = useState("success");
    const [nameHelper, setNameHelper] = useState("");
    const [emailHelper, setEmailHelper] = useState("");
    const [passHelper, setPassHelper] = useState("");


    useEffect(() => {
        if (props.title === "Login") {
            const token = localStorage.getItem("auth-token");
            if (token) {
                props.setlogged(true);
                history.push("/game");
            }
        }
    }, []);

    function validEmail(e) {
      // eslint-disable-next-line
      var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
      return String(e).search(filter) !== -1;
    }


    const handleClick = async () => {
        if (props.title === "Create Account" && !name) {
            setTimeout(() => {
                setNameHelper("");
            }, 5000);
            return setNameHelper("Name is required");
        }
        if (!validEmail(email)) {
            setTimeout(() => {
                setEmailHelper("");
            }, 5000);
            return setEmailHelper("Valid email is required");
        }
        if (!password) {
            setTimeout(() => {
                setPassHelper("");
            }, 5000);
            return setPassHelper("Password is required");
        }
        if (!(password.length >= 6)) {
            setTimeout(() => {
                setPassHelper("");
            }, 5000);
            return setPassHelper("Password should be atleast 6 characters long.");
        }
        const obj = props.title === "Create Account" ? { name, email, password } : { email, password };
        const url = props.title === "Login" ? "/login" : "/createAcc";
        try {
            const response = await axios.post(url, obj, {
                headers: {
                    "x-auth-token": localStorage.getItem("auth-token")
                }
            });
            if (response.status === 200) {
                if (response.data !== "Please login again") {
                    localStorage.setItem("auth-token", response.data);
                    props.setlogged(true);
                    history.push("/game");
                } else {
                    setfeedback(response.data);
                    setFeedbackColor("success");
                }
            } else {
                console.log(response)
                setfeedback(response.data);
                setFeedbackColor("error");
            }
            setName("");
            setEmail("");
            setPassword("");
        } catch (ex) {
            setfeedback(ex.response.data);
            setFeedbackColor("error");
        }
    };
    const handleClose = () => {
        setfeedback(undefined);
        setFeedbackColor("success");
    }


    return (<div className="home-screen" style={{ maxHeight: "100vh", minHeight: "95vh", display: "flex", alignItems: "center" }}>
        <Grid direction="row" justify="center" alignItems="center" container>
            <Card style={{ width: "25%", textAlign: "center", verticalAlign: "middle" }}>
                <CardHeader title={props.title} />
                <CardContent>
                    {props.title === "Create Account" && <TextField error={nameHelper} style={{ marginBottom: "0.5em" }} required label="Name" variant="outlined" helperText={nameHelper} value={name} onChange={(e) => !e.currentTarget.value.match(/[^\w\s]/gi) && !e.currentTarget.value.match(/[0-9]/i) ? setName(e.currentTarget.value) : ""} />}
                    <TextField color="secondary" error={emailHelper} style={{ marginBottom: "0.5em" }} required label="Email" variant="outlined" type={"email"} helperText={emailHelper} onChange={(e) => setEmail(e.currentTarget.value)} />
                    <TextField error={passHelper} style={{ marginBottom: "0.5em" }} required label="Password" variant="outlined" type={"password"} helperText={passHelper} onChange={(e) => setPassword(e.currentTarget.value)} />
                    <br />
                    <Button variant="contained" style={{ color: "white" }} color="secondary" onClick={handleClick}>{props.title}</Button>
                    {props.title !== "Create Account" && <div style={{ fontSize: "0.75em", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}><Typography>Don't have a account with us. </Typography><Button variant={"text"} size="small" onClick={() => history.push("/createAcc")}>Sign Up</Button></div>}
                </CardContent>
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} key={feedback} open={feedback} autoHideDuration={3000} onClose={handleClose} >
                    <Alert variant={"filled"} onClose={handleClose} severity={feedbackColor}>{feedback}</Alert>
                </Snackbar>

            </Card>
        </Grid>
    </div>
    );
}

export default HomeScreen;