import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, QrCode, Edit2, Trash2, Package, ExternalLink, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';
import SearchInput from '../components/ui/SearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { base44 } from '../api/apiClient';
import { cn } from '@/lib/utils';

const TireSets = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    season: 'all',
    condition: 'all',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [qrDialog, setQrDialog] = useState({ open: false, data: null, title: '' });
  const [formData, setFormData] = useState({
    brand: '',
    tire_dimension: '',
    season: 'summer',
    condition: 'new',
    total_tires: 4,
    purchase_price_per_tire: '',
    selling_price_per_tire: '',
    notes: '',
    blocket_listed: false,
    blocket_url: '',
  });

  // Fetch tire sets
  const { data: tireSets, isLoading } = useQuery({
    queryKey: ['tireSets'],
    queryFn: () => base44.entities.TireSet.list(),
  });

  // Fetch tires (to show which tires belong to each set)
  const { data: tires } = useQuery({
    queryKey: ['tires'],
    queryFn: () => base44.entities.Tire.list(),
  });

  // Create tire set mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TireSet.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tireSets']);
      toast.success(t('saveSuccess'));
      handleCloseDialog();
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  // Update tire set mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TireSet.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tireSets']);
      toast.success(t('saveSuccess'));
      handleCloseDialog();
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  // Delete tire set mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TireSet.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tireSets']);
      toast.success(t('deleteSuccess'));
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  const handleOpenDialog = (tireSet = null) => {
    if (tireSet) {
      setEditingSet(tireSet);
      setFormData(tireSet);
    } else {
      setEditingSet(null);
      setFormData({
        brand: '',
        tire_dimension: '',
        season: 'summer',
        condition: 'new',
        total_tires: 4,
        purchase_price_per_tire: '',
        selling_price_per_tire: '',
        notes: '',
        blocket_listed: false,
        blocket_url: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSet(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      total_purchase_value: formData.purchase_price_per_tire * formData.total_tires,
      total_selling_value: formData.selling_price_per_tire * formData.total_tires,
      available_tires: formData.total_tires,
      status: 'complete',
    };

    if (editingSet) {
      updateMutation.mutate({ id: editingSet.set_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (tireSet) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate(tireSet.set_id);
    }
  };

  const handleGenerateQR = (tireSet) => {
    const qrData = {
      set_number: tireSet.set_number,
      brand: tireSet.brand,
      dimension: tireSet.tire_dimension,
      season: tireSet.season,
      total_tires: tireSet.total_tires,
    };
    setQrDialog({
      open: true,
      data: qrData,
      title: tireSet.set_number,
      subtitle: `${tireSet.brand} ${tireSet.tire_dimension || ''} - ${tireSet.total_tires} ${t('tires').toLowerCase()}`,
    });
  };

  // Filter tire sets
  const filteredTireSets = tireSets?.filter((set) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      set.set_number?.toLowerCase().includes(search) ||
      set.brand?.toLowerCase().includes(search) ||
      set.tire_dimension?.toLowerCase().includes(search);

    const matchesStatus = filters.status === 'all' || set.status === filters.status;
    const matchesSeason = filters.season === 'all' || set.season === filters.season;
    const matchesCondition = filters.condition === 'all' || set.condition === filters.condition;

    return matchesSearch && matchesStatus && matchesSeason && matchesCondition;
  });

  const hasActiveFilters = Object.values(filters).some(f => f !== 'all');

  // Get tires for a specific set
  const getTiresInSet = (setId) => {
    return tires?.filter(tire => tire.set_id === setId) || [];
  };

  // Calculate stats
  const stats = {
    total: tireSets?.length || 0,
    complete: tireSets?.filter(s => s.status === 'complete')?.length || 0,
    partial: tireSets?.filter(s => s.status === 'partial')?.length || 0,
    totalValue: tireSets?.reduce((sum, s) => sum + (s.total_selling_value || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('tireSets')}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{stats.total} {t('sets').toLowerCase()}</span>
            <span className="text-emerald-600">{stats.complete} {t('completeSets').toLowerCase()}</span>
            {stats.partial > 0 && (
              <span className="text-orange-600">{stats.partial} {t('partialSets').toLowerCase()}</span>
            )}
            <span className="font-semibold text-blue-600">{stats.totalValue.toLocaleString('sv-SE')} SEK</span>
          </div>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('createSet')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('search') + ' ' + t('sets').toLowerCase() + '...'}
            />

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
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
                onClick={() => setFilters({ status: 'all', season: 'all', condition: 'all' })}
              >
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tire Sets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-56 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTireSets?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTireSets.map((tireSet) => {
            const setTires = getTiresInSet(tireSet.set_id);
            const profit = (tireSet.total_selling_value || 0) - (tireSet.total_purchase_value || 0);
            const profitMargin = tireSet.total_purchase_value
              ? ((profit / tireSet.total_purchase_value) * 100).toFixed(1)
              : 0;

            return (
              <Card key={tireSet.set_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm text-gray-600">{tireSet.set_number}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{tireSet.brand}</h3>
                      {tireSet.tire_dimension && (
                        <p className="text-gray-600 text-sm">{tireSet.tire_dimension}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(tireSet)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateQR(tireSet)}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={tireSet.status} label={tireSet.status} />
                    {tireSet.season && <StatusBadge status={tireSet.season} label={tireSet.season} />}
                    {tireSet.condition && <StatusBadge status={tireSet.condition} label={tireSet.condition} />}
                    {tireSet.blocket_listed && (
                      <StatusBadge status="confirmed" label="Blocket" className="cursor-pointer" />
                    )}
                  </div>

                  {/* Set Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('tiresInSet')}:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {tireSet.available_tires}/{tireSet.total_tires}
                      </span>
                    </div>
                    {setTires.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {setTires.length} {t('tires').toLowerCase()} {t('language') === 'sv' ? 'registrerade' : 'registered'}
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 text-sm mb-4">
                    {tireSet.selling_price_per_tire && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{t('price')}/{t('tire')}:</span>
                        <span className="font-semibold">{tireSet.selling_price_per_tire} SEK</span>
                      </div>
                    )}
                    {tireSet.total_selling_value && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{t('total')} {t('price')}:</span>
                        <span className="font-bold text-blue-600">{tireSet.total_selling_value.toLocaleString('sv-SE')} SEK</span>
                      </div>
                    )}
                    {profit > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {t('language') === 'sv' ? 'Vinst' : 'Profit'}:
                        </span>
                        <span className="font-semibold text-emerald-600">
                          {profit.toLocaleString('sv-SE')} SEK ({profitMargin}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(tireSet)}
                      className="flex-1"
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tireSet)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={t('noResults')}
          description={
            searchTerm || hasActiveFilters
              ? t('language') === 'sv'
                ? 'Inga set matchar dina filter'
                : 'No sets match your filters'
              : t('language') === 'sv'
              ? 'Inga däckset ännu'
              : 'No tire sets yet'
          }
        />
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSet
                ? t('language') === 'sv' ? 'Redigera set' : 'Edit Set'
                : t('createSet')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">{t('brand')} *</Label>
                <Input
                  id="brand"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tire_dimension">{t('tireDimension')}</Label>
                <Input
                  id="tire_dimension"
                  placeholder="215/55R16"
                  value={formData.tire_dimension}
                  onChange={(e) => setFormData({ ...formData, tire_dimension: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">{t('season')}</Label>
                <Select value={formData.season} onValueChange={(v) => setFormData({ ...formData, season: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="all_season">All Season</SelectItem>
                    <SelectItem value="ms">M+S</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">{t('condition')}</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used_excellent">Excellent</SelectItem>
                    <SelectItem value="used_good">Good</SelectItem>
                    <SelectItem value="used_fair">Fair</SelectItem>
                    <SelectItem value="used_poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_tires">{t('quantity')} *</Label>
                <Input
                  id="total_tires"
                  type="number"
                  min="2"
                  max="8"
                  required
                  value={formData.total_tires}
                  onChange={(e) => setFormData({ ...formData, total_tires: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_price_per_tire">{t('purchasePrice')}/{t('tire')}</Label>
                <Input
                  id="purchase_price_per_tire"
                  type="number"
                  min="0"
                  value={formData.purchase_price_per_tire}
                  onChange={(e) => setFormData({ ...formData, purchase_price_per_tire: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="selling_price_per_tire">{t('sellingPrice')}/{t('tire')}</Label>
                <Input
                  id="selling_price_per_tire"
                  type="number"
                  min="0"
                  value={formData.selling_price_per_tire}
                  onChange={(e) => setFormData({ ...formData, selling_price_per_tire: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">{t('notes')}</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="blocket_url">Blocket URL</Label>
                <Input
                  id="blocket_url"
                  type="url"
                  placeholder="https://blocket.se/..."
                  value={formData.blocket_url}
                  onChange={(e) => setFormData({ ...formData, blocket_url: e.target.value, blocket_listed: !!e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? t('loading') : t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

export default TireSets;
