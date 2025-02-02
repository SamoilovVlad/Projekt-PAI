import {useState, useEffect} from 'react';
import Carousel from '../components/Carousel';
import ProductList from '../components/ProductList';
import { fetchProducts } from '../api/Api'

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Carousel />
      <ProductList products={products} />
    </div>
  );
};

export default Home;
