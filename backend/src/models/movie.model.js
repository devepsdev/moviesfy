import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    title:       { type: String, required: true, maxlength: 255 },
    description: { type: String, maxlength: 255 },
    year:        { type: Number },
    votes:       { type: Number, default: 0 },
    rating:      { type: Number, min: 0, max: 10 },
    image_url:   { type: String, maxlength: 255 },
  },
  { timestamps: true }
);

export const Movie = model("Movie", movieSchema);
