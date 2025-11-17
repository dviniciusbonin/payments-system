import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user';
import { AuthenticateUserUseCase } from '../../../application/use-cases/auth/authenticate-user';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { RegisterResponseDto } from '../../dtos/auth/register-response.dto';
import { LoginResponseDto } from '../../dtos/auth/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUserUseCase.execute(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authenticateUserUseCase.execute(loginDto);
  }
}
