import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles/main.scss";
import App from "./App.tsx";
import queryClient from "@/services/apis/queryClient.ts";
import { CartProvider, CheckoutFormProvider } from "@/context";
import { FilterProvider } from "@/context/FilterProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <CartProvider>
          <CheckoutFormProvider>
            <MantineProvider>
              <Notifications />
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </MantineProvider>
          </CheckoutFormProvider>
        </CartProvider>
      </FilterProvider>
    </QueryClientProvider>
  </StrictMode>
);
