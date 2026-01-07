import { Resolver, Query, Mutation, Args, CONTEXT } from "@nestjs/graphql";
import { NotificationService } from "../notification.service";
import { NotificationEntity } from "../notification.entity";
import { NotificationRecipientEntity } from "../notficationReceiptent.entity";
import { markReadDto } from "../notification.types";
import { Allow, Permission, RequestContext } from "@vendure/core";
import { Ctx } from "@vendure/core";
@Resolver()
export class ShopResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => NotificationEntity)
  @Allow(Permission.Authenticated)
  async markAsRead(
    @Ctx() context: RequestContext,
    @Args("input") payload: markReadDto
  ) {
    const userId = context.activeUserId as string;
    payload.userId = userId;
    const marked =
      await this.notificationService.markNotificationAsRead(payload);
    return marked;
  }

  @Query(() => [NotificationRecipientEntity])
  @Allow(Permission.Authenticated)
  async getMyNotifications(@Ctx() context: RequestContext) {
    const userId = context.activeUserId as string;

    const notifications =
      await this.notificationService.getMyNotification(userId);
    return notifications;
  }

  @Query(() => Number)
  @Allow(Permission.Authenticated)
  async countUnreadNotifications(@Ctx() context: RequestContext) {
    const userId = context.activeUserId as string;
    const count =
      await this.notificationService.totalUnreadNotifications(userId);
    return count;
  }

  @Query(() => [NotificationRecipientEntity])
  @Allow(Permission.Authenticated)
  async getMyUnreadNotifications(@Ctx() context: RequestContext) {
    const userId = context.activeUserId as string;
    const myNotifications =
      await this.notificationService.getMyUnreadNotifications(userId);
    return myNotifications;
  }
}
