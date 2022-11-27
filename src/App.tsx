import React from 'react';
import keycloak from "./keycloak/Keycloak";
import {
  Route,
  BrowserRouter,
  Routes,
  Outlet
} from "react-router-dom";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Home from "./pages/home/Home";
import NavBar from "./components/layout/navigation/NavBar";
import Header from "./components/layout/header/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { plPL } from '@mui/material/locale';
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
import SearchUsers from "./pages/manage-users/SearchUsers";
import ManageUser from "./pages/manage-users/ManageUser";
import ArticlesVerification from './pages/articles-verification/ArticlesVerification';
import { roles } from './keycloak/KeycloakService';
import SearchArticles from './pages/articles/SearchArticles';
import ArticleView from './pages/articles/ArticleView';
import CreateUpdateArticle from './pages/articles/CreateUpdateArticle';
import ArticleVerification from './pages/articles-verification/ArticleVerificationView';
import ArticleVerificationView from './pages/articles-verification/ArticleVerificationView';

const theme = createTheme(
  {
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
        contrastText: '#fff',
      },
      info: {
        main: '#008080',
        contrastText: '#fff',
      }
    },
  },
  plPL
)

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Grid item xs={12} container>
            <Grid item xs={12} container justifyContent="center" alignItems="flex-start">
              <AppBar position="static">
                <Header/>
                <NavBar/>
              </AppBar>
            </Grid>
            <Content>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user-details" element={
                  <ProtectedRoute requiredLogin={true}>
                    <UserDetails/>
                  </ProtectedRoute>
                } />
                <Route path="/articles" element={<Outlet/>}>
                  <Route index element={<SearchArticles/>} />
                  <Route path="details/:articleId" element={<ArticleView/>} />
                  <Route path="create-edit/:articleId" element={
                    <ProtectedRoute requiredLogin={true}>
                      <CreateUpdateArticle/>
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/articles-verification" element={
                  <ProtectedRoute requiredLogin={true} requiredRole={roles.reviewer.name}>
                    <Outlet />
                  </ProtectedRoute>
                }>
                  <Route index element={<ArticlesVerification/>} />
                  <Route path=":articleVerificationId" element={<ArticleVerificationView/>} />
                </Route>
                <Route path="/manage-users" element={
                  <ProtectedRoute requiredLogin={true} requiredRole={roles.administrator.name}>
                    <Outlet />
                  </ProtectedRoute>
                }>
                  <Route index element={<SearchUsers/>} />
                  <Route path="user/:userId/:userAccountId" element={<ManageUser/>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
            <Footer/>
          </Grid>
          <Notification/>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
