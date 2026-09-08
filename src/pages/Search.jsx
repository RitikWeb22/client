import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(query);

  useEffect(() => {
    setInputVal(query);
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    const fetchSearch = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ q: query, limit: 20 });
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Search Our Catalog</h1>
        
        <form onSubmit={handleSearchSubmit} className="flex border-2 border-neutral-900 p-1 bg-white">
          <input
            type="text"
            placeholder="Search by keyword, garment type, fabric..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-4 py-2.5 text-sm outline-none bg-transparent"
          />
          <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800">
            Search
          </button>
        </form>

        {query && (
          <p className="text-xs text-neutral-500">
            Showing results for <strong className="text-neutral-900 font-semibold">"{query}"</strong> ({products.length} matches)
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 && query ? (
        <div className="py-16 text-center space-y-4 bg-white border border-neutral-200">
          <SearchIcon className="h-12 w-12 text-neutral-300 mx-auto stroke-1" />
          <h3 className="text-lg font-serif font-bold text-neutral-900">No Matching Garments Found</h3>
          <p className="text-xs text-neutral-500">Try searching for keywords like "hoodie", "denim", "poplin", or "linen".</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}
