import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDTO, UpdateProductDTO } from './types/product.dto';
import { ProductQuery } from './types/product.types';
import { Prisma, Product } from 'generated/prisma';
import type { ProductResponseDTO } from './types/product.dto';
import { FileService } from '../file/file.service';
import { SideEffectQueue } from 'src/utils/side-effects';

@Injectable()
export class ProductService {
  constructor(private prismaService: DatabaseService
    , private fileService: FileService
  ) {}



  // extend multer file to include ImageKit fields returned by custom storage
  create(
    createProductDto: CreateProductDTO,
    user: Express.Request['user'],
        file: Express.Multer.File & 
        { fileId?: string; url?: string },

  ): Promise<ProductResponseDTO> {
    const dataPayload: Prisma.ProductUncheckedCreateInput = {
      merchantId: Number(user!.id),
      ...createProductDto,
    };

  if (file) {
    dataPayload.Asset = {
      create: {
        storageProviderName: 'IMAGE_KIT',
        fileId: file.fileId!,
        fileSizeInKB: Math.floor(file.size / 1024),
        url: file.url!,
        ownerId: Number(user!.id),
        fileType: file.mimetype,
      },
    };
  }

  return this.prismaService.product.create({
    data: dataPayload,
    include: { Asset: true },
  });
  }
   findAll(query: Required<Omit<ProductQuery, 'name'>> & { name?: string }) {
    return this.prismaService.$transaction(async (prisma) => {
      const whereClause: Prisma.ProductWhereInput = query.name
        ? { name: { contains: query.name } }
        : {};
      const proucts = await prisma.product.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where: whereClause,
      });
      const count = await prisma.product.count({
        where: whereClause,
      });
      return {
        data: proucts,
        meta: {
          total: count,
          page: query.page,
          limit: query.limit,
          totalPages: Math.ceil(count / query.limit),
        },
      };
    });
  }
 findOne(id: number) {
    return this.prismaService.product.findUnique({
      where: { id },
    });
  }
    // update fileId in db if exist in payload
    // remove old asset record // soft delete
    // remove file from imagekit
    async update(
    id: number,
    updateProductDto: UpdateProductDTO,
    user: Express.Request['user'],
    file?: Express.Multer.File,
  ) {
    // get instance side effects queue
    const sideEffects = new SideEffectQueue();

    // run prisma transaction { invoke fileservice.deleteFile (prismaTX,productId,user,sideEffect) , prisma update product  }
    const updatedProduct = await this.prismaService.$transaction(
      async (prismaTX) => {
        if (file) {
          await this.fileService.deleteProductAsset(
            prismaTX,
            id,
            Number(user!.id),
            sideEffects,
          );
        }

        const dataPayload: Prisma.ProductUncheckedUpdateInput = {
          ...updateProductDto,
        };
        if (file) {
          dataPayload.Asset = {
            create: this.fileService.createFileAssetData(
              file,
              Number(user!.id),
            ),
          };
        }
        // order is important here
        return await prismaTX.product.update({
          where: { id, merchantId: Number(user!.id) },
          data: dataPayload,
          include: { Asset: true },
        });
      },
    );

    await sideEffects.runAll();
    return updatedProduct;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
