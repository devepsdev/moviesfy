import { z } from "zod";

export const schemaCreate = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(255, "El título no puede superar 255 caracteres"),

  description: z
    .string()
    .max(255, "La descripción no puede superar 255 caracteres")
    .optional(),

  year: z
    .number()
    .int("El año debe ser un número entero")
    .min(1888, "El cine nació en 1888, pon un año válido")
    .max(2100, "El año no puede superar 2100")
    .optional(),

  votes: z
    .number()
    .int("Los votos deben ser un entero")
    .min(0, "Los votos no pueden ser negativos")
    .optional(),

  rating: z
    .number()
    .min(0, "La puntuación mínima es 0")
    .max(10, "La puntuación máxima es 10")
    .optional(),

  image_url: z
    .string()
    .url("Debe ser una url válida")
    .max(255, "La URL no puede superar 255 caracteres")
    .optional(),
});
export const schemaUpdate = schemaCreate.partial();
