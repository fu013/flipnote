import { Suspense } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import Loading from "loading";
import reportWebVitals from "reportWebVitals";
import Router from "router";
import "static/css/common.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </RecoilRoot>
  </Suspense>,
  document.querySelector("#root")
);
reportWebVitals();
