import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection, User } from "@vendure/core";
import { createNotificationDto, markReadDto } from "./notification.types";
import { NotificationEntity } from "./notification.entity";
import { NotificationRecipientEntity } from "./notficationReceiptent.entity";

@Injectable()
export class NotificationService {
  constructor(private readonly connection: TransactionalConnection) {}

  async createNotification(
    ctx: RequestContext,
    createNotification: createNotificationDto
  ): Promise<NotificationEntity> {
    const repo = this.connection.getRepository(ctx, NotificationEntity);
    const newNotification = await repo.create({
      title: createNotification.title,
      message: createNotification.message,
    });
    await repo.save(newNotification);
    let users: User[] = [];
    if (createNotification.toAll) {
      users = await this.connection.getRepository(User).find();
    } else if (createNotification.role) {
      users = await this.connection
        .getRepository(User)
        .find({ where: { roles: { code: createNotification.role } } });
    } else if (createNotification.userIds) {
      users = await this.connection
        .getRepository(User)
        .findByIds(createNotification.userIds);
    }
    const receiptents = users.map((u) => ({
      notification: newNotification,
      user: u,
      isRead: false,
    }));
    const createNotificationReceiptent = await this.connection
      .getRepository(NotificationRecipientEntity)
      .save(receiptents);
    return newNotification;
  }

  async getMyNotification(
    userId: string
  ): Promise<NotificationRecipientEntity[]> {
    const notifications = await this.connection
      .getRepository(NotificationRecipientEntity)
      .find({
        where: {
          user: { id: userId },
        },
        relations: ["notification"],
        order: { createdAt: "DESC" },
      });
    return notifications;
  }

  async getMyUnreadNotifications(
    userId: string
  ): Promise<NotificationRecipientEntity[]> {
    const myUnreadNotifications = await this.connection
      .getRepository(NotificationRecipientEntity)
      .find({
        where: {
          user: { id: userId },
          isRead: false,
        },
        relations: ["user"],
      });
    return myUnreadNotifications;
  }

  async totalUnreadNotifications(userId: string): Promise<Number> {
    const count = await this.connection
      .getRepository(NotificationRecipientEntity)
      .count({
        where: {
          user: {
            id: userId,
          },
          isRead: false,
        },
        relations: ["user"],
      });
    return count;
  }

  async markNotificationAsRead(
    payload: markReadDto
  ): Promise<NotificationRecipientEntity> {
    const markRead = await this.connection
      .getRepository(NotificationRecipientEntity)
      .findOne({
        where: {
          user: {
            id: payload.userId,
          },
          notification: {
            id: payload.notificationId,
          },
        },
        relations: ["user", "notification"],
      });
    if (!markRead) {
      throw new Error("No Notification Found");
    }
    markRead.isRead = true;
    await this.connection
      .getRepository(NotificationRecipientEntity)
      .save(markRead);

    return markRead;
  }
}
