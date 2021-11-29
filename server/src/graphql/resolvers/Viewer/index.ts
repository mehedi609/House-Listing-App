import { IResolvers } from "@graphql-tools/utils";

export const ViewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      return "Query.authUrl";
    },
  },
  Mutation: {
    logIn: () => {
      return "Mutation.Login";
    },
    logOut: () => {
      return "Mutaion.Logout";
    },
  },
};
