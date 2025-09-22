/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
// import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // * Registro del usuario
    async register(registerAuthDto: RegisterAuthDto) {
        const { email, password, name } = registerAuthDto;

        // Verificar si ya existe el usuario
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException("El correo electronico ya esta registrado.");
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            }
        });

        // Crear token JWT (con role incluido)
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        // Retornar sin exponer contraseña
        const { password: _, ...result } = user;
        return {
            user: result,
            access_token,
        };
    }

    // * Login del usuario
    async login(loginAuthDto: LoginAuthDto) {
        const { email, password } = loginAuthDto;

        // Buscar usuario
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException("El correo no se encuentra registrado, por favor crea una cuenta.")
        }

        if (!user.isActive) {
            throw new UnauthorizedException("La cuenta está desactivada. Por favor contactar con el soporte de la aplicación.")
        }
        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales invalidas.');
        }

        // Generar token JWT (con role incluido)
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        // Retornar sin exponer contraseña
        const { password: _, ...result } = user;
        return {
            user: result,
            access_token,
        };
    }

    // * Método para validar token
    async validateUser(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, isActive: true },
        });

        // Verificar si la cuenta esta desactivada
        if (!user?.isActive) {
            throw new UnauthorizedException('La cuenta está desactivada.')
        }

        return user;
    }
}
