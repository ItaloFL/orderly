import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";
import { AddProductModal } from "../components/admin/add-product-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogService } from "@/lib/catalog-service";
import { useCart } from "@/contexts/cart-content";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await catalogService.list();
      return data as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: FormData) => {
      const { data } = await catalogService.create(newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products: productsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function Products() {
  const [filter, setFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addItem } = useCart();

  const { products, isLoading, createProduct, isCreating } = useProducts();

  const categories = [
    "Ferramentas Elétricas",
    "Ferramentas Manuais",
    "EPIs e Segurança",
    "Consumíveis",
    "Elétrica e Iluminação",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        if (decodedPayload.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  const filteredProducts = products.filter(
    (p) => filter === "Todos" || p.category === filter,
  );

  return (
    <>
      <PageWrapper
        title="Cardápio"
        subtitle="Escolha seus itens favoritos e monte seu pedido."
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{ animationDelay: `${400 + index * 50}ms` }}
                className={`animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-backwards px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === cat
                    ? "bg-emerald-500 text-[#090d0b]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#090d0b] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 whitespace-nowrap shrink-0"
            >
              <Plus size={18} strokeWidth={3} />
              Novo Produto
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
            <Loader2 className="size-10 animate-spin mb-4" />
            <p className="text-white/60 text-sm">Carregando cardápio...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-10 text-center text-white/50">
                Nenhum produto encontrado nesta categoria.
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                  className="animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-backwards group relative rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl overflow-hidden hover:border-emerald-500/30 transition-all shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]"
                >
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                          Sem estoque
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-medium text-white mt-1 truncate">
                      {product.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <button
                        disabled={product.stock === 0}
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            quantity: 1,
                          })
                        }
                        className="p-2.5 rounded-xl bg-emerald-500 text-[#090d0b] hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </PageWrapper>

      {isModalOpen && (
        <AddProductModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createProduct}
          isLoading={isCreating}
        />
      )}
    </>
  );
}
