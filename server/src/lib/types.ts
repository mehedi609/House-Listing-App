import { ObjectId, Collection } from "mongodb";

export interface IViewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}

interface IBookingsIndexMonth {
  [key: string]: boolean;
}

interface IBookingsIndexYear {
  [key: string]: IBookingsIndexMonth;
}

export interface IBookingsIndex {
  [key: string]: IBookingsIndexYear;
}

export interface IBooking {
  _id: ObjectId;
  listing: ObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export interface IListing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  bookings: ObjectId[];
  bookingsIndex: IBookingsIndex;
  price: number;
  numOfGuests: number;
}

export interface IUser {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: ObjectId[];
  listings: ObjectId[];
}

export interface IDatabase {
  listings: Collection<IListing>;
  bookings: Collection<IBooking>;
  users: Collection<IUser>;
}
