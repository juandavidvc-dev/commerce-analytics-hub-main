import { ISalesRepository } from '../../domain/repositories/SalesRepository';
import { ProductRanking, TopProductsRequest } from '../../domain/entities/SalesMetrics';

export class GetTopProducts {
  constructor(private salesRepository: ISalesRepository) {}

  async execute(request: TopProductsRequest): Promise<ProductRanking[]> {
    // Validar límite máximo
    if (request.limit > 100) {
      throw new Error('El límite máximo de productos es 100');
    }

    if (request.limit < 1) {
      throw new Error('El límite mínimo de productos es 1');
    }

    // Validar que el rango de fechas sea válido
    if (request.dateRange.from > request.dateRange.to) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
    }

    return await this.salesRepository.getTopProducts(request);
  }
}
