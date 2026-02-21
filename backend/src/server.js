import { connectDB } from "./db/connect.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API escuchando en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });
