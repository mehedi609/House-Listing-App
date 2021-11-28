import { Schema, model } from "mongoose";
import {IUser} from "../lib/types";

const schema = new Schema<IUser>({
    name: { type: String, required: true },
});

// 3. Create a Model.
export const UserModel = model<IUser>("User", schema);
