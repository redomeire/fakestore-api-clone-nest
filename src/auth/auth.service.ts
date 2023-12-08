import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignInDto) {
    const {
      city,
      email,
      firstname,
      geolocation_latitude,
      geolocation_longitude,
      lastname,
      address_number,
      password,
      phone,
      street,
      username,
      zipcode,
    } = body;
    const user = await this.prismaService.user.create({
      data: {
        city,
        email,
        firstname,
        geolocation_latitude,
        geolocation_longitude,
        lastname,
        number: address_number,
        password,
        phone,
        street,
        username,
        zipcode,
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

  async signOut() {}
}
