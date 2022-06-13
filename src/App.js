import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import ReactContextProvider from './config/ReactContextProvider';

import './mystyle.css';

function App() {
  return (
    <ReactContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactContextProvider>
  );
}

export default App;
