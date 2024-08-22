import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import App from "./app/App"
import { Provider } from "react-redux"
import { store } from "./model/store"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { Login } from "./features/Login/Login"
import { TodolistsList } from "./features/TodolistsList/TodolistsList"
import { ErrorPage } from "./features/ErrorPage/ErrorPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/404" />,
    children: [
      {
        index: true,
        element: <Navigate to="/todolists" />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/todolists",
        element: <TodolistsList />,
      },
    ],
  },
  {
    path: "/404",
    element: <ErrorPage />,
  },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)

reportWebVitals()
