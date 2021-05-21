import { Card, CardHeader, CardContent, TextField, Grid, Button, Snackbar } from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { Check } from "@material-ui/icons";
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "../axios";


const Account = (props) => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [nhelper, setnHelper] = useState();
    const [phelper, setpHelper] = useState();
    const [feedback, setfeedback] = useState();
    const [feedbackColor, setFeedbackColor] = useState("success");

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            props.setlogged(false);
            history.push("/");
            props.setlogged(false);
        } else {
            props.setlogged(true);
        }
    }, []);

    const handleClick = async (updKey) => {
        let obj = {};
        if (updKey === "name") {
            if (name)
                obj = { name };
            else {
                setTimeout(() => {
                    setnHelper(undefined);
                }, 3000);
                setnHelper("Required field is empty");
            }
        } else {
            if (password.length >= 6)
                obj = { password };
            else {
                setTimeout(() => {
                    setpHelper(undefined);
                }, 3000);
                setpHelper("Password should be atleast 6 characters long");
            }
        }

        if (JSON.stringify(obj) !== "{}") {
            try {
                const response = await axios.post("/chngDetails", obj, {
                    headers: {
                        "x-auth-token": localStorage.getItem("auth-token")
                    }
                });

                if (response.status === 200) {

                    setfeedback(response.data)
                    setFeedbackColor("success");
                } else {
                    console.log(response);
                    setfeedback(response.data);
                    setFeedbackColor("error");
                }

            } catch (ex) {
                console.log('err', ex);
                props.setlogged(false);
                setFeedbackColor("error");
                setfeedback(ex.response.data);
                if (ex.response.status !== 400) {
                    localStorage.removeItem("auth-token");
                    history.push("/");
                }
            }
        }
    };

    const handleClose = () => {
        setfeedback(undefined);
    }


    return (<div className="home-screen" style={{ maxHeight: "100vh", minHeight: "95vh", display: "flex", alignItems: "center" }}>
        <Grid direction="row" justify="center" alignItems="center" container>
            <Card style={{ width: "25%", textAlign: "center", verticalAlign: "middle" }}>
                <CardHeader title={"Accounts"} />
                <CardContent>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <TextField error={nhelper} helperText={nhelper} style={{ marginBottom: "0.5em" }} required label="Name" variant="outlined" type={"email"} onChange={(e) => setName(e.currentTarget.value)} />
                        <Button style={{ marginBottom: "0.5em" }} onClick={() => handleClick("name")}><Check /></Button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <TextField error={phelper} helperText={phelper} style={{ marginBottom: "0.5em" }} required label="Password" variant="outlined" type={"password"} onChange={(e) => setPassword(e.currentTarget.value)} />
                        <Button variant="text" style={{ marginBottom: "0.5em" }} onClick={() => handleClick("password")}><Check /></Button>
                    </div>
                    <br />

                    <br />
                    <div style={{ fontSize: "0.5em", fontWeight: "bold" }}>* Changing only Name or Password property can be done by keeping the other TextBox empty</div>
                </CardContent>
            </Card>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} key={feedback} open={Boolean(feedback)} autoHideDuration={3000} onClose={handleClose} >
                <Alert variant={"filled"} onClose={handleClose} severity={feedbackColor}>{feedback}</Alert>
            </Snackbar>

        </Grid></div>);
}

export default Account;