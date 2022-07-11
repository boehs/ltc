// @refresh reload
import { Links, Meta, Routes, Scripts } from "solid-start/root";
import { ErrorBoundary } from "solid-start/error-boundary";
import { Suspense } from "solid-js";
import Header from "./components/Header";
import './root.scss'
import Footer from "./components/Footer";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary>
          <Header/>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense>
            <Routes />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Footer/>
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  );
}
