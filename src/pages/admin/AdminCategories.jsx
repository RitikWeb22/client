import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await productService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await productService.createCategory({ name, description, image });
      toast.success('Category created');
      setName('');
      setDescription('');
      setImage('');
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Creation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await productService.deleteCategory(id);
        toast.success('Category deleted');
        setCategories(categories.filter(c => c._id !== id));
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Category Management</h1>
        <p className="text-xs text-neutral-500 mt-1">Organize fashion product categories and campaign banners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Creation Form */}
        <form onSubmit={handleCreate} className="lg:col-span-4 bg-white border border-neutral-200 p-6 space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-neutral-900">Add New Category</h3>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Banner Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-neutral-900 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Plus className="h-4 w-4" /> Save Category
          </button>
        </form>

        {/* Categories List */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Banner</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-neutral-50">
                  <td className="py-2.5 px-4">
                    <img src={cat.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'} alt="" className="w-10 h-10 object-cover bg-neutral-100" />
                  </td>
                  <td className="py-2.5 px-4 font-bold text-neutral-900">{cat.name}</td>
                  <td className="py-2.5 px-4 font-mono text-neutral-500">{cat.slug}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
