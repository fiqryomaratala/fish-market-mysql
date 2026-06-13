import { Fish, Package, ShoppingBag } from 'lucide-react'

type Product = {
  id: number
  name: string
  price: string
  stock: string
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Nila',
    price: 'Rp 38.000 / kg',
    stock: '120 kg tersedia',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'><defs><linearGradient id='g1' x1='0' x2='1' y1='0' y2='1'><stop stop-color='%232563EB'/><stop offset='1' stop-color='%2316A34A'/></linearGradient></defs><rect width='600' height='420' rx='36' fill='url(%23g1)'/><circle cx='120' cy='110' r='72' fill='rgba(255,255,255,0.12)'/><text x='70' y='80' fill='white' font-size='28' font-family='Arial'>Fresh Tilapia</text><path d='M170 220c45-55 135-80 208-38 15 8 28 20 41 34 16-8 33-12 51-9-8 16-18 29-33 40 8 10 15 22 20 35-17-1-33-6-46-14-16 12-34 22-53 29-57 20-131 10-188-29-22-15-44-34-59-56 18-5 38-2 59 8z' fill='white' fill-opacity='0.92'/><circle cx='374' cy='212' r='8' fill='%23111827'/></svg>",
  },
  {
    id: 2,
    name: 'Lele',
    price: 'Rp 30.000 / kg',
    stock: '200 kg tersedia',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'><defs><linearGradient id='g2' x1='0' x2='1' y1='0' y2='1'><stop stop-color='%236B7280'/><stop offset='1' stop-color='%232563EB'/></linearGradient></defs><rect width='600' height='420' rx='36' fill='url(%23g2)'/><circle cx='490' cy='90' r='80' fill='rgba(255,255,255,0.08)'/><text x='60' y='82' fill='white' font-size='28' font-family='Arial'>Farm Catfish</text><path d='M130 240c38-28 92-50 161-48 76 2 133 31 182 72-16 5-34 6-54 4-27 29-71 48-125 49-64 2-120-20-153-56-16 5-34 5-51-2 9-8 22-14 40-19z' fill='white' fill-opacity='0.9'/><path d='M414 230c36-35 62-47 101-52-9 21-25 42-49 62' fill='none' stroke='white' stroke-width='10' stroke-linecap='round' stroke-opacity='0.8'/><circle cx='350' cy='229' r='8' fill='%23111827'/></svg>",
  },
  {
    id: 3,
    name: 'Patin',
    price: 'Rp 42.000 / kg',
    stock: '90 kg tersedia',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'><defs><linearGradient id='g3' x1='0' x2='1' y1='0' y2='1'><stop stop-color='%232563EB'/><stop offset='1' stop-color='%23BFDBFE'/></linearGradient></defs><rect width='600' height='420' rx='36' fill='url(%23g3)'/><circle cx='160' cy='300' r='84' fill='rgba(255,255,255,0.08)'/><text x='68' y='82' fill='white' font-size='28' font-family='Arial'>Premium Pangasius</text><path d='M154 224c42-47 121-72 193-48 27 9 52 24 75 44 18-8 36-11 53-8-10 17-23 32-38 44 9 11 15 23 18 36-18-2-34-9-47-18-61 35-144 39-214 8-17-8-33-17-46-29-13 3-27 2-41-3 13-10 29-19 47-26z' fill='white' fill-opacity='0.92'/><circle cx='361' cy='216' r='8' fill='%23111827'/></svg>",
  },
  {
    id: 4,
    name: 'Gurame',
    price: 'Rp 55.000 / kg',
    stock: '75 kg tersedia',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'><defs><linearGradient id='g4' x1='0' x2='1' y1='0' y2='1'><stop stop-color='%2316A34A'/><stop offset='1' stop-color='%236B7280'/></linearGradient></defs><rect width='600' height='420' rx='36' fill='url(%23g4)'/><circle cx='474' cy='302' r='86' fill='rgba(255,255,255,0.08)'/><text x='70' y='84' fill='white' font-size='28' font-family='Arial'>Gourami Select</text><path d='M167 232c31-54 115-91 203-72 45 10 83 35 112 67-19 1-37 7-53 18-5 47-58 83-127 86-82 4-152-37-168-92-17-6-32-17-44-33 26-2 51 7 77 26z' fill='white' fill-opacity='0.91'/><circle cx='346' cy='216' r='8' fill='%23111827'/></svg>",
  },
]

export function FeaturedProducts() {
  return (
    <section id="marketplace" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-blue-600 uppercase">
              Produk Unggulan
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Hasil panen air tawar pilihan yang siap untuk pesanan hari ini
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-lg shadow-slate-100">
            <Package className="h-4 w-4 text-green-600" />
            Stok diperbarui dari batch panen aktif
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:border-blue-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow-lg shadow-slate-200 backdrop-blur">
                  <Fish className="h-3.5 w-3.5" />
                  Batch Segar
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-green-700">
                    {product.price}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{product.stock}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Lihat Detail
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
