import { StatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <main>
      <StatusCode code={404}></StatusCode>
      <h2>nothing here :(</h2>
      <p>we're very sorry. How about a <a href="/random">random</a> letter?</p>
    </main>
  );
}