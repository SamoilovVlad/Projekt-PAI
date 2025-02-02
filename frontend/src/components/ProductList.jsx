import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductList.css';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductList = ({ products }) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('abc');
  const [brandFilter, setBrandFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProducts, setCurrentProducts] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const categories = [...new Set(products.map(product => product.category))];
  const brands = [...new Set(products.map(product => product.brand))];

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleBrandChange = (e) => {
    setBrandFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 180);
  };

  useEffect(() => {
    let filteredProducts = products;

    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }

    if (brandFilter) {
      filteredProducts = filteredProducts.filter(product => product.brand === brandFilter);
    }

    if (debouncedSearchQuery) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
    }

    if (sortBy === 'price') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'abc') {
      filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    setSortedProducts(filteredProducts);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setCurrentProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));
  }, [categoryFilter, brandFilter, sortBy, products, debouncedSearchQuery]);

  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setCurrentProducts(sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct));
  }, [currentPage, productsPerPage, sortedProducts]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const filteredBrands = categoryFilter
    ? [...new Set(products.filter(product => product.category === categoryFilter).map(product => product.brand))]
    : brands;

  const filteredCategories = brandFilter
    ? [...new Set(products.filter(product => product.brand === brandFilter).map(product => product.category))]
    : categories;

  return (
    <div className="product-list-container">
      <div className="filters d-flex flex-wrap">
        <Form.Group className="d-flex align-items-center cursor-pointer">
          <Form.Label className="mr-2 mb-0">Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-auto cursor-pointer"
          />
        </Form.Group>

        <Form.Group className="d-flex align-items-center cursor-pointer">
          <Form.Label className="mr-2 mb-0">Category</Form.Label>
          <Form.Control as="select" value={categoryFilter} onChange={handleCategoryChange} className="w-auto cursor-pointer">
            <option value="">All Categories</option>
            {filteredCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="d-flex align-items-center cursor-pointer">
          <Form.Label className="mr-2 mb-0">Brand</Form.Label>
          <Form.Control as="select" value={brandFilter} onChange={handleBrandChange} className="w-auto cursor-pointer">
            <option value="">All Brands</option>
            {filteredBrands.map((brand, index) => (
              <option key={index} value={brand}>{brand}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="d-flex align-items-center cursor-pointer">
          <Form.Label className="mr-2 mb-0">Sort By</Form.Label>
          <Form.Control as="select" value={sortBy} onChange={handleSortChange} className="w-auto cursor-pointer">
            <option value="abc">Alphabetical (A-Z)</option>
            <option value="price">Price</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="d-flex align-items-center cursor-pointer">
          <Form.Label className="mr-2 mb-0">Items Per Page</Form.Label>
          <Form.Control
            as="select"
            value={productsPerPage}
            onChange={handleItemsPerPageChange}
            className="w-auto cursor-pointer"
          >
            <option className='cursor-pointer' value={10}>10</option>
            <option className='cursor-pointer' value={20}>20</option>
            <option className='cursor-pointer' value={50}>50</option>
          </Form.Control>
        </Form.Group>
      </div>

      <div className="product-list">
        {currentProducts.length === 0 ? (
          <div className="no-products-message">No products found</div>
        ) : (
          currentProducts.map((product, index) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      <div className="pagination d-flex justify-content-center gap-2 p-2">
        <Button
          className='custom-pagination-button'
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            style={{
              scale: currentPage === index + 1 ? '1.1' : '1',
            }}
            onClick={() => handlePageChange(index + 1)}
            className='custom-pagination-button'
            active={currentPage === index + 1}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          className='custom-pagination-button'
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
