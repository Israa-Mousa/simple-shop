import z, { ZodType } from 'zod';
import type { CreateOrderDTO, CreateOrderReturnDTO } from '../types/oder.dto';
import { paginationSchema } from 'src/utils/api.utils';
import { ProductQuery } from 'src/modules/product/types/product.types';

export const createOrderDTOValidationSchema = z.array(
  z.object({
    productId: z.coerce.number().min(1),
    qty: z.coerce.number().min(1),
  }),
) satisfies ZodType<CreateOrderDTO>;

export const productSchema = paginationSchema.extend({
  name: z.string().min(2).max(255).optional(),
}) satisfies ZodType<ProductQuery>;


export const createReturnDTOValidationSchema = z.object({
  orderId: z.coerce.number().min(1),
  items: z.array(
    z.object({
      productId: z.coerce.number().min(1),
      qty: z.coerce.number().min(1),
    }),
  ),
}) satisfies ZodType<CreateOrderReturnDTO>;
