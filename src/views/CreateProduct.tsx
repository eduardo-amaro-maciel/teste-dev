import { ProductForm } from "@/components/ProductForm";

export default function CreateProduct() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight max-[650px]:text-2xl">Cadastrar Produto</h1>
      <ProductForm />
    </div>
  );
}
