import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { ProductList } from "@/views/ProductList";
// import { CreateProduct } from "@/views/CreateProduct";
// import { EditProduct } from "@/views/EditProduct";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Suspense, lazy } from "react";
import { Loading } from "@/components/Loading";

const ProductList = lazy(() => import("@/views/ProductList"));
const CreateProduct = lazy(() => import("@/views/CreateProduct"));
const EditProduct = lazy(() => import("@/views/EditProduct"));

export function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to={"/product-list"} />}></Route>
            <Route path="/product-list" element={<ProductList />}></Route>
            <Route path="/create-product" element={<CreateProduct />}></Route>
            <Route path="/edit-product/:id" element={<EditProduct />}></Route>
            <Route path="*" element={<Navigate to={"/product-list"} />}></Route>
          </Routes>
        </MainLayout>
      </Suspense>
    </Router>
  );
}
