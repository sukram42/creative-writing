import ReactDOM from 'react-dom/client'
import './index.css'
import RequireAuth from './app/AuthProvider.tsx';
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginView } from './views/login.view.tsx';
import { MainView } from './views/main/main.view.tsx';
import { Layout } from './views/layout/layout.view.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { ProjectView } from './views/projects/projects.view.tsx';

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path='project/:id' element={<MainView />} />
        <Route index element={<ProjectView/>} />
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
