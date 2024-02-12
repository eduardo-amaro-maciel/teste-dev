import { ListStart, LucideIcon, ScrollText } from "lucide-react";

type layoutRoutes = {
  key: number;
  path: string;
  icon: LucideIcon;
  label: string;
};

export const layoutRoutes: layoutRoutes[] = [
  {
    key: 1,
    path: "/product-list",
    icon: ScrollText,
    label: "Lista de Produtos",
  },
  {
    key: 2,
    path: "/create-product",
    icon: ListStart,
    label: "Cadastrar Produto",
  },
];
