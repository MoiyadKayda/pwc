import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

import CoinList from './CoinList';
import axios from "../axios";
import Chart from './Chart';
import OrderDetails from './OrderDetails';
import TradeHistory from "./TradeHistory";
import Funds from './Funds';
import OrderModel from './OrderModel';
import { useHistory } from "react-router-dom";



const GameScreen = ({ setlogged }) => {

    const history = useHistory();
    const [coins, setCoins] = useState([]);
    const [, setLoading] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");
    const [fundsList, setFundsList] = useState();

    const [socket,] = useState(io("https://pwc-backend.herokuapp.com/", { autoConnect: false }));

    const fundReq = async function () {

        try {
            const funds = await axios.get("/funds", {
                headers: {
                    "x-auth-token": localStorage.getItem("auth-token")
                }
            });
            setFundsList(funds.data);
        } catch (ex) {
            // console.log('err', ex);
            setlogged(false);
            localStorage.removeItem("auth-token");
            history.push("/");
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            setlogged(false);
            history.push("/");
        } else {
            setlogged(true);
        }
        async function coinReq() {
            setLoading(true);
            try {
                const res = await axios.get("/coinList", {
                    headers: {
                        "x-auth-token": localStorage.getItem("auth-token")
                    }
                });
                if (res.status === 200) {
                    setCoins(res.data);
                } else {
                    history.push("/");
                }
            } catch (ex) {
                // console.log('err', ex);
                setlogged(false);
                localStorage.removeItem("auth-token");
                history.push("/");
            }
            setLoading(false);
        }

        coinReq();
        fundReq();

    }, []);

    const handleCoinClick = (symbol) => {
        if (symbol) {
            setSelectedCoin(symbol);
        }
    }

    const updateFunds = () => {
        fundReq();
    }
    return (<React.Fragment>
        <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.25%", background: "whitesmoke", height: "100%" }}>
            <div style={{ width: "20%", height: "100vh" }}>
                <CoinList coinsList={coins} handleOnClick={handleCoinClick} selected={selectedCoin} socket={socket} />
            </div>
            <div style={{ width: "78%", height: "100%", marginTop: "0.25em" }}>
                <div style={{ display: "flex", height: "60%", justifyContent: "space-around" }}>
                    <div style={{ width: "72%" }}>
                        <Chart symbol={selectedCoin} />
                    </div>
                    <div style={{ width: "25%", margin: "2px", marginBottom: "0", height: "100%" }}>
                        <Funds coinsList={coins} fundsList={fundsList} />
                    </div>
                </div>
                {/* <br /> */}
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.75em" }}>
                    <div style={{ paddingTop: "0.25%", width: "72%", display: "flex", justifyContent: "space-around" }}>
                        <div style={{ width: "70%" }}>
                            <OrderDetails socket={socket} selected={selectedCoin} />
                        </div>
                        <div style={{ width: "28%" }}>
                            <TradeHistory socket={socket} selected={selectedCoin} />
                        </div>
                    </div>
                    <div style={{ width: "25%" }}>
                        <OrderModel setlogged={setlogged} selected={selectedCoin} socket={socket} updateFunds={updateFunds} />
                    </div>
                </div>
            </div>
        </div>
        <br /><br />
    </React.Fragment>);
}

export default GameScreen;