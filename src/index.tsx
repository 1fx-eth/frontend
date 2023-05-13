import React from "react";
import { createRoot } from "react-dom/client";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./components/modal/Modal.component";
import { AppComponent } from "./components/app/App.component";
import "react-toastify/dist/ReactToastify.css";
import "../public/assets/styles/styles.scss";
import { MenuProvider } from "./components/menu/useMenu";
import { AuthenticationProvider } from "./contexts/authentication.context";
import { UserPositionsProvider } from "./hooks/useUserPositions";

const getLibrary = (provider: ExternalProvider): Web3Provider => {
  const lib = new Web3Provider(provider);
  lib.pollingInterval = 6000;
  return lib;
};

const container = document.getElementById("mainBody");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MenuProvider>
          <AuthenticationProvider>
            <UserPositionsProvider>
              <ModalProvider>
                <AppComponent />
              </ModalProvider>
            </UserPositionsProvider>
          </AuthenticationProvider>
        </MenuProvider>
      </Web3ReactProvider>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
