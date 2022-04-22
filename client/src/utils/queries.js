import { gql } from "@apollo/client";

export const GET_USER = gql`
  {
    user {
      _id
      username
      bookCount
      savedBooks {
          title
          authors
          description
          image
          bookId
      }
    }
  }
`;