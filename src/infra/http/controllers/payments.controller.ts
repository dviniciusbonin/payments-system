import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProcessPaymentUseCase } from '../../../application/use-cases/payments/process-payment';
import { CreatePaymentDto } from '../../dtos/payments/create-payment.dto';
import { PaymentResponseDto } from '../../dtos/payments/payment-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ITokenPayload } from '../../../application/interfaces/services/token-generator.interface';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Process a payment transaction',
    description:
      'Processes a payment. The buyer ID is automatically taken from the authenticated user token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input or missing required participants (affiliate/coproducer) when commission is configured',
  })
  @ApiResponse({
    status: 404,
    description: 'Product, buyer, fee or commission not found',
  })
  async processPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: { user: ITokenPayload },
  ) {
    return this.processPaymentUseCase.execute({
      ...createPaymentDto,
      buyerId: req.user.sub,
    });
  }
}
