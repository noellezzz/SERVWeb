import "./index.css";
import 'react-toastify/dist/ReactToastify.css'
import App from "./App";

import { registerLicense } from '@syncfusion/ej2-base';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import {store,persistor} from "./states/store.js";
import { PersistGate } from 'redux-persist/integration/react'

import { ToastContainer } from 'react-toastify'
registerLicense(import.meta.env.VITE_APP_EJ2MAPS_API);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

     <PersistGate persistor={persistor} loading={null}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
