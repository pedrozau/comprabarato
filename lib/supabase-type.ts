export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    created_at: string;
    store_id: string;
    user_id: string;
  }

  export interface Store {
    id: string;
    name: string;
    email: string;
    province: string;
    store_type: string;
    phone: string;
    description: string;
    latitude: number;
    longitude: number;
    created_at: string;
    user_id: string;
  }
  