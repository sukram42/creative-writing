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
import { AcceptInvite } from './views/acceptInvite/accept-invite.view.tsx';
import { PostHogProvider} from 'posthog-js/react'

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path='project/:id' element={<MainView />} />
        <Route index element={<ProjectView />} />
      </Route>
      <Route path="/onboarding" element={<RequireAuth><AcceptInvite /></RequireAuth>} />
      <Route path="/login" element={<LoginView />} />
    </>
  )
);
const options = {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST}
    options={options}
  >
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </PostHogProvider>

)
