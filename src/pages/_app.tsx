import { type NextPage } from "next";
import { type ReactElement, type ReactNode } from "react";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";

import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

import { api } from "~/utils/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import 'mapbox-gl/dist/mapbox-gl.css';
import "~/styles/globals.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean; // Add this to protect routes
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  initialSession: Session;
};

const MyApp = ({
  Component,
  pageProps: { session, initialSession, ...pageProps },
}: AppPropsWithLayout) => {
  // Create a new supabase browser client on every first render
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      <SessionProvider session={session as Session | null}>
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools position={'bottom-right'} />
        </ChakraProvider>
      </SessionProvider>
    </SessionContextProvider>
  );
};

export default api.withTRPC(MyApp);
