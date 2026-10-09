import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import Logo from "./Logo";
const Navbar = () => {
   const {user,logout} = useAuth()
  const { cartCount, setIsCartOpen } = useCart()
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.SubmitEvent)=>{
    e.preventDefault()
    if(searchQuery.trim()){
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery("")
    }
  }

  const handleLogout = () =>{
    logout()
    setUserMenuOpen(false)
    navigate("/");
  }

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Logo size={30} />

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-7 text-sm text-zinc-600">
            <Link to="/" className="nav-link hover:text-app-green">
              Home
            </Link>
            <Link to="/products" className="nav-link hover:text-app-green">
              Products
            </Link>
            <Link to="/deals" className="nav-link text-app-orange hover:text-app-orange-dark">
              Deals
            </Link>
          </div>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-orange-50 rounded-full ring-1 ring-app-orange/15 focus:ring-2 focus:ring-app-orange/40 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              className="relative p-2 rounded-xl hover:bg-app-cream transition-colors"
              aria-label="Open cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full flex-center">
                  {cartCount}
                </span>
              )}
            </button>
            {/* User */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2"
                >
                  <div className="size-7 rounded-full bg-green-950 text-white flex-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDownIcon className="size-3 text-zinc-500" />
                </button>
              ) : (
                <div className="flex-center gap-2">
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-green-950-light transition-colors"
                  >
                    <UserIcon size={16} /> Sign in
                  </Link>
                  {userMenuOpen ? (
                    <XIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  ) : (
                    <MenuIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  )}
                </div>
              )}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border border-app-border py-2 z-50 animate-fade-in">
                    {user && (
                      <div className="px-4 py-2 border-b border-app-border">
                        <p className="text-sm font-medium text-zinc-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-zinc-500">{user?.email}</p>
                      </div>
                    )}
                    <div onClick={() => setUserMenuOpen(false)}>
                      {!user && (
                        <Link to="/login" className="dropdown-link">
                          <UserIcon size={16} /> Sign in{" "}
                        </Link>
                      )}

                      {user && (
                        <Link to="/orders" className="dropdown-link">
                          <PackageIcon size={16} /> My Orders{" "}
                        </Link>
                      )}

                      {user && (
                        <Link to="/addresses" className="dropdown-link">
                          <MapPinIcon size={16} /> Addresses{" "}
                        </Link>
                      )}

                      <Link to="/products" className="dropdown-link md:hidden">
                        <ArrowUpRightIcon size={16} /> Products{" "}
                      </Link>

                      <Link to="/deals" className="dropdown-link md:hidden">
                        <ArrowUpRightIcon size={16} /> Deals{" "}
                      </Link>

                      {user?.isAdmin && (
                        <Link to="/admin/products" className="dropdown-link">
                          <ShieldIcon
                            className="text-app-orange-dark"
                            size={16}
                          />
                          <span className="text-app-orange-dark">
                            Admin Panel
                          </span>
                        </Link>
                      )}

                      {user && (
                        <div className="border-t border-app-border pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-app-error hover:bg-red-50 w-full transition-colors">
                            <LogOutIcon size={16} /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Mobile (below sm) */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search for groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-orange-50 rounded-full ring-1 ring-app-orange/15 focus:ring-2 focus:ring-app-orange/40 focus:bg-white transition-all"
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
