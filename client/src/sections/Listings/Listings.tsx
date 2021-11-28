import { FC } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Listings as IListingsData } from './__generated__/Listings';
import {
  DeleteListing as IDeleteListingsData,
  DeleteListingVariables as IDeleteListingsVariables,
} from './__generated__/DeleteListing';
import './styles/Listings.css';
import { Alert, Avatar, Button, List, Spin } from 'antd';
import { ListingsSkeleton } from '../components';

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

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    ></List>
  ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error={true} />
      </div>
    );
  }

  const deleteListingErrorAlert = deleteError ? (
    <Alert
      type="error"
      message={
        <>
          Oh no! Something went wrong - please try again later
          <span role="img" aria-label="Sad face emoji">
            😞
          </span>
        </>
      }
      className="listing__alert"
    />
  ) : null;

  return (
    <div className="listings">
      <Spin spinning={deleteLoading || loading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        <ul>{listingsList}</ul>
      </Spin>
    </div>
  );
};
