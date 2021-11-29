import { Schema, model, Types } from "mongoose";
import { IListing } from "../lib/types";

const schema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  host: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  admin: { type: String, required: true },
  price: { type: Number, required: true },
  numOfGuests: { type: Number, required: true },
  bookings: [{ type: "ObjectId", ref: "Booking" }],
  bookingsIndex: { type: Object },
});

// 3. Create a Model.
export const ListingModel = model<IListing>("Listing", schema);
