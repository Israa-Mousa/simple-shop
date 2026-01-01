import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: T, metadata: ArgumentMetadata) {
    try {
      console.log(metadata, 'metadata');

      const parsedValue = this.schema.parse(value);
      console.log(parsedValue, 'parsedValue');
      return parsedValue;
    } catch (error) {
      // Log the error for easier debugging in server logs
      // eslint-disable-next-line no-console
      console.error('Zod validation error:', error);

      // Surface validation errors when possible to aid debugging
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zodError = (error as any) || undefined;
        // If zodError?.errors is available, include it; otherwise send generic message
        if (zodError && zodError.errors) {
          throw new BadRequestException({ message: 'Validation failed', details: zodError.errors });
        }
      } catch (e) {
        // If something goes wrong building the detailed response, log and fall back
        // eslint-disable-next-line no-console
        console.error('Failed to build Zod error response', e);
      }

      throw new BadRequestException('Validation failed');
    }
  }
}