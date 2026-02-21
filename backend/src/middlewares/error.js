export const notFound = (req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ error: "ID no válido" });
  }
  console.error("Error inesperado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
};
