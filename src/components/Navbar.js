import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { AppBar, makeStyles, Toolbar, Typography, fade, Button, IconButton } from '@material-ui/core';
import { Menu, Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.primary.light, 1),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        },
        [theme.breakpoints.between('xs', 'md')]: {
            minWidth: "70%"
        }
    },
    searchIcon: {
        // background: theme.palette.primary.light,
        padding: theme.spacing(0, 1),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '25ch',
        }
    },
    navLinks: {
        display: "flex",
        textDecoration: "none",
        listStyle: "none",
        marginLeft: "1em",
        "& li": {
            marginLeft: "1em",
            textDecoration: "none",
            "& a": {
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
                color: theme.palette.primary.contrastText,
                textDecoration: "none"
            }
        }
    },
    navLinkActive: {
        // background: fade(theme.palette.primary.contrastText, 0.8),
        background: "rgba(255,255,255,0.95)",
        borderRadius: "10%",
        boxShadow: "inset 0 0 20px #fff",
        // opacity: 0.5,
        // color: `${theme.palette.primary.main} !important`
        color: `rgb(33, 150, 243) !important`
    },
    emptySpace: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            width: "10%"
        },
    },
    icons: {
        color: theme.palette.primary.contrastText
    },
    mobileMenu: {
        background: theme.palette.primary.main,
        minHeight: "20%",
        textAlign: "center",
        [theme.breakpoints.down("md")]: {
            height: "100vh"
        },

    }
}));


const Navbar = ({ logged, setlogged }) => {
    const classes = useStyles();
    const history = useHistory();
    const [mobileView, setMobileView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [NavObj, ] = useState([
        { path: "game", dispName: "Home" },
        { path: "account", dispName: "Account" }
    ]);

    const screenResize = () => {
        if (window.innerWidth < 780) return setMobileView(true);

        return setMobileView(false);

    }

    useEffect(() => {
        window.addEventListener("resize", screenResize);
    }, []);


    const NavigationLink = (navigation) => {
        return navigation.map(nav => <li key={nav.path}>
            <Button>
                <NavLink onClick={(e) => setMenuOpen(false)} activeClassName={classes.navLinkActive} to={`/${nav.path}`}>{nav.dispName}</NavLink>
            </Button>
        </li>);
    }


    return (<React.Fragment>
        <AppBar position="sticky" color="secondary" style={{ background: "#2196f3" }}>
            <Toolbar variant="dense">
                <Typography variant="h6" style={{ color: "white", fontWeight: 600, marginRight: mobileView ? "1em" : "0" }}>{mobileView ? "PWC" : <React.Fragment>Play&nbsp;With&nbsp;Crypto</React.Fragment>}</Typography>
                {!mobileView && <React.Fragment><div className={classes.emptySpace}></div>
                    <nav>
                        <ul className={classes.navLinks}>
                            {NavigationLink(NavObj)}
                            {logged && <Button style={{ color: "white" }}
                                onClick={() => { setlogged(false); localStorage.removeItem("auth-token"); history.push("/"); }}>Sign&nbsp;Out</Button>}
                        </ul>
                    </nav>
                    <div className={classes.emptySpace}></div></React.Fragment>}
                {/* <div className={classes.search} style={{ minWidth: "20%" }}>
                    <div className={classes.searchIcon}>
                        <Search />
                    </div>
                    <InputBase fullWidth style={{ paddingLeft: "2.5em", color: "white" }} className={{ root: classes.inputRoot, input: classes.inputInput }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                </div> */}
                {mobileView && <IconButton className={classes.icons} onClick={() => setMenuOpen(!menuOpen)}>
                    {!menuOpen ? <Menu /> : <Close />}
                </IconButton>}
            </Toolbar>
        </AppBar>
        <div hidden={!menuOpen} className={classes.mobileMenu}>
            <ul className={classes.navLinks} style={{ display: "block" }}>
                {/* path arg EXAMPLE --- /home ====> path = home (donot add '/' as it is already there) */}
                {NavigationLink(NavObj)}
            </ul>
        </div>
    </React.Fragment>
    );
}

export default Navbar;