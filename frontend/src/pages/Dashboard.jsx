import { useQuery } from '@tanstack/react-query';
import { Package, Users, DollarSign, TrendingUp, Hotel, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import StatCard from '../components/ui/StatCard';
import { base44 } from '../api/apiClient';

const Dashboard = () => {
  const { t } = useLanguage();

  // Fetch dashboard stats
  const { data: tires, isLoading: tiresLoading } = useQuery({
    queryKey: ['tires'],
    queryFn: () => base44.entities.Tire.list(),
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('', 10),
  });

  const { data: tireSets, isLoading: tireSetsLoading } = useQuery({
    queryKey: ['tireSets'],
    queryFn: () => base44.entities.TireSet.list(),
  });

  // Calculate stats
  const stats = {
    totalTires: tires?.length || 0,
    tiresInStock: tires?.filter(t => t.status === 'available')?.length || 0,
    totalCustomers: customers?.length || 0,
    totalSets: tireSets?.length || 0,
    recentOrders: orders?.slice(0, 5) || [],
  };

  const isLoading = tiresLoading || customersLoading || ordersLoading || tireSetsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="text-gray-500 mt-1">
          {t('language') === 'sv' ? 'Översikt av ditt lager' : 'Overview of your inventory'}
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('tires')}
            value={stats.totalTires}
            icon={Package}
            trend="+12%"
            trendUp={true}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatCard
            title={t('tiresInStock')}
            value={stats.tiresInStock}
            icon={TrendingUp}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title={t('customers')}
            value={stats.totalCustomers}
            icon={Users}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatCard
            title={t('totalSets')}
            value={stats.totalSets}
            icon={Hotel}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              {t('recentSales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {order.customer_name || `${t('order')} #${order.order_number}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.total_amount?.toLocaleString('sv-SE')} SEK
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('noResults')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              {t('inventory')} {t('status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tiresLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('all')} {t('tires')}</span>
                  <span className="font-semibold text-2xl text-gray-900">
                    {stats.totalTires}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('tiresInStock')}</span>
                  <span className="font-semibold text-2xl text-green-600">
                    {stats.tiresInStock}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('completeSets')}</span>
                  <span className="font-semibold text-2xl text-blue-600">
                    {stats.totalSets}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {t('language') === 'sv' ? 'Lagernivå' : 'Stock Level'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalTires > 0
                        ? Math.round((stats.tiresInStock / stats.totalTires) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.totalTires > 0
                          ? (stats.tiresInStock / stats.totalTires) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('language') === 'sv' ? 'Snabbåtgärder' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/inventory/create'}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Package className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{t('addTire')}</p>
                <p className="text-sm text-gray-500">
                  {t('language') === 'sv' ? 'Lägg till nytt däck' : 'Add new tire'}
                </p>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/customers'}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Users className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {t('language') === 'sv' ? 'Hantera kunder' : 'Manage Customers'}
                </p>
                <p className="text-sm text-gray-500">
                  {t('language') === 'sv' ? 'Se alla kunder' : 'View all customers'}
                </p>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/sales'}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <DollarSign className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{t('createOrder')}</p>
                <p className="text-sm text-gray-500">
                  {t('language') === 'sv' ? 'Skapa ny order' : 'Create new order'}
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
