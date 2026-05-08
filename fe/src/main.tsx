import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import homeRoute from "./routes/home";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import profileRoute from "./routes/profile";
import profileAddressRoute from "./routes/profile-address";
import profileSecurityRoute from "./routes/profile-security";
import shopRoute from "./routes/shop";
import shopProductsRoute from "./routes/shop-products";
import productDetailRoute from "./routes/product-detail";
import shopStoreRoute from "./routes/shop-store";
import cartRoute from "./routes/cart";
import checkoutRoute from "./routes/checkout";
import orderSuccessRoute from "./routes/order-success";

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  loginRoute,
  profileRoute,
  profileAddressRoute,
  profileSecurityRoute,
  shopRoute,
  shopProductsRoute,
  productDetailRoute,
  shopStoreRoute,
  cartRoute,
  checkoutRoute,
  orderSuccessRoute,
]);
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
