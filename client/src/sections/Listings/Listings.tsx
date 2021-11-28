import { FC } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Listings as IListingsData } from './__generated__/Listings';
import {
  DeleteListing as IDeleteListingsData,
  DeleteListingVariables as IDeleteListingsVariables,
} from './__generated__/DeleteListing';

interface Props {
  title: string;
}

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
      title
      image
      address
      price
      numOfBeds
      numOfBaths
      numOfGuests
      rating
    }
  }
`;

export const Listings: FC<Props> = ({ title }) => {
  const { data, loading, error, refetch } = useQuery<IListingsData>(LISTINGS);
  const [deleteListing, { loading: deleteLoading, error: deleteError }] =
    useMutation<IDeleteListingsData, IDeleteListingsVariables>(DELETE_LISTING);

  const listings = data?.listings ?? null;

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    await refetch();
  };

  const listingsList =
    listings?.map((listing) => (
      <li key={listing.id}>
        {listing.title}
        <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
      </li>
    )) ?? null;

  if (loading) {
    return <h2>loading...</h2>;
  }

  if (error) {
    return <h2>Something went wrong - please try again later!!</h2>;
  }

  const deleteListingLoadingMessage = deleteLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteError ? (
    <h4>
      Oh no! Something went wrong - could not delete item. Please try again
      later!!
    </h4>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      <ul>{listingsList}</ul>
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
