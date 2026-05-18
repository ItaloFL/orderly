import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Trash2, Loader2 } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  price: z.number().min(0.01, "Preço inválido"),
  category: z.string().min(1, "Selecione uma categoria"),
  stock: z.string().min(1, "Mínimo 1 unidade"),
  image: z.any(),
});

type ProductForm = z.infer<typeof productSchema>;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export function AddProductModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: AddProductModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "",
      stock: "1",
    },
  });

  const selectedCategory = watch("category");

  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setValue("image", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setValue("image", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: ProductForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());
    if (data.image) formData.append("image", data.image);

    await onSubmit(formData);

    reset();
    setPreviewUrl(null);
    setPriceValue("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0d130f] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Novo Produto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-white/60 text-xs uppercase tracking-wider"
            >
              Nome do produto
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Furadeira Impacto 1/2"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-emerald-500/50"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-white/60 text-xs uppercase tracking-wider"
              >
                Preço
              </Label>
              <CurrencyInput
                id="price"
                placeholder="R$ 0,00"
                decimalsLimit={2}
                decimalSeparator=","
                groupSeparator="."
                prefix="R$ "
                value={priceValue}
                onValueChange={(value) => {
                  setPriceValue(value || "");
                  setValue(
                    "price",
                    parseFloat(value?.replace(",", ".") || "0"),
                  );
                }}
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              />
              {errors.price && (
                <p className="text-xs text-red-400">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="text-white/60 text-xs uppercase tracking-wider"
              >
                Estoque Inicial
              </Label>
              <Input
                id="stock"
                type="number"
                min="1"
                {...register("stock")}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {errors.stock && (
                <p className="text-xs text-red-400">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Categoria
            </Label>
            <Select
              value={selectedCategory || ""}
              onValueChange={(value) => setValue("category", value!)}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-emerald-500/50">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d130f] border-white/10">
                {[
                  "Ferramentas Elétricas",
                  "Ferramentas Manuais",
                  "EPIs e Segurança",
                  "Consumíveis",
                  "Elétrica e Iluminação",
                ].map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="text-white focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer py-2.5"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Imagem do produto
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 hover:border-emerald-500/50 hover:bg-white/5"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) =>
                  e.target.files?.[0] && handleImageChange(e.target.files[0])
                }
              />

              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-white/40 space-y-2">
                  <div
                    className={`p-3 rounded-full ${isDragging ? "bg-emerald-500/20" : "bg-white/5"}`}
                  >
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-emerald-500">
                      Clique para buscar
                    </span>{" "}
                    ou arraste
                  </div>
                  <p className="text-xs text-white/30">PNG, JPG ou WEBP</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-semibold h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#090d0b] font-bold shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Salvar Produto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
