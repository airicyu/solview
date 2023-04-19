import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Account } from "./pages/Account";
import { defaultContext, Web3Context } from "./contexts/web3Context";

const router = createHashRouter([
  {
    path: "/",
    element: <div>home</div>,
    children: [],
  },
  {
    path: "/account/:accountAddress",
    element: <Account></Account>,
    children: [],
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Web3Context.Provider value={defaultContext}>
          <RouterProvider router={router} />
        </Web3Context.Provider>
      </header>
    </div>
  );
}

export default App;
