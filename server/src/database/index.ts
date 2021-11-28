import { MongoClient } from "mongodb";
import { IBooking, IDatabase, IListing, IUser } from "../lib/types";

// const user = process.env.DB_USER;
// const userPassword = process.env.DB_USER_PASSWORD;
// const cluster = process.env.DB_CLUSTER;
// const db = process.env.DB_NAME;

export const connectDatabase = async (): Promise<IDatabase> => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  await client.connect();

  console.log("Database Connected...");

  const db = client.db("main");

  return {
    bookings: db.collection<IBooking>("bookings"),
    users: db.collection<IUser>("users"),
    listings: db.collection<IListing>("listings"),
  };
};
