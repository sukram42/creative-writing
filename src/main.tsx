import ReactDOM from 'react-dom/client'
import './index.css'
import RequireAuth from './app/AuthProvider.tsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginView } from './views/login.view.tsx';
import { MainView } from './views/main/main.view.tsx';
import { Layout } from './views/layout/layout.view.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';

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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

)
