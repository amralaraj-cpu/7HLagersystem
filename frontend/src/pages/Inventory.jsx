import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Inventory = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll({ search, limit: 50 });
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lager</h1>
        {user?.role === 'admin' && (
          <Link to="/inventory/create" className="btn-primary">
            + Lägg till artikel
          </Link>
        )}
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Sök efter artikel, märke, dimension, plats..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">Laddar...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary text-lg">
            Inga artiklar hittades
          </p>
          {user?.role === 'admin' && (
            <Link
              to="/inventory/create"
              className="btn-primary mt-4 inline-block"
            >
              Lägg till första artikeln
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Produkt-ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Typ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Märke
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Dimension
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Plats
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Pris
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/inventory/${item.id}`)
                    }
                  >
                    <td className="px-4 py-3 text-sm font-mono">
                      {item.product_id}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {item.product_type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.tire_brand || item.rim_brand || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.tire_dimension || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {item.location_code}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.selling_price
                        ? `${item.selling_price.toLocaleString('sv-SE')} kr`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'sold'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status === 'available'
                          ? 'Tillgänglig'
                          : item.status === 'sold'
                          ? 'Såld'
                          : 'Reserverad'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
