import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RequireAuth from './app/AuthProvider.tsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginView } from './views/login.view.tsx';
import { MainView } from './views/main.view.tsx';
import { Layout } from './views/layout/Layout.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<MainView />} />
      </Route>
      <Route path="/login" element={<LoginView />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
