import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserUseCase } from '../../../application/use-cases/users/get-user';
import { ListUsersUseCase } from '../../../application/use-cases/users/list-users';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ListUsersQueryDto } from '../../dtos/users/list-users-query.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../../domain/types/user-role';
import { ITokenPayload } from '../../../application/interfaces/services/token-generator.interface';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMe(@Request() req: { user: ITokenPayload }) {
    return this.getUserUseCase.execute(req.user.sub);
  }

  @Get()
  @Roles(UserRole.PLATFORM)
  @ApiOperation({ summary: 'List all users (Platform only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid role filter' })
  async list(@Query() query: ListUsersQueryDto) {
    return this.listUsersUseCase.execute(query.role);
  }

  @Get(':id')
  @Roles(UserRole.PLATFORM)
  @ApiOperation({ summary: 'Get user by ID (Platform only)' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }
}
