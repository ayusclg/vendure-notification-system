import { User, VendureEntity } from "@vendure/core";
import { Column, Entity, ManyToOne } from "typeorm";
import { NotificationEntity } from "./notification.entity";

@Entity()
export class NotificationRecipientEntity extends VendureEntity {
  constructor(input?: Partial<NotificationRecipientEntity>) {
    super(input);
  }
  @ManyToOne(() => NotificationEntity, { onDelete: "CASCADE" })
  notification: NotificationEntity;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({ default: false })
  isRead: boolean;
}
