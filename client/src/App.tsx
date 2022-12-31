/* eslint-disable multiline-ternary */
import { useAppSelector } from "./apps";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

function App () {
  const { token } = useAppSelector(({ auth }) => auth);

  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
