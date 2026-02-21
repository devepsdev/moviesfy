import { Movie } from "../models/movie.model.js";

const CAMPOS_ORDEN = ["title", "year", "rating", "votes"];

const findAll = async ({
  page = 1,
  limit = 10,
  sort = "title",
  order = "asc",
  q,
  year,
  minRating,
  maxRating,
}) => {
  const filter = {};

  if (q != null) filter.title = { $regex: q, $options: "i" };
  if (year != null) filter.year = Number(year);
  if (minRating != null || maxRating != null) {
    filter.rating = {};
    if (minRating != null) filter.rating.$gte = Number(minRating);
    if (maxRating != null) filter.rating.$lte = Number(maxRating);
  }

  if (!CAMPOS_ORDEN.includes(sort)) sort = "title";
  const sortObj = { [sort]: order.toLowerCase() === "desc" ? -1 : 1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [total, results] = await Promise.all([
    Movie.countDocuments(filter),
    Movie.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
  ]);

  return { total, page: Number(page), limit: Number(limit), results };
};

const findById = async (id) => {
  return Movie.findById(id);
};

const create = async (movie) => {
  const created = await Movie.create(movie);
  return { insertId: created._id };
};

const update = async (id, movie) => {
  const result = await Movie.findByIdAndUpdate(id, movie, { new: true });
  return result ? { affectedRows: 1 } : { affectedRows: 0 };
};

const remove = async (id) => {
  const result = await Movie.findByIdAndDelete(id);
  return result !== null;
};

export { findAll, findById, create, update, remove };
