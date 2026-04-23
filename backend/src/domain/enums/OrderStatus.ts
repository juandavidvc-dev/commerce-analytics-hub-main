/**
 * Estados posibles de una orden
 */
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  UNAVAILABLE = 'unavailable',
  INVOICED = 'invoiced'
}

/**
 * Estados de entrega válidos
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled'
}

/**
 * Métodos de pago válidos
 */
export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
  VOUCHER = 'voucher',
  DEPOSIT = 'deposit'
}

/**
 * Granularidad de tiempo para tendencias
 */
export enum TimeGrain {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

/**
 * Métricas disponibles para rankings
 */
export enum RankingMetric {
  GMV = 'gmv',
  REVENUE = 'revenue'
}

/**
 * Regiones de Brasil para agrupación geográfica
 */
export enum BrazilianRegion {
  SUDESTE = 'Sudeste',
  SUL = 'Sul',
  CENTRO_OESTE = 'Centro-Oeste',
  NORDESTE = 'Nordeste',
  NORTE = 'Norte',
  DESCONOCIDO = 'Desconocido'
}

/**
 * Estados brasileños por región
 */
export const STATES_BY_REGION: Record<BrazilianRegion, string[]> = {
  [BrazilianRegion.SUDESTE]: ['SP', 'RJ', 'MG', 'ES'],
  [BrazilianRegion.SUL]: ['RS', 'SC', 'PR'],
  [BrazilianRegion.CENTRO_OESTE]: ['DF', 'GO', 'MT', 'MS'],
  [BrazilianRegion.NORDESTE]: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
  [BrazilianRegion.NORTE]: ['AC', 'RO', 'AM', 'RR', 'PA', 'AP', 'TO'],
  [BrazilianRegion.DESCONOCIDO]: []
};

/**
 * Categorías de productos agrupadas
 */
export enum ProductCategoryGroup {
  ELETRONICOS = 'Eletrônicos',
  CASA = 'Casa',
  BELEZA = 'Beleza',
  LAZER = 'Lazer',
  CONSTRUCAO = 'Construção',
  OUTROS = 'Outros'
}

/**
 * Mapeo de categorías específicas a grupos
 */
export const CATEGORY_TO_GROUP: Record<string, ProductCategoryGroup> = {
  'eletronicos': ProductCategoryGroup.ELETRONICOS,
  'informatica_acessorios': ProductCategoryGroup.ELETRONICOS,
  'telefonia': ProductCategoryGroup.ELETRONICOS,
  'moveis_decoracao': ProductCategoryGroup.CASA,
  'cama_mesa_banho': ProductCategoryGroup.CASA,
  'utilidades_domesticas': ProductCategoryGroup.CASA,
  'beleza_saude': ProductCategoryGroup.BELEZA,
  'perfumaria': ProductCategoryGroup.BELEZA,
  'esporte_lazer': ProductCategoryGroup.LAZER,
  'brinquedos': ProductCategoryGroup.LAZER,
  'ferramentas_jardim': ProductCategoryGroup.CONSTRUCAO,
  'construcao_ferramentas': ProductCategoryGroup.CONSTRUCAO
};
