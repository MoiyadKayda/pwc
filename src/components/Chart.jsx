import * as React from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const Chart = (props) => {
    return (<div style={{ height: "100%" }}>
        <TradingViewWidget symbol={"BINANCE:" + props.symbol} theme={Themes.LIGHT} autosize locale="in" />
    </div>
    );
}

export default Chart;