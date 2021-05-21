// import React from 'react';
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { blue } from '@material-ui/core/colors';

const font = "Titillium Web";

let CustomTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#111",
            light: "#404040",
            dark: "#0b0b0b",
            contrastText: "#fff"

        },
        secondary: {
            main: "#32cd32",
            light: "#69f0ae",
            dark: "#00c853",
            contrastText: blue
        }
    },
    typography: {
        fontFamily: [font, 'monospace'].join(","),
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 450,
            md: 780
        }
    }
});

CustomTheme = responsiveFontSizes(CustomTheme);

export default CustomTheme;