import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, TextField, Button, Snackbar } from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import axios from '../axios';

const OrderModel = ({ selected, socket, updateFunds, setlogged }) => {
    const history = useHistory();
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [amount, setAmount] = useState(0);
    const [snackbarText, setSnackBarText] = useState();
    const [snackbarColor, setSnackBarColor] = useState();
    let unmounted = false;


    useEffect(() => {
        console.log("selected", selected)
        socket.on(selected, ticker => {
            if (!unmounted) {
                setPrice(ticker.data.c);
            }
        });

        return () => {
            unmounted = true;
            // socket.off(selected);
        }
    });

    const handleClick = async (side) => {
        const obj = { side, selected, quantity, amount };
        try {
            const order = await axios.post("/placeOrder", obj, {
                headers: {
                    "x-auth-token": localStorage.getItem("auth-token")
                }
            });
            if (order.status === 200) {
                setAmount(0);
                setQuantity(0);
                switch (order.data.slice(0, 5)) {
                    case "Order":
                        setSnackBarColor("success")
                        break;
                    case "Funds":
                        setSnackBarColor("info")
                        break;
                    default:
                        setSnackBarColor("error")
                }
                setSnackBarText(order.data);
                updateFunds();
            }
        } catch (ex) {
            console.log('err', ex);
            setSnackBarColor("error");
            setSnackBarText(ex.response.data);
            setlogged(false);
            localStorage.removeItem("auth-token");
            history.push("/");
        }

    }
    const handleClose = () => {
        setSnackBarText(undefined);
    }

    return (<Card raised>
        <CardHeader title={"Order Crypto"} />
        <CardContent style={{ paddingTop: "0.25em", textAlign: "center" }}>
            <TextField size="small" style={{ marginBottom: "0.75em", "[disabled]": { color: "black !important" } }} label={"Price"} disabled variant={"outlined"} value={price} />

            < TextField size="small" style={{ marginBottom: "0.75em" }} type="number"
                value={quantity} autoFocus
                onChange={(e) => { setQuantity(e.currentTarget.value); setAmount(e.currentTarget.value * price) }}
                variant={"outlined"} label={"Quantity"} />

            <TextField size="small" style={{ marginBottom: "0.75em" }} type="number"
                value={amount} autoFocus
                onChange={(e) => { setAmount(e.currentTarget.value); setQuantity((e.currentTarget.value / price).toFixed(4)) }}
                variant={"outlined"} label={"USDT Amount"} />

            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button disabled={price === 0} variant={"contained"} color={"limegreen"} style={{ width: "40%", color: "white", background: "limegreen", ":hover": { borderColor: "limegreen", color: "limegreen", background: "white" } }} onClick={() => handleClick("Buy")}>BUY</Button>
                <Button disabled={price === 0} variant={"contained"} color={"crimson"} style={{ width: "40%", color: "white", background: "crimson", ":hover": { borderColor: "crimson", color: "crimson", background: "white" } }} onClick={() => handleClick("Sell")}>SELL</Button>
            </div>
        </CardContent>
        <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} open={snackbarText} autoHideDuration={3000} onClose={handleClose} >
            <Alert variant={"filled"} onClose={handleClose} severity={snackbarColor}>{snackbarText}</Alert>
        </Snackbar>

    </Card>);
}

export default OrderModel;