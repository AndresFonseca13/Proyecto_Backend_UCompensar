export interface PublicationDetails {
  id: string;
  createAt: Date;
  name: string;
  description: string;
  img: string;
  price: number;
  brandId: string;
  userId: string;

  author: {
    id: string;
    name: string;
    photo: string;
  };

  brand: {
    id: string;
    name: string;
  };

  likesCount: number;
  commentsCount: number;
}
