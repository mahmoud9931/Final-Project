import { Product } from './product';
import { User } from './user';

export interface OrderProduct {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | User;
  products: OrderProduct[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'shipped' | 'delivered';
}
