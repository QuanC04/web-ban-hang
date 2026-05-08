import { createRoute } from "@tanstack/react-router";
import ProductDetailPage from "../pages/productDetail";
import { rootRoute } from "./__root";

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: () => {
    const { productId } = productDetailRoute.useParams();
    return <ProductDetailPage productId={productId} />;
  },
});

export default productDetailRoute;
