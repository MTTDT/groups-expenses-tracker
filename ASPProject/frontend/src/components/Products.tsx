// src/components/Products.tsx
import { useEffect, useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    price: 0 
  })

  useEffect(() => {
    async function getProduct(){
      try{
        console.log("1")
        const res = await fetch('http://localhost:5167/api/products')
        console.log("2")
        const data: Product[] = await res.json();
        setProducts(data)
      }catch(err){
        console.error("failed to get products: ",err)
      }
    }
    getProduct();
  },[])
   

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('http://localhost:5167/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    .then(res => res.json())
    .then((data: Product) => {
      setProducts([...products, data])
      setNewProduct({ name: '', price: 0 })
    })
  }


  return (
    <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Products</h1>
    
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Product name"
          className="px-4 py-2 border rounded"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price"
          className="px-4 py-2 border rounded"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value as any as number})}
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Product
      </button>
    </form>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  </div>
)
}