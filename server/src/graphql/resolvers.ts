import { Listing } from "../models";

export const resolvers = {
  Query: {
    listings: async () => {
      return Listing.find();
    },
  },
  Mutation: {
    deleteListing: async (_root: undefined, { id }: { id: string }) => {
      return Listing.findByIdAndRemove(id);
    },
  },
};
