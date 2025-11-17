import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFeeUseCase } from '../../../application/use-cases/fees/create-fee';
import { GetFeeByCountryUseCase } from '../../../application/use-cases/fees/get-fee-by-country';
import { CreateFeeDto } from '../../dtos/fees/create-fee.dto';
import { FeeResponseDto } from '../../dtos/fees/fee-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../../domain/types/user-role';

@ApiTags('fees')
@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class FeesController {
  constructor(
    private readonly createFeeUseCase: CreateFeeUseCase,
    private readonly getFeeByCountryUseCase: GetFeeByCountryUseCase,
  ) {}

  @Post()
  @Roles(UserRole.PLATFORM)
  @ApiOperation({ summary: 'Create a new fee configuration' })
  @ApiResponse({
    status: 201,
    description: 'Fee created successfully',
    type: FeeResponseDto,
  })
  async create(@Body() createFeeDto: CreateFeeDto) {
    return this.createFeeUseCase.execute(createFeeDto);
  }

  @Get('country/:countryCode')
  @ApiOperation({ summary: 'Get fee by country code' })
  @ApiResponse({
    status: 200,
    description: 'Fee found',
    type: FeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fee not found' })
  async getByCountry(@Param('countryCode') countryCode: string) {
    return this.getFeeByCountryUseCase.execute(countryCode);
  }
}
