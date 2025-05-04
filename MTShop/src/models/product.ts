export interface Product {
  _id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  salePrice?: number;
}
