import React from "react";
import "./App.css";
import AuthProvider from "./containers/AuthProvider";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import DialogProvider from "./components/Dialog";
import MainRouter from "./routes/MainRouter";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import color from "./common/color.json";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: color.primary,
    },
    custom: {
      primary: "#2196F3",
      secondary: "#DCEDE2",
      background: "#F7F7F7",
      error: "#F0A69B",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        },
      },
    },
  },
});
function App() {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DialogProvider>
            <MainRouter />
          </DialogProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AuthProvider>
  );
}

export default App;
