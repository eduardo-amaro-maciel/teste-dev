import { Loading } from "@/components/Loading";
import { ProductForm } from "@/components/ProductForm";
import { Product, productService } from "@/services/ProductService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const [productEdit, setProductEdit] = useState<undefined | Product>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = productService.getProduct(id);
      if (foundProduct) {
        setProductEdit(foundProduct);
      } else {
        setProductEdit(undefined);
      }
      setLoading(false);
    }
  }, [id]);

  if (!id) {
    return <h1>Não tem ID</h1>;
  }

  if (loading) {
    return <Loading />;
  }

  if (productEdit === undefined) {
    return <h1>Produto não encontrado</h1>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight max-[650px]:text-2xl">Editar Produto</h1>
      <ProductForm productEdit={productEdit} />
    </div>
  );
}
