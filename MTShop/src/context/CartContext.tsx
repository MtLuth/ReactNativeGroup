import React, {createContext, useState, useContext, useEffect} from 'react';
import {useBadgeCount} from '../hooks/useBadgeCountHooks'; // Assuming it's a custom hook
import axios from 'axios';
import {getItem} from '../utils/storage'; // Assuming this is used to get the auth token

const CartContext = createContext<any>(null);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [cartCount, setCartCount] = useState<number>(0); // Initialize with 0 or a default value
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = await getItem('accessToken');
        if (!token) return;

        const res = await axios.get('/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartCount(res.data.data.length); // Assuming the cart data is an array
      } catch (err) {
        console.log('Error fetching cart count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartCount();
  }, []);

  // Function to update cart count
  const updateCart = (count: number) => {
    setCartCount(count);
  };

  // Provide the context to child components
  return (
    <CartContext.Provider value={{cartCount, updateCart, loading}}>
      {children}
    </CartContext.Provider>
  );
};
