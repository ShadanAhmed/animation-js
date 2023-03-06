import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import theme from "../theme";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <div id="modal" className="hide">
          <span
            onClick={() => {
              document.getElementById("modal").classList.remove("show");
              document.getElementById("modal").classList.add("hide");
              document
                .getElementById("modal")
                .removeChild(
                  document
                    .getElementById("modal")
                    .getElementsByTagName("video")[0]
                );
            }}
            class="material-symbols-outlined"
            style={{ userSelect: "none" }}
          >
            close
          </span>
        </div>
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
