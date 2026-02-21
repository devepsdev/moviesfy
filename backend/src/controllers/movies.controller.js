import * as repo from "../repositories/movies.repo.js";
import { schemaCreate, schemaUpdate } from "../validations/movies.schema.js";

export async function getAll(req, res, next) {
  try {
    const {
      page = "1",
      limit = "10",
      sort = "id",
      order = "ASC",
      q,
      year,
      minRating,
      maxRating,
    } = req.query;

    const params = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: String(sort),
      order: String(order),
    };

    if (q !== undefined) params.q = String(q);
    if (year !== undefined) params.year = Number(year);
    if (minRating !== undefined) params.minRating = Number(minRating);
    if (maxRating !== undefined) params.maxRating = Number(maxRating);

    const result = await repo.findAll(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const movie = await repo.findById(req.params.id);
    if (!movie)
      return res.status(404).json({ error: "Película no encontrada" });
    res.json(movie);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const parsed = schemaCreate.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: treeifyError(parsed.error) });
    }
    const result = await repo.create(parsed.data); // { insertId }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const parsed = schemaUpdate.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: treeifyError(parsed.error) });
    }
    const result = await repo.update(req.params.id, parsed.data); // { affectedRows }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Película no encontrada o sin cambios" });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await repo.remove(req.params.id); // boolean
    if (!deleted) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
