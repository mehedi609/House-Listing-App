import { Schema, model } from "mongoose";
import { IBooking } from "../lib/types";

const schema = new Schema<IBooking>({
    title: { type: String, required: true },
});

// 3. Create a Model.
export const BookingModel = model<IBooking>("Booking", schema);
