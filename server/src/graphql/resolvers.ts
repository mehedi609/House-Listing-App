import {ListingModel} from "../models";

export const resolvers = {
  Query: {
    listings: async () => {
      return ListingModel.find();
    },
  },
  Mutation: {
    deleteListing: async (_root: undefined, { id }: { id: string }) => {
      return ListingModel.findByIdAndRemove(id);
    },
  },
};
