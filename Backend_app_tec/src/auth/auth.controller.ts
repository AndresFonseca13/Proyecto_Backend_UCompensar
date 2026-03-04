import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.AuthUser(
      createAuthDto.email,
      createAuthDto.password,
    );
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile() {
    return true;
  }
}
