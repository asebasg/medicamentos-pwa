import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma';

// Interface para el payload del JWT
interface JwtPayload {
    sub: number;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

// Interface para el usuario validado
interface ValidatedUser {
    userId: number;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno.');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload): Promise<ValidatedUser> {
        // Validar que el payload tenga la estructura esperada
        if (!payload.sub || !payload.email || !payload.role) {
            throw new UnauthorizedException('Token JWT inválido');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            }
        });

        // Verificar que el usuario existe
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.');
        }

        // Verificar que el usuario está activo
        if (!user.isActive) {
            throw new UnauthorizedException('Usuario desactivado.');
        }

        // Verificar que el email del token coincide (seguridad adicional)
        if (user.email !== payload.email) {
            throw new UnauthorizedException('Token JWT inválido.');
        }

        return {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
        };
    }
}
