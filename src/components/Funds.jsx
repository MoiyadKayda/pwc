import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@material-ui/core';

const Funds = ({ coinsList, fundsList }) => {

    return (<Card raised>
        <CardHeader title={"Funds"} style={{ padding: "1em", paddingBottom: "0" }} />
        <CardContent className={"invisible-scrollbar"} style={{ paddingTop: "0", height: "45vh", overflow: "scroll", overflowX: "hidden" }}>
            <List>
                <ListItem>
                    <ListItemText style={{ width: "50%" }} primary={"USDT"} secondary={"Tether USD"} />
                    <ListItemText style={{ width: "50%", textAlign: "right" }} primary={fundsList && parseFloat(fundsList["USDT"]).toFixed(4)} />
                </ListItem>
                {coinsList.map(coin => <ListItem style={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
                    <ListItemText style={{ width: "50%" }} primary={coin.symbol} secondary={coin.name} />
                    <ListItemText style={{ width: "50%", textAlign: "right" }} primary={fundsList && parseFloat(fundsList[coin.symbol]).toFixed(4)} />
                </ListItem>)}
            </List>
        </CardContent>
    </Card>);
}

export default Funds;