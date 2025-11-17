import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetBalanceUseCase } from '../../../application/use-cases/balances/get-balance';
import { BalanceResponseDto } from '../../dtos/balances/balance-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ITokenPayload } from '../../../application/interfaces/services/token-generator.interface';

@ApiTags('balances')
@Controller('balances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BalancesController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user balance' })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
    type: BalanceResponseDto,
  })
  async getMyBalance(@Request() req: { user: ITokenPayload }) {
    const balance = await this.getBalanceUseCase.execute(req.user.sub);
    return balance;
  }
}
