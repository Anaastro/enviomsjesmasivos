import { LoggedProvider } from "@/lib/context/LoggedContext";
import { UserProvider } from "@/lib/context/UserContext";
import { IsSentProvider } from "@/lib/context/IsSentContext";
import { useBeforeUnload } from "@/lib/hooks/useBeforeUnload";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { SelectedPhonesProvider } from "@/lib/context/SelectedPhonesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SelectedPhonesProvider>
      <NextUIProvider>
        <LoggedProvider>
          <UserProvider>
            <IsSentProvider>
              <Component {...pageProps} />
            </IsSentProvider>
          </UserProvider>
        </LoggedProvider>
      </NextUIProvider>
    </SelectedPhonesProvider>
  );
}
