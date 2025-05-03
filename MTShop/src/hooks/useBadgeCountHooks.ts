import axios from 'axios';
import {useCart} from '../context/CartContext'; // Import useCart

export const useBadgeCount = (type: 'cart' | 'notification') => {
  const {cartCount, updateCart} = useCart(); // Get cartCount from context

  const fetchCount = async () => {
    try {
      const token = await getItem('accessToken');
      if (!token) return;

      let url = '';
      if (type === 'cart') {
        url = '/cart';
      } else if (type === 'notification') {
        url = '/notification/unread-count';
      }

      const res = await axios.get(url, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (type === 'cart') {
        updateCart(res.data.data.length);
      }
    } catch (err) {
      console.log('Lỗi lấy count:', err);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [type]);

  return cartCount;
};
