import { Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/login.view";
import { MainView } from "./views/main.view";


function App() {
    return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
          </Route>
          <Route path="/login" element={<LoginView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;