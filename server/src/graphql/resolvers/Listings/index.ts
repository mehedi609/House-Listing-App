import { ObjectId } from "mongodb";
import { IDatabase, IListing } from "../../../lib/types";
import { IResolvers } from "@graphql-tools/utils";

export const listingResolvers: IResolvers = {
  Query: {
    async listings(
      _root: undefined,
      _args: Record<any, any>,
      { db }: { db: IDatabase }
    ): Promise<IListing[]> {
      return await db.listings.find({}).toArray();
    },
  },

  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: IDatabase }
    ): Promise<IListing> => {
      const deletedResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (deletedResult.value) {
        return deletedResult.value;
      }
      throw new Error(
        `Could not be found. ${JSON.stringify(deletedResult.lastErrorObject)}`
      );
    },
  },

  Listing: {
    id: (listing: IListing): string => listing._id.toString(),
  },
};
