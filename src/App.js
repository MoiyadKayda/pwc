import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ThemeProvider, Typography } from '@material-ui/core';
import CustomTheme from './CustomTheme';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import Account from './components/Account';
import { useState } from "react";
// api keyfor nomics aa3940574ecf1930d90056c83fa5e8fb



function App() {
  const [logged, setlogged] = useState(false);
  const islogged = (val) => {
    console.log("are you logged in", val);
    setlogged(val);
  };
  return (
    <ThemeProvider theme={CustomTheme}>

      <BrowserRouter>
        <Navbar logged={logged} setlogged={islogged} />
        <div style={{ background: "whitesmoke", minHeight: "92vh" }}>
          <Switch>
            <Route component={() => <HomeScreen title="Create Account" setlogged={islogged} />} path="/createAcc" />
            <Route component={() => <GameScreen setlogged={islogged} />} path="/game" />
            <Route component={() => <Account setlogged={islogged} />} path="/account" />
            <Route component={() => <HomeScreen title="Login" setlogged={islogged} />} path="/" />
          </Switch>
        </div>
      </BrowserRouter>
      <div style={{ textAlign: "center", background: "url('./assets/pattern.png')" }}>
        <Typography>
          Created by Moiyad Kaydawala
        </Typography>
      </div>
    </ThemeProvider >

  );
}

export default App;
