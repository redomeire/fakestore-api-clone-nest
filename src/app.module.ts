import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductModule, CartModule, UserModule, PrismaModule, AuthModule],
  controllers: [ProductController, CartController],
})
export class AppModule {}
