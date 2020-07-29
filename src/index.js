import app from "./app";

const PORT = process.env.BACKEND_PORT;

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
