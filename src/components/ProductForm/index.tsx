import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import MaskedInput from "react-text-mask";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Product, productService } from "@/services/ProductService";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SCHEMA_MESSAGES = {
  required: "Obrigatório",
  maximumCharacters: "No máximo 50 caracteres",
  expiredProduct: "Produto Vencido!",
};

const useProductFormSchema = (isPerishable: boolean) => {
  return useMemo(() => {
    return z
      .object({
        id: z.string().nonempty({ message: SCHEMA_MESSAGES.required }),
        name: z
          .string()
          .min(1, { message: SCHEMA_MESSAGES.required })
          .max(50, { message: SCHEMA_MESSAGES.maximumCharacters }),
        unit: z.string().min(1, { message: SCHEMA_MESSAGES.required }),
        price: z
          .string()
          .nonempty({ message: SCHEMA_MESSAGES.required })
          .refine((e) => e !== "0,00", { message: SCHEMA_MESSAGES.required }),
        quantity: z.string().min(1, { message: SCHEMA_MESSAGES.required }),
        expirationDate: isPerishable
          ? z
              .string({ required_error: SCHEMA_MESSAGES.required })
              .nonempty({ message: SCHEMA_MESSAGES.required })
              .min(1, { message: SCHEMA_MESSAGES.required })
          : z.string().optional(),
        manufacturingDate: z.string().nonempty({ message: SCHEMA_MESSAGES.required }),
        perishable: z.boolean(),
      })
      .refine(
        ({ manufacturingDate, expirationDate, perishable }) => {
          if (perishable && manufacturingDate && expirationDate) {
            const manuDate = new Date(manufacturingDate);
            const expDate = new Date(expirationDate);

            return expDate > manuDate;
          }

          return true;
        },
        {
          message: SCHEMA_MESSAGES.expiredProduct,
          path: ["expirationDate"],
        }
      );
  }, [isPerishable]);
};

