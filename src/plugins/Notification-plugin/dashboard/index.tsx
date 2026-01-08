import { defineDashboardExtension } from "@vendure/dashboard";
import { Bell } from "lucide-react"; // Import the Bell icon component
import { SendNotificationPage } from "./send-notification-page";

defineDashboardExtension({
  routes: [
    {
      // The page will be available at /dashboard/notifications/send
      path: "/notifications/send",
      // Breadcrumb for navigation
      loader: () => ({ breadcrumb: "Send Notification" }),
      // Navigation menu item
      navMenuItem: {
        id: "send-notification",
        title: "Send Notification",
        // You can put it in a custom section or existing one
        sectionId: "marketing", // or 'catalog', 'sales', 'settings', etc.
        icon: Bell, // Pass the component, NOT a string
      },
      component: SendNotificationPage,
    },
  ],
});
