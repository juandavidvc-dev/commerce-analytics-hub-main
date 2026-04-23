import { ISalesRepository } from '../../domain/repositories/SalesRepository';
import { RevenueTrend, RevenueTrendRequest } from '../../domain/entities/SalesMetrics';

export class GetRevenueTrend {
  constructor(private salesRepository: ISalesRepository) {}

  async execute(request: RevenueTrendRequest): Promise<RevenueTrend[]> {
    // Validar que el rango de fechas sea válido
    if (request.dateRange.from > request.dateRange.to) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
    }

    // Validar que el rango no sea mayor a 1 año (mismo límite que métricas principales)
    const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
    const dateRangeInMillis = request.dateRange.to.getTime() - request.dateRange.from.getTime();
    if (dateRangeInMillis > oneYearInMillis) {
      throw new Error('El rango de fechas para tendencias no puede ser mayor a 1 año');
    }

    return await this.salesRepository.getRevenueTrend(request);
  }
}
