import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import RequireAuth from './app/AuthProvider.tsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginView } from './views/login.view.tsx';
import { MainView } from './views/main.view.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RequireAuth><MainView /></RequireAuth>}>
        {/* <Route path="/home" element={<Home />} /> */}
        {/* ... etc. */}
      </Route>
      <Route path="/login" element={<LoginView />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
