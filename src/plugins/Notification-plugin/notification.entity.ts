import { VendureEntity } from "@vendure/core";
import { Column, Entity } from "typeorm";

@Entity()
export class NotificationEntity extends VendureEntity {
  constructor(input?: Partial<NotificationEntity>) {
    super(input);
  }
  @Column()
  title: string;

  @Column()
  message: string;
}
