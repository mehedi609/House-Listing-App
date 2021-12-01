import { IResolvers } from "@graphql-tools/utils";
import crypto from "crypto";

import { IDatabase, IUser, IViewer } from "../../../lib/types";
import { Google } from "../../../lib/api";
import { ILogInArgs } from "./types";
import { IContext } from "../../../database";

async function logInViaGoogle(
  code: string,
  token: string,
  db: IDatabase
): Promise<IUser | undefined> {
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google log in error");
  }

  // Names/Photos/Email Lists
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User Id
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User Email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token: token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      token: token,
      bookings: [],
      income: 0,
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  return viewer;
}

export const ViewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      try {
        return Google.authUrl;
      } catch (e) {
        throw new Error(`Failed to query Google Auth url: ${e}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: ILogInArgs,
      { db }: IContext
    ): Promise<IViewer> => {
      const code = input ? input.code : null;
      const token = crypto.randomBytes(16).toString("hex");

      try {
        const viewer: IUser | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;

        if (!viewer) {
          return { didRequest: true };
        }
        return {
          _id: viewer._id,
          token: viewer.token,
          walletId: viewer.walletId,
          avatar: viewer.avatar,
          didRequest: true,
        };
      } catch (e) {
        throw new Error(`Failed to Log in: ${e}`);
      }
    },
    logOut: (): IViewer => {
      try {
        return { didRequest: true };
      } catch (e) {
        throw new Error(`Failed to Log out: ${e}`);
      }
    },
  },

  Viewer: {
    id: (viewer: IViewer): string | undefined => viewer._id,
    hasWallet: (viewer: IViewer): boolean | undefined =>
      viewer.walletId ? true : undefined,
  },
};
