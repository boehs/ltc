import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404}/>
      <h2>nothing here :(</h2>
      <p>we're very sorry. How about a <a href="/random">random</a> letter?</p>
    </>
  );
}