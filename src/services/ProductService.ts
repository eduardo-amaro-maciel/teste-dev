export type Product = {
  id: string;
  name: string;
  unit: string;
  price: string;
  quantity: string;
  manufacturingDate: string;
  perishable: boolean;
  expirationDate?: string | undefined;
};

const PRODUCT_KEY_LOCALHOST = "products";

class ProductService {
  getAllProducts() {
    const prods = JSON.parse(localStorage.getItem(PRODUCT_KEY_LOCALHOST) || "[]");
    return prods;
  }

  getProduct(id: string): Product | undefined {
    const prods = JSON.parse(localStorage.getItem(PRODUCT_KEY_LOCALHOST) || "[]");
    const product = prods.find((prod: Product) => prod.id === id);
    return product || undefined;
  }

  addProduct(product: Product) {
    const prods = JSON.parse(localStorage.getItem(PRODUCT_KEY_LOCALHOST) || "[]");
    prods.push(product);
    localStorage.setItem(PRODUCT_KEY_LOCALHOST, JSON.stringify(prods));
  }

  deleteProduct(id: string) {
    const prods = JSON.parse(localStorage.getItem(PRODUCT_KEY_LOCALHOST) || "[]");
    for (let i = 0; i < prods.length; i++) {
      if (prods[i].id == id) {
        prods.splice(i, 1);
      }
    }
    localStorage.setItem(PRODUCT_KEY_LOCALHOST, JSON.stringify(prods));
  }

  updateProduct(oldProdId: string, newProd: Product) {
    const prods = JSON.parse(localStorage.getItem(PRODUCT_KEY_LOCALHOST) || "[]");

    for (let i = 0; i < prods.length; i++) {
      if (prods[i].id == oldProdId) {
        prods[i] = newProd;
      }
    }
    localStorage.setItem(PRODUCT_KEY_LOCALHOST, JSON.stringify(prods));
  }
}

export const productService = new ProductService();
