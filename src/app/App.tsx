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
import { useSelector } from "react-redux"
import { AppRootStateType, useAppDispatch } from "model/store"
import { RequestStatusType } from "model/appSlice"
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar"
import { Navigate, Outlet } from "react-router-dom"
import { logoutTC, meTC } from "model/authSlice"
import CircularProgress from "@mui/material/CircularProgress"

function App() {
  const dispatch = useAppDispatch()
  const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.auth.isInitialized)
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

  useEffect(() => {
    dispatch(meTC())
  }, [dispatch])

  const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)

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
