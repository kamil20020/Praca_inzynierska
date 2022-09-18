import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import React from 'react';
import keycloak from "./keycloak/Keycloak";
import {
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";
import Home from "./pages/home/Home";
import NavBar from "./components/layout/navigation/NavBar";
import Header from "./components/layout/header/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar } from "@mui/material";
import axios from "axios";
import Notification from "./components/common/Notification";
import Content from "./components/layout/content/Content";
import Footer from "./components/layout/footer/Footer";
import Articles from "./pages/articles/Articles";
import Technologies from "./pages/technologies/Technologies";
import NotFound from "./pages/error/NotFound";
import ProtectedRoute from "./keycloak/ProtectedRoute";
import UserDetails from "./pages/user-details/UserDetails";

const theme = createTheme({
  typography: {
    fontFamily: 'Helvetica, Roboto, Arial, sans-serif',
    fontSize: 13,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: '#fff',
      contrastText: '#000',
    },
    secondary: {
      main: '#5CA8EE',
      dark: '#168AF4',
      contrastText: '#fff',
    }
  },
})

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AppBar position="static">
            <Header/>
            <NavBar/>
          </AppBar>
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user-details" element={
                <ProtectedRoute requiredLogin={true}>
                  <UserDetails/>
                </ProtectedRoute>
              } />
              <Route path="/articles" element={<Articles />} />
              <Route path="/technologies" element={<Technologies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
          <Notification/>
          <Footer/>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
