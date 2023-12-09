import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto) {
    const hashedPassword = await argon.hash(body.password);

    const user = await this.prismaService.user.create({
      data: {
        ...body,
        number: body.number,
        password: hashedPassword,
      },
    });

    return user;
  }

  async signIn(email: string, pass: string) {
    const isValid = await this.verify(email, pass);

    if (!isValid) throw new BadRequestException();

    return {
      access_token: await this.jwtService.signAsync({
        secret: process.env.AUTH_SECRET,
        expiresIn: 60 * 15,
      }),
    };
  }

  async verify(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    const isUserExist = await argon.verify(user.password, password);

    return isUserExist;
  }

  async signOut(token: string) {
    if (!token) throw new UnauthorizedException();

    return 'logout successful';
  }
}
