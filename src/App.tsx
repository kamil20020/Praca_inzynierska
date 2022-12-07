import React, { useRef } from 'react';
import keycloak from "./keycloak/Keycloak";
import {
  Route,
  BrowserRouter,
  Routes,
  Outlet,
  useNavigate
} from "react-router-dom";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Home from "./pages/home/Home";
import NavBar from "./components/layout/navigation/NavBar";
import Header from "./components/layout/header/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar } from "@mui/material";
import axios from "axios";
import Notification from "./components/common/Notification";
import Content from "./components/layout/content/Content";
import Footer from "./components/layout/footer/Footer";
import Technologies from "./pages/technologies/Technologies";
import NotFound from "./pages/error/NotFound";
import ProtectedRoute from "./keycloak/ProtectedRoute";
import UserDetails from "./pages/user-details/UserDetails";
import SearchUsers from "./pages/manage-users/SearchUsers";
import ManageUser from "./pages/manage-users/ManageUser";
import ArticlesVerification from './pages/articles-verification/ArticlesVerification';
import KeycloakService, { roles } from './keycloak/KeycloakService';
import SearchArticles from './pages/articles/SearchArticles';
import ArticleView from './pages/articles/ArticleView';
import CreateUpdateArticle from './pages/articles/CreateUpdateArticle';
import ArticleVerificationView from './pages/articles-verification/ArticleVerificationView';
import 'moment/locale/pl'
import moment from 'moment';
import { plPL as plPLLocale } from '@mui/material/locale';
import { plPL as plPLGrid} from '@mui/x-data-grid';
import { plPL as plPLDatePickers } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { logout, setAccessToken, setRefreshToken } from './redux/slices/keycloakSlice';
import { setNotificationMessage, setNotificationType, setNotificationStatus } from './redux/slices/notificationSlice';

moment.locale("pl")

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
  plPLLocale,
  plPLGrid,
  plPLDatePickers
)

function App() {

  const authData = useSelector((state: RootState) => state.keycloak)
  const dispatch = useDispatch()

  const [doExtendSession, setDoExtendSession] = React.useState<any>(false)

  const handleMoveEvent = (e: any) => {

    document.removeEventListener('mousemove', handleMoveEvent)

    if(authData.access_token == ''){
      return;
    }

    setDoExtendSession(true)

    KeycloakService.getAccessTokenOnRefreshToken(authData.refresh_token as string)
    .then((response) => {
      const data = response.data
      const accessToken =  data.access_token
      const accessTokenExpiresIn = data.expires_in
      const refreshToken = data.refresh_token
      const refreshTokenExpiresIn = data.refresh_expires_in
      dispatch(setAccessToken({token: accessToken, expires_in: accessTokenExpiresIn}))
      dispatch(setRefreshToken({token: refreshToken, expires_in: refreshTokenExpiresIn}))
      dispatch(setNotificationMessage('Przedłużono sesję logowania'))
      dispatch(setNotificationType('info'))
      dispatch(setNotificationStatus(true))
    })
  }

  React.useEffect(() => {

    if(authData.access_token != ''){

      KeycloakService.setAxiosHeader(authData.access_token as string);

      setTimeout(() => {

        if(authData.access_token == ''){
          return;
        }

        dispatch(setNotificationMessage('Została minuta do końca sesji logowania. Poruszenie myszą przedłuży sesję'))
        dispatch(setNotificationType('info'))
        dispatch(setNotificationStatus(true))

        document.addEventListener('mousemove', handleMoveEvent);

        setTimeout(() => {
          if(authData.access_token == ''){
            return;
          }
          let doExtendSession
          setDoExtendSession((value: boolean) => {
            console.log(value)
            doExtendSession = value
            return value
          })
          if(!doExtendSession){
            dispatch(logout())
            dispatch(setNotificationMessage('Sesja logowania została zakończona'))
            dispatch(setNotificationType('info'))
            dispatch(setNotificationStatus(true))
          }
          else{
            setDoExtendSession(false)
          }
        }, 10000)

      }, (authData.access_token_expires_in - authData.access_token_expires_in / 10) * 1000)
    }
  }, [authData.access_token])

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
