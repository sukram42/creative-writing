import ReactDOM from 'react-dom/client'
import './index.css'
import RequireAuth from './app/AuthProvider.tsx';
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginView } from './views/login/login.view.tsx';
import { MainView } from './views/main/main.view.tsx';
import { Layout } from './views/layout/layout.view.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { ProjectView } from './views/projects/projects.view.tsx';
import { FirstLoginCheck } from './views/firstLoginCheck/first-login-check.view.tsx';
import { AcceptInvite } from './views/acceptInvite/acceptInvite.view.tsx';
import { ResetPassword } from './views/resetPassword/reset-password.view.tsx';
// import { PostHogProvider} from 'posthog-js/react'

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path='project/:id' element={<MainView />} />
        <Route index element={<ProjectView />} />
        <Route path='reset-password' element={<ResetPassword />} />
      </Route>
      <Route path="/onboarding" element={<RequireAuth><FirstLoginCheck /></RequireAuth>} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
    </>
  )
);
// const options = {
//   api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <PostHogProvider
  //   apiKey={import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST}
  //   options={options}
  // >
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </PostHogProvider>

)
