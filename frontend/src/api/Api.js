const API_URL = 'http://localhost:3000';

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function fetchProducts() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function addProduct(product) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add product');
  }

  return response.json();
}

export async function fetchProductById(id) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/product/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch product details');
  }

  return response.json();
}

export async function addToCart(product, userId) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, product }),
  });

  if (!response.ok) {
    throw new Error('Failed to add product to cart');
  }

  return response.json();
}


export async function getCart(userId) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/cart?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }

  return response.json();
}


export async function getProductFromCart(productId, userId) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/cart/${productId}?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to check product in cart');
  }

  const data = await response.json();
  return data.product;
}

export async function deleteFromCart(userId, productId) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      productId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete product from cart');
  }

  return response.json();
}


export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();

  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.user.role);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}
