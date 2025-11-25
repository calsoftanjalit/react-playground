import {
  CartProvider,
  CheckoutFormProvider,
  WishlistProvider,
} from "@/context";
import queryClient from "@/services/apis/queryClient.ts";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.scss";
import { FilterProvider } from "@/context/FilterProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <CartProvider>
          <WishlistProvider>
            <CheckoutFormProvider>
              <MantineProvider>
                <Notifications position="top-right" />
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
              </MantineProvider>
            </CheckoutFormProvider>
          </WishlistProvider>
        </CartProvider>
      </FilterProvider>
    </QueryClientProvider>
  </StrictMode>
);
