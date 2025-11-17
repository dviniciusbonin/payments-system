import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommissionUseCase } from '../../../application/use-cases/commissions/create-commission';
import { GetCommissionsUseCase } from '../../../application/use-cases/commissions/get-commissions';
import { CreateCommissionDto } from '../../dtos/commissions/create-commission.dto';
import { CommissionResponseDto } from '../../dtos/commissions/commission-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../../domain/types/user-role';

@ApiTags('commissions')
@Controller('commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CommissionsController {
  constructor(
    private readonly createCommissionUseCase: CreateCommissionUseCase,
    private readonly getCommissionsUseCase: GetCommissionsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.PLATFORM)
  @ApiOperation({ summary: 'Create a new commission configuration' })
  @ApiResponse({
    status: 201,
    description: 'Commission created successfully',
    type: CommissionResponseDto,
  })
  async create(@Body() createCommissionDto: CreateCommissionDto) {
    return this.createCommissionUseCase.execute(createCommissionDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get commissions by product ID' })
  @ApiResponse({
    status: 200,
    description: 'Commissions found',
    type: [CommissionResponseDto],
  })
  async getByProduct(@Param('productId') productId: string) {
    return this.getCommissionsUseCase.execute(productId);
  }
}
