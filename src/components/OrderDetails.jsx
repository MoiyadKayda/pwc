import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Collapse, CardContent, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';


const OrderDetails = ({ socket, selected }) => {

    const [expanded, setExpanded] = useState(false);
    const [buyOrderData, setBuyOrderData] = useState([]);
    const [sellOrderData, setSellOrderData] = useState([]);
    const [lastSelected, setLastSelected] = useState();
    let unmounted = false;

    useEffect(() => {
        socket.open();
        setLastSelected(selected);
        socket.on(selected + "@depth", order => {
            if (!unmounted) {
                setBuyOrderData(order.data.bids);
                setSellOrderData(order.data.asks);
                if (!expanded)
                    setExpanded(true);
            }
        });


        return () => {
            unmounted = true;
            if (lastSelected !== selected) {
                console.log("cutting socket connection");
                socket.off(lastSelected + "@depth");
                // setExpanded(false);
                socket.close();
            }
        }
    });

    return (<Card raised>
        {/* <CardHeader title={"Order Book"} action={<IconButton onClick={() => setExpanded(!expanded)}> */}
        <CardHeader title={"Order Book"} style={{ padding: "0", paddingLeft: "1em", paddingRight: "1em" }} action={<IconButton style={{ marginTop: "0.5em" }} onClick={() => setExpanded(!expanded)}>
            <ExpandMore />
        </IconButton>} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{ display: "flex", justifyContent: "space-around", paddingTop: "0" }}>
                <TableContainer style={{ width: "49%" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>VOLUME</TableCell>
                                <TableCell>BUY PRICE</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sellOrderData.map((order, index) => <TableRow key={index}>
                                <TableCell>{order[1].slice(0, -2)}</TableCell>
                                <TableCell>{order[0].slice(0, -2)}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer style={{ width: "49%" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>SELL PRICE</TableCell>
                                <TableCell>VOLUME</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {buyOrderData.map((order, index) => <TableRow key={index}>
                                <TableCell>{order[0].slice(0, -2)}</TableCell>
                                <TableCell>{order[1].slice(0, -2)}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Collapse>

    </Card>);
}

export default OrderDetails;