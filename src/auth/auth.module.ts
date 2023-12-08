import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/constants';
import { AuthGuard } from './guard/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule,
  ],
  providers: [AuthService, { provide: 'APP_GUARD', useClass: AuthGuard }],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
