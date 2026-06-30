import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("deals", "routes/deals.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("contact", "routes/contact.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
