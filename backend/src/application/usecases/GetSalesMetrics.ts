import { ISalesRepository } from '../../domain/repositories/SalesRepository';
import { SalesMetrics, FilterOptions } from '../../domain/entities/SalesMetrics';

export class GetSalesMetrics {
  constructor(private salesRepository: ISalesRepository) {}

  async execute(filters: FilterOptions): Promise<SalesMetrics> {
    // Validar que el rango de fechas sea válido
    if (filters.dateRange.from > filters.dateRange.to) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
    }

    // Validar que el rango no sea mayor a 1 año
    const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
    const dateRangeInMillis = filters.dateRange.to.getTime() - filters.dateRange.from.getTime();
    if (dateRangeInMillis > oneYearInMillis) {
      throw new Error('El rango de fechas no puede ser mayor a 1 año');
    }

    return await this.salesRepository.getSalesMetrics(filters);
  }
}
