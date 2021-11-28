import { Schema, model } from "mongoose";
import { IListing } from "../lib/types";

const schema = new Schema<IListing>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  numOfGuests: { type: Number, required: true },
  numOfBeds: { type: Number, required: true },
  numOfBaths: { type: Number, required: true },
  rating: { type: Number, required: true },
});

// 3. Create a Model.
export const Listing = model<IListing>("Test_Listing", schema);
