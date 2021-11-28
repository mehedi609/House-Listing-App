import {Types} from "mongoose";

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

export interface IListing {
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  bookings: Types.ObjectId[];
  bookingsIndex: IBookingsIndex;
  price: number;
}

export interface IUser {
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: Types.ObjectId[];
  listings: Types.ObjectId[];
}

export interface IBooking {
  title: string;
}

interface IPopulatedUser {
  bookings: IBooking[] | null;
  listings: IListing[] | null;
}
