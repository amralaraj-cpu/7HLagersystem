import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, QrCode, Edit2, Trash2, Hotel, Calendar, DollarSign,
  User, Car, Package, MapPin, AlertCircle
} from 'lucide-react';
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
import PositionSelector from '../components/PositionSelector';
import { base44 } from '../api/apiClient';

const TireHotel = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [qrDialog, setQrDialog] = useState({ open: false, data: null, title: '' });
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    vehicle_registration: '',
    vehicle_info: '',
    tire_brand: '',
    tire_dimension: '',
    season: 'winter',
    studded: false,
    total_tires: 4,
    tread_depths: [6, 6, 6, 6],
    positions: [],
    check_in_date: new Date().toISOString().split('T')[0],
    expected_pickup_date: '',
    storage_fee_per_month: 400,
    condition_notes: '',
    status: 'stored',
  });

  // Fetch customer tire sets
  const { data: customerSets, isLoading } = useQuery({
    queryKey: ['customerTireSets'],
    queryFn: () => base44.entities.CustomerTireSet.list(),
  });

  // Fetch customers for dropdown
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  // Fetch warehouse positions (customer storage)
  const { data: positions } = useQuery({
    queryKey: ['warehousePositions', 'customer'],
    queryFn: () => base44.entities.WarehousePosition.filter({ is_customer_storage: true }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CustomerTireSet.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerTireSets']);
      toast.success(t('saveSuccess'));
      handleCloseDialog();
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CustomerTireSet.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerTireSets']);
      toast.success(t('saveSuccess'));
      handleCloseDialog();
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CustomerTireSet.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerTireSets']);
      toast.success(t('deleteSuccess'));
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  // Check out mutation
  const checkOutMutation = useMutation({
    mutationFn: ({ id }) => base44.entities.CustomerTireSet.update(id, {
      status: 'checked_out',
      check_out_date: new Date().toISOString().split('T')[0],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['customerTireSets']);
      toast.success(t('language') === 'sv' ? 'Utcheckad' : 'Checked out');
    },
    onError: () => {
      toast.error(t('errorOccurred'));
    },
  });

  const handleOpenDialog = (set = null) => {
    if (set) {
      setEditingSet(set);
      setFormData({
        ...set,
        tread_depths: set.tread_depths || [6, 6, 6, 6],
        positions: set.positions || [],
      });
    } else {
      setEditingSet(null);
      setFormData({
        customer_id: '',
        customer_name: '',
        vehicle_registration: '',
        vehicle_info: '',
        tire_brand: '',
        tire_dimension: '',
        season: 'winter',
        studded: false,
        total_tires: 4,
        tread_depths: [6, 6, 6, 6],
        positions: [],
        check_in_date: new Date().toISOString().split('T')[0],
        expected_pickup_date: '',
        storage_fee_per_month: 400,
        condition_notes: '',
        status: 'stored',
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
      total_fees_due: calculateStorageFees(formData.check_in_date, formData.storage_fee_per_month),
    };

    if (editingSet) {
      updateMutation.mutate({ id: editingSet._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (set) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate(set._id);
    }
  };

  const handleCheckOut = (set) => {
    if (window.confirm(t('language') === 'sv' ? 'Checka ut detta set?' : 'Check out this set?')) {
      checkOutMutation.mutate({ id: set._id });
    }
  };

  const handleGenerateQR = (set) => {
    const qrData = {
      set_number: set.set_number,
      customer_name: set.customer_name,
      vehicle: set.vehicle_registration,
      brand: set.tire_brand,
      dimension: set.tire_dimension,
    };
    setQrDialog({
      open: true,
      data: qrData,
      title: set.set_number,
      subtitle: `${set.customer_name} - ${set.vehicle_registration}`,
    });
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers?.find(c => c._id === customerId);
    if (customer) {
      setFormData({
        ...formData,
        customer_id: customerId,
        customer_name: `${customer.first_name} ${customer.last_name}`,
      });
    }
  };

  const calculateStorageFees = (checkInDate, feePerMonth) => {
    if (!checkInDate || !feePerMonth) return 0;
    const months = Math.ceil(
      (new Date() - new Date(checkInDate)) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.max(0, months * feePerMonth);
  };

  // Filter sets
  const filteredSets = customerSets?.filter((set) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      set.set_number?.toLowerCase().includes(search) ||
      set.customer_name?.toLowerCase().includes(search) ||
      set.vehicle_registration?.toLowerCase().includes(search) ||
      set.tire_brand?.toLowerCase().includes(search);

    const matchesStatus = statusFilter === 'all' || set.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: customerSets?.length || 0,
    stored: customerSets?.filter(s => s.status === 'stored')?.length || 0,
    pendingPickup: customerSets?.filter(s => s.status === 'pending_pickup')?.length || 0,
    totalFees: customerSets?.reduce((sum, s) => sum + (s.total_fees_due || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('tireHotel')}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{stats.total} {t('customerSets').toLowerCase()}</span>
            <span className="text-emerald-600">{stats.stored} {t('stored').toLowerCase()}</span>
            {stats.pendingPickup > 0 && (
              <span className="text-amber-600">{stats.pendingPickup} {t('language') === 'sv' ? 'väntar' : 'pending'}</span>
            )}
            <span className="font-semibold text-blue-600">{stats.totalFees.toLocaleString('sv-SE')} SEK</span>
          </div>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('checkIn')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('search') + '...'}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="stored">{t('stored')}</SelectItem>
                <SelectItem value="pending_pickup">Pending Pickup</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Sets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSets?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => {
            const daysSinceCheckIn = Math.floor(
              (new Date() - new Date(set.check_in_date)) / (1000 * 60 * 60 * 24)
            );
            const avgTreadDepth = set.tread_depths?.length
              ? (set.tread_depths.reduce((a, b) => a + b, 0) / set.tread_depths.length).toFixed(1)
              : 'N/A';

            return (
              <Card key={set._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Hotel className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm text-gray-600">{set.set_number}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{set.customer_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Car className="w-4 h-4" />
                        <span>{set.vehicle_registration}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(set)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleGenerateQR(set)}>
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <StatusBadge status={set.status} label={set.status} />
                  </div>

                  {/* Tire Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        {set.tire_brand} {set.tire_dimension}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StatusBadge status={set.season} label={set.season} />
                      {set.studded && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {t('language') === 'sv' ? 'Dubbade' : 'Studded'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Storage Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('checkInDate')}:
                      </span>
                      <span className="font-medium">{new Date(set.check_in_date).toLocaleDateString('sv-SE')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('language') === 'sv' ? 'Dagar' : 'Days'}:</span>
                      <span className="font-medium">{daysSinceCheckIn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('treadDepth')}:</span>
                      <span className="font-medium">{avgTreadDepth} mm</span>
                    </div>
                    {set.positions?.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {t('positions')}:
                        </span>
                        <span className="font-medium">{set.positions.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Fees */}
                  {set.total_fees_due > 0 && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                      <span className="text-sm font-medium text-amber-900 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {t('language') === 'sv' ? 'Avgifter' : 'Fees'}:
                      </span>
                      <span className="font-bold text-amber-900">
                        {set.total_fees_due.toLocaleString('sv-SE')} SEK
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {set.status === 'stored' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckOut(set)}
                        className="flex-1"
                      >
                        {t('language') === 'sv' ? 'Checka ut' : 'Check Out'}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(set)}
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
            searchTerm || statusFilter !== 'all'
              ? t('language') === 'sv'
                ? 'Inga set matchar dina filter'
                : 'No sets match your filters'
              : t('language') === 'sv'
              ? 'Inga kundset än'
              : 'No customer sets yet'
          }
        />
      )}

      {/* Check-in Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSet
                ? t('language') === 'sv' ? 'Redigera set' : 'Edit Set'
                : t('checkIn')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Selection */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="customer_id">{t('customer')} *</Label>
                <Select value={formData.customer_id} onValueChange={handleCustomerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('language') === 'sv' ? 'Välj kund' : 'Select customer'} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.first_name} {customer.last_name}
                        {customer.company_name && ` - ${customer.company_name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-2">
                <Label htmlFor="vehicle_registration">{t('registrationNumber')}</Label>
                <Input
                  id="vehicle_registration"
                  value={formData.vehicle_registration}
                  onChange={(e) => setFormData({ ...formData, vehicle_registration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_info">{t('vehicle')} {t('language') === 'sv' ? 'Info' : 'Info'}</Label>
                <Input
                  id="vehicle_info"
                  placeholder="BMW X5 2018"
                  value={formData.vehicle_info}
                  onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                />
              </div>

              {/* Tire Info */}
              <div className="space-y-2">
                <Label htmlFor="tire_brand">{t('brand')}</Label>
                <Input
                  id="tire_brand"
                  value={formData.tire_brand}
                  onChange={(e) => setFormData({ ...formData, tire_brand: e.target.value })}
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
                <Label htmlFor="total_tires">{t('quantity')}</Label>
                <Input
                  id="total_tires"
                  type="number"
                  min="2"
                  max="8"
                  value={formData.total_tires}
                  onChange={(e) => setFormData({ ...formData, total_tires: parseInt(e.target.value) })}
                />
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <Label htmlFor="check_in_date">{t('checkInDate')}</Label>
                <Input
                  id="check_in_date"
                  type="date"
                  value={formData.check_in_date}
                  onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_pickup_date">{t('expectedPickupDate') || 'Expected Pickup'}</Label>
                <Input
                  id="expected_pickup_date"
                  type="date"
                  value={formData.expected_pickup_date}
                  onChange={(e) => setFormData({ ...formData, expected_pickup_date: e.target.value })}
                />
              </div>

              {/* Storage Fee */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="storage_fee_per_month">{t('storageFee')}/månad (SEK)</Label>
                <Input
                  id="storage_fee_per_month"
                  type="number"
                  min="0"
                  value={formData.storage_fee_per_month}
                  onChange={(e) => setFormData({ ...formData, storage_fee_per_month: parseFloat(e.target.value) })}
                />
              </div>

              {/* Condition Notes */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="condition_notes">{t('conditionNotes')}</Label>
                <Textarea
                  id="condition_notes"
                  rows={3}
                  value={formData.condition_notes}
                  onChange={(e) => setFormData({ ...formData, condition_notes: e.target.value })}
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

      {/* QR Code Generator */}
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

export default TireHotel;
