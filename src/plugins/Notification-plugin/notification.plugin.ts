import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { NotificationService } from "./notification.service";
import { shopSchema } from "./ShopExtension/shop.schema";
import { ShopResolver } from "./ShopExtension/shop.resolver";
import { adminSchema } from "./AdminExtension/admin.schema";
import { AdminResolver } from "./AdminExtension/admin.resolver";
import { NotificationEntity } from "./notification.entity";
import { NotificationRecipientEntity } from "./notficationReceiptent.entity";
 
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [NotificationService],
  entities: [NotificationEntity, NotificationRecipientEntity],
  shopApiExtensions: {
    schema: shopSchema,
    resolvers: [ShopResolver],
  },
  adminApiExtensions: {
    schema: adminSchema,
    resolvers: [AdminResolver],
  },
  dashboard: "./dashboard/index.tsx",
  exports: [],
})
export class NotificationPlugin {}
