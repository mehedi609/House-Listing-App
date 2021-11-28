import { Schema, model } from "mongoose";
import {IUser} from "../lib/types";

const schema = new Schema<IUser>({
    token: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    contact: { type: String, required: true },
    walletId: { type: String },
    income: { type: Number, required: true },
    bookings: [{ type: 'ObjectId', ref: 'Booking' }],
    listings: [{ type: 'ObjectId', ref: 'Listing' }]
});

// 3. Create a Model.
export const UserModel = model<IUser>("User", schema);
