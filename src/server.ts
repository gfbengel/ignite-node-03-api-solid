import { app } from "./app";

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    console.log("🚀 Server started on port 3333");
  });