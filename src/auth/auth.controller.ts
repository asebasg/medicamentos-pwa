import { Controller, Body, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // * Endpoint para registrar un nuevo usuario
    @Post('register')
    async register(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.register(registerAuthDto);
    }

    // * Endpoint para login de usuario
    @Post('login')
    async login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }

    // * Endpoint para obtener el perfil del usuario autenticado
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: AuthenticatedRequest) {
        return req.user;
    }
}
