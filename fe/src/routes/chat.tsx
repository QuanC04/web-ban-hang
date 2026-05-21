import { createRoute } from "@tanstack/react-router";
import ChatPage from "../pages/chat";
import { rootRoute } from "./__root";

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

export default chatRoute;
