import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableHead, TableRow, TableBody, CircularProgress } from "@material-ui/core";


const CoinList = ({ coinsList: coinlist, handleOnClick, selected, socket }) => {

    const [loading,] = useState(false);
    let newData = {}, lastValues = {};
    const [coinsData, setCoinsData] = useState();

    useEffect(() => {

        socket.open();
        coinlist.forEach(coin => {
            socket.on(coin.symbol + "USDT", ticker => {
                ticker = ticker.data;
                newData[ticker.s.slice(0, -4)] = { p: ticker.c, P: ticker.P };

            });
        })
        setInterval(() => {
            if (JSON.stringify(coinsData) !== JSON.stringify(newData) || coinsData === undefined) {
                lastValues = { ...coinsData };
                setCoinsData(newData);
            }
        }, 5000);
    }, [coinlist]);

    const createColumns = (id, name, minWidth) => {
        return ({ id, name, minWidth });
    };

    const Columns = [createColumns("1", "Symbol", "75%"), createColumns("2", "Change", "20%")];

    return (<Paper className={"invisible-scrollbar"} elevation={2} style={{ padding: "2px", paddingTop: "0", overflow: "scroll", overflowX: "hidden", height: "inherit" }}>
        <Table size="small" stickyHeader>
            <TableHead>
                <TableRow>
                    {Columns.map(col => <TableCell key={col.id} align={col.id === "2" ? "right" : "left"} style={{ minWidth: col.minWidth, padding: '1em' }}>{col.name}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading && <div style={{ width: "100%", textAlign: "center" }}><br /><CircularProgress style={{ justifyContent: "center" }} color="secondary" /></div>}
                {!loading && coinlist.map(coin => <TableRow className={"table-row"} style={{ background: selected.slice(0, -4) === coin.symbol ? "rgba(5,5,5,0.1)" : "" }} key={coin._id} onClick={() => handleOnClick(coin.symbol + "USDT")}>
                    <TableCell><div>{coin.symbol}<br /><div style={{ fontSize: "10px", color: "grey" }}>{coin.name}</div></div></TableCell>
                    <TableCell align="right">{!coinsData && <CircularProgress color="secondary" size={20} />}
                        {coinsData && !coinsData[coin.symbol] && <CircularProgress color="secondary" size={20} />}
                        <div>{coinsData && coinsData[coin.symbol] && coinsData[coin.symbol]["p"].slice(0, -5)}
                            <br /><div style={{ fontWeight: "700", fontSize: "10px", color: coinsData ? coinsData[coin.symbol] && coinsData[coin.symbol]["P"][0] === "-" ? "crimson" : "limegreen" : "grey"}}>{coinsData && coinsData[coin.symbol] && coinsData[coin.symbol]["P"]}</div></div>
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    </Paper>);
}

export default CoinList;