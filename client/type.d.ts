type User = {
  id?: any;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  name?: string | null;
  age?: string | null;
  address?: string | null;
  accessToken?: any;
};
type listing = {
  address: string;
  bathrooms: string | number;
  bedrooms: string | number;
  description: string;
  discountPrice: number;
  furnished: true;
  image: string[];
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  type: string;
  userRef: string;
  _id: string;
};
