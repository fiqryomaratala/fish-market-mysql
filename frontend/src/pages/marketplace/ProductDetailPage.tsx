import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'

function ProductDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Marketplace"
      title={`Product Detail ${id ? `#${id}` : ''}`.trim()}
      description="Halaman detail produk ikan untuk foto, spesifikasi, harga, stok, dan informasi penjualan."
    />
  )
}

export default ProductDetailPage
