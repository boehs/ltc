// @refresh reload
import { Body, Head, Meta, FileRoutes, Scripts, ErrorBoundary, Routes, Html } from "solid-start";
import { Suspense } from "solid-js";
import Header from "./components/Header";
import './root.scss'
import Footer from "./components/Footer";
import { PopupPortal } from "./lib/shortcuts";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <PopupPortal/>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense>
            <main>
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
