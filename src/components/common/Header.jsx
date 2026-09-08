import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Men', path: '/shop?gender=men' },
    { name: 'Women', path: '/shop?gender=women' },
    { name: 'New Arrivals', path: '/shop?isNewArrival=true' },
    { name: 'Sale', path: '/shop?sale=true' },
    { name: 'About', path: '/about' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3.5' : 'bg-[#faf9f6] border-b border-neutral-200/50 py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 uppercase">
              SNITCHFLOW
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors hover:text-neutral-900 ${
                  location.pathname + location.search === link.path ? 'text-neutral-900 border-b border-neutral-900 pb-0.5' : 'text-neutral-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            
            {/* Search Icon / Bar */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search Products"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Inline Quick Search Popup */}
              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-10 w-72 sm:w-80 bg-white border border-neutral-200 shadow-xl p-3 z-50 animate-fade-in"
                >
                  <div className="flex items-center border border-neutral-300 px-3 py-1.5 focus-within:border-black">
                    <input
                      type="text"
                      placeholder="Search apparel, linen, jackets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs text-neutral-900 outline-none bg-transparent"
                      autoFocus
                    />
                    <button type="submit" className="text-neutral-500 hover:text-black">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 text-neutral-700 hover:text-black transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-neutral-700 hover:text-black transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-7 w-7 rounded-full object-cover border border-neutral-300"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-semibold text-neutral-900">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="h-4 w-4" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 sm:hidden"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-neutral-100 mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 border border-neutral-900 px-3 py-1.5 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <span className="font-serif text-2xl font-bold tracking-widest text-neutral-900">SNITCHFLOW</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-neutral-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold uppercase tracking-widest text-neutral-800 hover:text-black"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-500">Signed in as <span className="font-semibold text-black">{user.email}</span></div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