export function ProductForm({ productEdit }: { productEdit?: Product }) {
  const [productPerishable, setProductPerishable] = useState(
    productEdit?.perishable ? productEdit?.perishable : false
  );
  const productSchema = useProductFormSchema(productPerishable);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "all",
    defaultValues: {
      id: productEdit ? productEdit.id : crypto.randomUUID(),
      name: productEdit ? productEdit.name : "",
      unit: productEdit ? productEdit.unit : "lt",
      price: productEdit ? productEdit.price : "0,00",
      quantity: productEdit ? productEdit.quantity : "",
      expirationDate: productEdit ? productEdit.expirationDate : "",
      manufacturingDate: productEdit ? productEdit.manufacturingDate : "",
      perishable: productPerishable,
    },
  });

  type ProductSchemaType = z.infer<typeof productSchema>;

  const unit = watch("unit");
  const unitScale = unit === "un";

  const formatPrice = (value: string) => {
    const onlyNums = value.replace(/\D/g, "");
    const number = onlyNums.length ? parseFloat(onlyNums) / 100 : 0;
    return number.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const productIsPerishable = () => {
    setProductPerishable((old) => !old);
    setValue("perishable", !productPerishable);

    if (productPerishable) {
      setValue("expirationDate", "");
      clearErrors("expirationDate");
    }
  };

  const formatQuantityForUnit = (quantity: string) => {
    const partBeforeFirstDot = quantity.split(".")[0];
    return quantity.includes(".") ? partBeforeFirstDot : quantity.replace(/,/g, "");
  };

  const handleProductSubmission = (data: ProductSchemaType, successMessage: string) => {
    data.quantity = data.unit === "un" ? formatQuantityForUnit(data.quantity) : data.quantity;

    if (productEdit?.id) productService.updateProduct(productEdit.id, data);
    else productService.addProduct(data);

    toast({
      title: "Tudo Ok",
      description: successMessage,
    });

    navigate("/product-list");
  };

  const onCreateNewProduct = (data: ProductSchemaType) => {
    handleProductSubmission(data, "Produto cadastrado com sucesso!");
  };

  const onEditProduct = (data: ProductSchemaType) => {
    handleProductSubmission(data, "Produto modificado com sucesso!");
  };

  return (
    <form onSubmit={productEdit ? handleSubmit(onEditProduct) : handleSubmit(onCreateNewProduct)}>
      <div className="p-3 mt-10 rounded-lg max-w-[1200px] w-full">
        <div className="grid grid-cols-2 grid-rows-3 gap-14 max-[1050px]:grid-cols-1 max-[1050px]:grid-rows-6">
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium">Nome do Produto *</label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, name, value } }) => (
                <MaskedInput
                  mask={(s: string) =>
                    Array.from(s).map(() => /[a-záéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ ]/i)
                  }
                  guide={false}
                  className="flex-1 border outline-none bg-transparent rounded-md h-10 pl-2"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.name && (
              <span className="absolute bottom-[-25px] text-destructive font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium">Unidade de Medida *</label>
            <select
              // onChange={(e) => setValue("unit", e.target.value)}
              {...register("unit")}
              className="border outline-none bg-transparent rounded-md h-10 pl-2"
            >
              <option value="lt">Litros</option>
              <option value="kg">Quilograma</option>
              <option value="un">Unidade</option>
            </select>
            {errors.unit && (
              <span className="absolute bottom-[-25px] text-destructive font-semibold">
                {errors.unit.message}
              </span>
            )}
          </div>
          <div>
            <div className="relative flex flex-col">
              <label className="mb-1 font-medium">Quantidade *</label>
              <div className="flex w-full">
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field: { onChange, name, value } }) => (
                    <NumericFormat
                      id="quantity"
                      {...(unitScale ? {} : { thousandSeparator: "." })}
                      {...(unitScale ? {} : { decimalSeparator: "," })}
                      {...(unitScale ? { decimalScale: 0 } : { decimalScale: 3 })}
                      name={name}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      onChange={onChange}
                      value={value}
                      className="flex-1 border outline-none bg-transparent rounded-md h-10 pl-2 rounded-r-none w-full"
                    />
                  )}
                />
                <div className="p-2 h-10 bg-gray-100 font-semibold border rounded rounded-l-none">
                  {unit}
                </div>
              </div>
              {errors.quantity && (
                <span className="absolute bottom-[-25px] text-destructive font-semibold">
                  {errors.quantity.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="relative flex flex-col">
              <label className="mb-1 font-medium">Preço *</label>
              <div className="flex">
                <div className="p-2 h-10 bg-gray-100 font-semibold border rounded rounded-r-none">
                  R$
                </div>
                <input
                  {...register("price")}
                  value={watch("price")}
                  onChange={(e) => setValue("price", formatPrice(e.target.value))}
                  className="flex-1 border outline-none bg-transparent rounded-md h-10 pl-2 rounded-l-none text-right pr-3 w-full"
                />
              </div>
              {errors.price && (
                <span className="absolute bottom-[-25px] text-destructive font-semibold">
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="relative flex flex-col">
              <label className="mb-1 font-medium">Data de Validade</label>
              <input
                type="date"
                {...register("expirationDate")}
                disabled={!productPerishable}
                className="border outline-none bg-transparent rounded-md h-10 pl-2 pr-3 disabled:bg-gray-100"
              />
              {errors.expirationDate && (
                <span className="absolute bottom-[-25px] text-destructive font-semibold">
                  {errors.expirationDate.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="relative flex flex-col">
              <label className="mb-1 font-medium">Data de Fabricação *</label>
              <input
                type="date"
                {...register("manufacturingDate")}
                className="border outline-none bg-transparent rounded-md h-10 pl-2 pr-3 disabled:bg-gray-100"
              />
              {errors.manufacturingDate && (
                <span className="absolute bottom-[-25px] text-destructive font-semibold">
                  {errors.manufacturingDate.message}
                </span>
              )}
            </div>
          </div>
          <div className="mt-[-10px] flex items-center gap-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("perishable")}
              onChange={productIsPerishable}
            />
            <label className="text-base font-semibold">Marcar como Perecível</label>
          </div>
        </div>
        <div className="w-full flex gap-4 mt-10">
          <Button className="" variant={"default"} type="submit">
            Salvar
          </Button>
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors text-primary-foreground hover:bg-destructive/90 h-10 px-4 py-2 bg-destructive"
            to={"/product-list"}
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
