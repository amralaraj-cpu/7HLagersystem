import { useEffect, useState } from 'react';
import { locationsAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await locationsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Laddar...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Total kapacitet
          </h3>
          <p className="text-3xl font-bold text-primary">
            {stats?.total_capacity?.toLocaleString('sv-SE') || 0}
          </p>
          <p className="text-sm text-text-secondary mt-1">positioner</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Upptagen
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.total_occupied?.toLocaleString('sv-SE') || 0}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {stats?.occupancy_rate}% beläggning
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Tillgänglig
          </h3>
          <p className="text-3xl font-bold text-secondary">
            {stats?.total_available?.toLocaleString('sv-SE') || 0}
          </p>
          <p className="text-sm text-text-secondary mt-1">lediga positioner</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Kundlagring
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.customer_storage?.occupied || 0}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {stats?.customer_storage?.occupancy_rate}% beläggning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Försäljningslager</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total positioner:</span>
              <span className="font-semibold">
                {stats?.sales_inventory?.total?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Upptagna:</span>
              <span className="font-semibold text-blue-600">
                {stats?.sales_inventory?.occupied?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Tillgängliga:</span>
              <span className="font-semibold text-secondary">
                {stats?.sales_inventory?.available?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Beläggning:</span>
                <span className="font-bold text-lg">
                  {stats?.sales_inventory?.occupancy_rate}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${stats?.sales_inventory?.occupancy_rate || 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Däckhotell (Kundlagring)</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total positioner:</span>
              <span className="font-semibold">
                {stats?.customer_storage?.total?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Upptagna:</span>
              <span className="font-semibold text-purple-600">
                {stats?.customer_storage?.occupied?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Tillgängliga:</span>
              <span className="font-semibold text-secondary">
                {stats?.customer_storage?.available?.toLocaleString('sv-SE')}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Beläggning:</span>
                <span className="font-bold text-lg">
                  {stats?.customer_storage?.occupancy_rate}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{
                    width: `${stats?.customer_storage?.occupancy_rate || 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
