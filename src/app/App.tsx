import React, { useEffect } from "react"
import "./App.css"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import LinearProgress from "@mui/material/LinearProgress/LinearProgress"
import { AppRootStateType, useAppDispatch } from "model/store"
import { RequestStatusType } from "model/appSlice"
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar"
import { Navigate, Outlet } from "react-router-dom"
import { logoutTC, meTC } from "model/authSlice"
import CircularProgress from "@mui/material/CircularProgress"
import { useAppSelector } from "common/hooks/hooks"
import { selectorAppStatus } from "common/selectors/app.selectors"
import { selectIsInitialized, selectIsLoggedIn } from "common/selectors/auth.selectors"

function App() {
  const dispatch = useAppDispatch()

  const isInitialized = useAppSelector<AppRootStateType, boolean>(selectIsInitialized)
  const isLoggedIn = useAppSelector<AppRootStateType, boolean>(selectIsLoggedIn)
  const status = useAppSelector<AppRootStateType, RequestStatusType>(selectorAppStatus)

  useEffect(() => {
    dispatch(meTC())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  const onLogout = () => {
    dispatch(logoutTC())
  }
  const onLogin = () => {
    return <Navigate to={"/login"} />
  }

  return (
    <Grid className="App">
      <ErrorSnackbar />
      {status === "loading" && <LinearProgress />}

      <AppBar position="static" className={"app-bar"}>
        <Toolbar>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          {isLoggedIn && (
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          )}
          {!isLoggedIn && (
            <Button color="inherit" onClick={onLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container fixed className={"main-content"}>
        <Outlet />
      </Container>
    </Grid>
  )
}

export default App
