export class createNotificationDto {
  title: string;
  message: string;
  userIds?: string[];
  toAll?: boolean;
  role?: string;
}

export class markReadDto {
  notificationId: string;
  userId?: string;
}
