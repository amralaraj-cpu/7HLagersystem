import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, QrCode, ExternalLink, Edit2, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import SearchInput from '../components/ui/SearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { base44 } from '../api/apiClient';
import { cn } from '@/lib/utils';

const Inventory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    season: 'all',
    type: 'all',
    condition: 'all',
  });
  const [qrDialog, setQrDialog] = useState({ open: false, data: null, title: '' });

  // Fetch tires
  const { data: tires, isLoading } = useQuery({
    queryKey: ['tires'],
    queryFn: () => base44.entities.Tire.list(),
  });

  // Delete tire mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Tire.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tires']);
      toast.success(t('deleteSuccess'));
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  const handleDelete = (tire) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate(tire.tire_id);
    }
  };

  const handleGenerateQR = (tire) => {
    const qrData = {
      product_id: tire.product_id,
      type: tire.type,
      brand: tire.brand,
      dimension: tire.tire_dimension,
      position: tire.warehouse_position,
    };
    setQrDialog({
      open: true,
      data: qrData,
      title: tire.product_id,
      subtitle: `${tire.brand} ${tire.tire_dimension || ''}`,
    });
  };

  // Filter tires
  const filteredTires = tires?.filter((tire) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      tire.product_id?.toLowerCase().includes(search) ||
      tire.brand?.toLowerCase().includes(search) ||
      tire.tire_dimension?.toLowerCase().includes(search) ||
      tire.warehouse_position?.toLowerCase().includes(search) ||
      tire.suitable_vehicles?.toLowerCase().includes(search);

    const matchesStatus = filters.status === 'all' || tire.status === filters.status;
    const matchesSeason = filters.season === 'all' || tire.season === filters.season;
    const matchesType = filters.type === 'all' || tire.type === filters.type;
    const matchesCondition = filters.condition === 'all' || tire.condition === filters.condition;

    return matchesSearch && matchesStatus && matchesSeason && matchesType && matchesCondition;
  });

  const hasActiveFilters = Object.values(filters).some(f => f !== 'all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('inventory')}</h1>
          <p className="text-gray-500 mt-1">
            {filteredTires?.length || 0} {t('tires').toLowerCase()}
          </p>
        </div>
        <Button
          onClick={() => navigate('/inventory/create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addTire')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('search') + ' ' + t('tires').toLowerCase() + '...'}
            />

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.season} onValueChange={(v) => setFilters({ ...filters, season: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('season')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="all_season">All Season</SelectItem>
                  <SelectItem value="ms">M+S</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="complete_wheel">Complete Wheel</SelectItem>
                  <SelectItem value="tire_only">Tire Only</SelectItem>
                  <SelectItem value="rim_only">Rim Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.condition} onValueChange={(v) => setFilters({ ...filters, condition: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('condition')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used_excellent">Excellent</SelectItem>
                  <SelectItem value="used_good">Good</SelectItem>
                  <SelectItem value="used_fair">Fair</SelectItem>
                  <SelectItem value="used_poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ status: 'all', season: 'all', type: 'all', condition: 'all' })}
              >
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tire Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTires?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTires.map((tire) => (
            <Card key={tire.tire_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-600">{tire.product_id}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{tire.brand}</h3>
                    {tire.tire_dimension && (
                      <p className="text-gray-600 text-sm">{tire.tire_dimension}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/inventory/${tire.tire_id}`)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateQR(tire)}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <StatusBadge status={tire.status} label={tire.status} />
                  {tire.season && <StatusBadge status={tire.season} label={tire.season} />}
                  {tire.condition && <StatusBadge status={tire.condition} label={tire.condition} />}
                  {tire.blocket_listed && (
                    <StatusBadge
                      status="confirmed"
                      label="Blocket"
                      className="cursor-pointer"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {tire.warehouse_position && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('position')}:</span>
                      <span className="font-medium">{tire.warehouse_position}</span>
                    </div>
                  )}
                  {tire.tread_depth && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('treadDepth')}:</span>
                      <span className="font-medium">{tire.tread_depth} mm</span>
                    </div>
                  )}
                  {tire.selling_price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('price')}:</span>
                      <span className="font-semibold text-blue-600">{tire.selling_price} SEK</span>
                    </div>
                  )}
                  {tire.set_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('set')}:</span>
                      <span className="font-medium text-purple-600">
                        {tire.position_in_set}/{tire.total_in_set}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/inventory/${tire.tire_id}`)}
                    className="flex-1"
                  >
                    {t('view')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tire)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('noResults')}
          description={
            searchTerm || hasActiveFilters
              ? t('language') === 'sv'
                ? 'Inga däck matchar dina filter'
                : 'No tires match your filters'
              : t('language') === 'sv'
              ? 'Inga däck i lagret ännu'
              : 'No tires in inventory yet'
          }
        />
      )}

      {/* QR Code Generator Dialog */}
      <QRCodeGenerator
        isOpen={qrDialog.open}
        onClose={() => setQrDialog({ open: false, data: null, title: '' })}
        data={qrDialog.data}
        title={qrDialog.title}
        subtitle={qrDialog.subtitle}
      />
    </div>
  );
};

export default Inventory;
