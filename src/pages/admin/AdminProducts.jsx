import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ limit: 50, q: search });
      setProducts(res.data?.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        toast.success(`Deleted ${name}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Product Management</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage catalog listings, prices, images, and inventory stock</p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center bg-white border border-neutral-300 px-3 py-2 max-w-md">
        <Search className="h-4 w-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Filter by product name, category, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-500">No products found.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover bg-neutral-100 border border-neutral-200" />
                    <div>
                      <p className="font-semibold text-neutral-900">{p.name}</p>
                      <p className="text-[10px] text-neutral-400">SKU: {p.sku || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/product/${p.slug}`}
                      target="_blank"
                      className="p-1 text-neutral-400 hover:text-black inline-block"
                      title="View live product"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/admin/products/${p._id}/edit`}
                      className="p-1 text-blue-600 hover:text-blue-900 inline-block"
                      title="Edit product"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      className="p-1 text-red-600 hover:text-red-900"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
