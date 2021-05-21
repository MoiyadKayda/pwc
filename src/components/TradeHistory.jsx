import { Card, CardHeader, Collapse, CardContent, IconButton, TableContainer, Table, TableRow, TableCell } from '@material-ui/core';
import { ExpandMore, Star } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

const TradeHistory = ({ socket, selected }) => {

    const [tradeList, setTradeList] = useState([]);
    const [expanded, setExpanded] = useState(false);
    let unmounted = false;

    useEffect(() => {
        socket.open();
        socket.on(selected + "@trade", trade => {
            if (!unmounted) {
                setTradeList(trade);
                if (!expanded)
                    setExpanded(true);
            }
        });

        return () => {
            unmounted = true;
            socket.off(selected + "@trade");
            socket.close();
        }
    });


    return (<Card raised>
        <CardHeader title={<div>Trade&nbsp;History<br /><div style={{ fontSize: "0.5rem" }}><Star style={{ fontSize: "0.5rem" }} /> - Market Maker</div></div>} style={{ padding: "0", paddingLeft: "0.5em", paddingRight: "0.5em" }} action={<IconButton style={{ marginTop: "0.5em" }} onClick={() => setExpanded(!expanded)}>
            <ExpandMore />
        </IconButton>} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{ paddingTop: "0.25em" }}>
                <TableContainer style={{ marginTop: "0" }}>
                    <Table size="small">
                        {tradeList.map(trade => <TableRow key={trade.t}>
                            <TableCell className="t-cell-trade">{trade.p.slice(0, -4)}</TableCell>
                            <TableCell className="t-cell-trade">{trade.q.slice(0, -4)}</TableCell>
                            <TableCell className="t-cell-trade">{trade.m && <Star style={{ fontSize: "0.75rem", padding: "0" }} />}</TableCell>
                        </TableRow>)}
                    </Table>
                </TableContainer>
            </CardContent>
        </Collapse>

    </Card>);
}

export default TradeHistory;