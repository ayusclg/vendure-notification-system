import { gql } from "graphql-tag";

export const adminSchema = gql`
  type Notification {
    id: ID!
    title: String!
    message: String!
  }
  input CreateNotificationInput {
    title: String!
    message: String!
    userIds: [ID!]
    role: String
    toAll: Boolean
  }
  extend type mutation {
    createNotification(input: CreateNotificationInput): Notification!
  }
`;
