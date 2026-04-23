'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { SalesMetrics, ProductRanking, RevenueTrend, FilterOptions } from '@/types/api';
import { apiClient } from '@/utils/api';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  XCircle, 
  CheckCircle 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export function Dashboard() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<ProductRanking[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metricsData, topProductsData, revenueTrendData] = await Promise.all([
        apiClient.getSalesMetrics(filters),
        apiClient.getTopProducts(filters.dateRange, 'gmv', 10),
        apiClient.getRevenueTrend(filters.dateRange, 'day')
      ]);
      
      setMetrics(metricsData);
      setTopProducts(topProductsData);
      setRevenueTrend(revenueTrendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Commerce Analytics Dashboard</h1>
        
        {/* Date Range Filter */}
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.dateRange.from}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, from: e.target.value }
            }))}
            className="px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={filters.dateRange.to}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, to: e.target.value }
            }))}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="GMV"
          value={metrics.gmv}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          icon={TrendingUp}
          format="currency"
        />
        <MetricCard
          title="Orders"
          value={metrics.orders}
          icon={ShoppingCart}
          format="number"
        />
        <MetricCard
          title="AOV"
          value={metrics.aov}
          icon={Package}
          format="currency"
        />
        <MetricCard
          title="Cancel Rate"
          value={metrics.cancellationRate}
          icon={XCircle}
          format="percentage"
        />
        <MetricCard
          title="On-Time Delivery"
          value={metrics.onTimeDeliveryRate}
          icon={CheckCircle}
          format="percentage"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
              />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Top Products by GMV</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Rank</th>
                <th className="pb-2">Product ID</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">GMV</th>
                <th className="pb-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.productId} className="border-b">
                  <td className="py-2">{product.rank}</td>
                  <td className="py-2">{product.productId}</td>
                  <td className="py-2">{product.productCategory}</td>
                  <td className="py-2">
                    ${product.gmv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2">
                    ${product.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
