import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: 'AURA Studio',
    category: 'T-Shirts',
    gender: 'unisex',
    collectionName: 'Minimal Essentials',
    price: 1999,
    compareAtPrice: 2499,
    stock: 25,
    sku: '',
    material: '100% Organic Cotton',
    careInstructions: 'Machine wash cold inside out.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000'],
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      productService.getProductById(id)
        .then((res) => {
          if (res.data) setFormData(res.data);
        })
        .catch((err) => toast.error('Failed to load product for editing'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageUrlInput.trim()] });
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await productService.updateProduct(id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 mb-2 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Products List
          </button>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            {isEdit ? 'Edit Garment Product' : 'Create New Garment Product'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 space-y-6 text-xs">
        
        {/* Name & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Brand Name</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Category & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            >
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Jackets">Jackets</option>
              <option value="Jeans">Jeans</option>
              <option value="Trousers">Trousers</option>
              <option value="Dresses">Dresses</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Collection</label>
            <input
              type="text"
              name="collectionName"
              value={formData.collectionName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Compare-At Price (₹)</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Inventory Stock *</label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block font-bold uppercase text-neutral-700 mb-1">Description *</label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        {/* Image URLs */}
        <div>
          <label className="block font-bold uppercase text-neutral-700 mb-1">Product Images</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Paste image URL (Unsplash, Cloudinary, etc.)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-neutral-900 text-white font-bold uppercase"
            >
              Add URL
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {formData.images.map((img, i) => (
              <div key={i} className="relative w-20 h-24 border border-neutral-200 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-80 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="flex gap-6 border-t border-neutral-200 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="accent-black"
            />
            <span className="font-semibold">Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleChange}
              className="accent-black"
            />
            <span className="font-semibold">New Arrival</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
              className="accent-black"
            />
            <span className="font-semibold">Bestseller</span>
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-neutral-900 text-white font-bold uppercase tracking-widest hover:bg-neutral-800 flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>{isEdit ? 'Save Product Changes' : 'Create Product Listing'}</span>
        </button>

      </form>
    </div>
  );
}
