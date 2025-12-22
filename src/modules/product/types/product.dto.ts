import { Prisma, Product } from 'generated/prisma';

export type CreateProductDTO = Pick<Product, 'name' | 'description'|'price'> & {
  price: number;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;
