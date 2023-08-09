import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import Loading from "loading";
import reportWebVitals from "reportWebVitals";
import Router from "router";
import "static/css/common.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "page/error/ErrorBoundary";

// react-query 및 쿼리 로딩 suspense 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      mode?: "light" | "dark";
      primary: {
        main: string;
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});
// background: rgba(32,33,35,1);
// background: rgba(52,53,65,1);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Suspense fallback={<Loading />}>
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position="top-center" autoClose={1000} limit={1} />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </QueryClientProvider>
      </RecoilRoot>
    </ThemeProvider>
  </Suspense>
);
reportWebVitals();
