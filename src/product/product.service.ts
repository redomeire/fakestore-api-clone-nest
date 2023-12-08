import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct() {
    return await this.prismaService.product.create({
      data: {
        description: '',
        image: '',
        price: 0,
        title: '',
        categoryId: 1,
      },
    });
  }
}
