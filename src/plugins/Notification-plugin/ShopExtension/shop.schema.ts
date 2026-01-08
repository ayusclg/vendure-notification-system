import { gql } from "graphql-tag";

export const shopSchema = gql`
  type Notification {
    id: ID!
    title: String!
    message: String!
    createdAt: DateTime!
  }

  type NotificationEntity {
    notification: Notification
    user: User
    createdAt: DateTime!
  }

  extend type Query {
    getMyNotifications: [NotificationEntity]
    countUnreadNotifications: Int
    getMyUnreadNotifications: [NotificationEntity]
  }
  extend type Mutation {
    markAsRead(notificationId: ID!): NotificationEntity
  }
`;
