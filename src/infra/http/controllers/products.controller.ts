import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetProductUseCase } from '../../../application/use-cases/products/get-product';
import { ListProductsUseCase } from '../../../application/use-cases/products/list-products';
import { CreateProductUseCase } from '../../../application/use-cases/products/create-product';
import { ProductResponseDto } from '../../dtos/products/product-response.dto';
import { CreateProductDto } from '../../dtos/products/create-product.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../../domain/types/user-role';
import { ITokenPayload } from '../../../application/interfaces/services/token-generator.interface';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(
    private readonly getProductUseCase: GetProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @Roles(UserRole.PRODUCER)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: { user: ITokenPayload },
  ) {
    return this.createProductUseCase.execute({
      ...createProductDto,
      producerId: req.user.sub,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  async list(@Request() req: { user: ITokenPayload }) {
    const producerId =
      req.user.role === UserRole.PRODUCER ? req.user.sub : undefined;
    return this.listProductsUseCase.execute(producerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getById(@Param('id') id: string) {
    return this.getProductUseCase.execute(id);
  }
}
