import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationQueryType } from 'src/types/util.types';
import type { ProductQuery } from './types/product.types';
import type { CreateProductDTO, UpdateProductDTO } from './types/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createProductDto: CreateProductDTO,
     @UploadedFile()
    
    file: Express.Multer.File,
  ) {
    console.log(file);
    return 'file saved';
  }


  
 @Get()
  findAll(@Query() query: ProductQuery) {
    return this.productService.findAll({
      limit: Number(query.limit),
      page: Number(query.page),
      name: query.name,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDTO) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}