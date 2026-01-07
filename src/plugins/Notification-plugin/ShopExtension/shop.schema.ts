import { gql } from "graphql-tag";

export const shopSchema = gql`
   
  type Notification {
    id: ID!
    title: String!
    message: String!
  }

  type NotificationEntity {
    notification: Notification
    user: User
    createdAt: Date!
  }

  extend type query {
    getMyNotifications( ): NotificationEntity
    countUnreadNotifications( ): Number
    getMyUnreadNotifications( ): NotificationEntity
  }
  extend type mutation {
    markAsRead( ): NotificationEntity
  }
`;
