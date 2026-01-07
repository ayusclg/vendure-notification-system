import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RequestContext, Ctx, Allow, Permission } from "@vendure/core";
import { createNotificationDto } from "../notification.types";
import { NotificationEntity } from "../notification.entity";
import { NotificationService } from "../notification.service";

@Resolver()
export class AdminResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => [NotificationEntity])
  @Allow(Permission.SuperAdmin)
  async createNotification(
    @Ctx() context: RequestContext,
    @Args("input") createNotificationInput: createNotificationDto
  ) {
    const newNotification = await this.notificationService.createNotification(
      context,
      createNotificationInput
    );
    return newNotification;
  }
}
