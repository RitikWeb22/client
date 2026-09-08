import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, RotateCcw, X } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

export default function Shop() {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Extract filter parameters from URL
  const currentCategory = routeCategory || searchParams.get('category') || 'all';
  const currentGender = searchParams.get('gender') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';
  const currentInStock = searchParams.get('inStock') || 'false';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: currentCategory,
          gender: currentGender,
          sort: currentSort,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          size: currentSize,
          inStock: currentInStock,
          page: currentPage,
          limit: 12
        };

        const res = await productService.getProducts(params);
        setProducts(res.data?.products || []);
        setTotalProducts(res.data?.totalProducts || 0);
        setPages(res.data?.pages || 1);
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentGender, currentSort, currentMinPrice, currentMaxPrice, currentSize, currentInStock, currentPage]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset page on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="border-b border-neutral-200 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Catalog</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 capitalize mt-1">
            {currentCategory !== 'all' ? currentCategory.replace('-', ' ') : 'All Apparel & Goods'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Showing <strong className="text-neutral-900">{totalProducts}</strong> contemporary garments
          </p>
        </div>

        {/* Top Controls: Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="lg:hidden px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold px-3 py-2 outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Drops</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          
          {/* Active Filter Clear CTA */}
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter By
            </span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-neutral-500 hover:text-black flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Gender Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Gender</h3>
            <div className="space-y-1.5 text-xs text-neutral-700">
              {['all', 'men', 'women', 'unisex'].map((g) => (
                <label key={g} className="flex items-center gap-2 capitalize cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="gender"
                    checked={currentGender === g}
                    onChange={() => updateFilter('gender', g)}
                    className="accent-black"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Categories</h3>
            <div className="space-y-1.5 text-xs text-neutral-700">
              <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === 'all'}
                  onChange={() => updateFilter('category', 'all')}
                  className="accent-black"
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-2 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="category"
                    checked={currentCategory.toLowerCase() === cat.slug.toLowerCase()}
                    onChange={() => updateFilter('category', cat.slug)}
                    className="accent-black"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => updateFilter('size', currentSize === s ? '' : s)}
                  className={`py-1.5 text-xs font-semibold border transition-colors ${
                    currentSize === s ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Price Range (₹)</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={currentMinPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-neutral-300 text-xs outline-none focus:border-black"
              />
              <span className="text-xs text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={currentMaxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-neutral-300 text-xs outline-none focus:border-black"
              />
            </div>
          </div>

        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white border border-neutral-200">
              <p className="text-sm text-neutral-600">No products match your selected filters.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {[...Array(pages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter('page', pageNum.toString())}
                    className={`h-9 w-9 text-xs font-bold border transition-colors ${
                      currentPage === pageNum
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
