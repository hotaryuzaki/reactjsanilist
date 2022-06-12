
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactContextProvider from './config/ReactContextProvider';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

function App() {
  return (
    <ReactContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reactjs-anilist" element={<Home />} />
            <Route path="reactjs-anilist/:id" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactContextProvider>
  );
}

export default App;
