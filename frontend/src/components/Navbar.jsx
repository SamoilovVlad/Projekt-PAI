import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { AuthContext } from '../context/AuthProvider';
import { House, LogOut, ShoppingBasket, LogIn, PackagePlus, CirclePlus, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.assign("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">MyShop</Link>
        <ul className="nav-links">
          <li><Link to="/"><House/></Link></li>
          {user?.role === "admin" && <li><Link to="/newProduct"><Plus /></Link></li>}
          {user && <li><Link to="/checkout"><PackagePlus /></Link></li>}
          <li><Link to="/cart"><ShoppingBasket /></Link></li>
          {user ? null : (
            <li><Link to="/login"><LogIn /></Link></li>
          )}
        </ul>
      </div>
      {user ? <li><Link onClick={handleLogout} className="logout-btn"><LogOut /></Link></li> : null}
    </nav>
  );
};

export default Navbar;
