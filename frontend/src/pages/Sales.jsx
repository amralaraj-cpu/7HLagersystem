import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/apiClient';
import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import {
  Plus,
  ShoppingCart,
  Euro,
  CreditCard,
  Package,
  Trash2,
  Eye,
  Edit,
  X,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Sales = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['salesOrders'],
    queryFn: () => base44.entities.SalesOrder.list('-order_date'),
  });

  // Fetch customers for dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('name'),
  });

  // Fetch tire sets for order items
  const { data: tireSetsData } = useQuery({
    queryKey: ['tireSets'],
    queryFn: () => base44.entities.TireSet.list(),
  });

  const orders = ordersData?.data || [];
  const customers = customersData?.data || [];
  const tireSets = tireSetsData?.data || [];

  // Create order mutation
  const createMutation = useMutation({
    mutationFn: (newOrder) => base44.entities.SalesOrder.create(newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries(['salesOrders']);
      setIsCreateDialogOpen(false);
      toast.success(t('language') === 'sv' ? 'Order skapad' : 'Order created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SalesOrder.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['salesOrders']);
      setIsViewDialogOpen(false);
      toast.success(t('language') === 'sv' ? 'Order uppdaterad' : 'Order updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SalesOrder.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['salesOrders']);
      toast.success(t('language') === 'sv' ? 'Order raderad' : 'Order deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === 'all' || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate statistics
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'confirmed').length;
  const paidOrders = orders.filter((o) => o.payment_status === 'paid').length;
  const unpaidRevenue = orders
    .filter((o) => o.payment_status === 'pending')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Parse items from form
    const items = [];
    let itemIndex = 0;
    while (formData.get(`item_${itemIndex}_description`)) {
      const quantity = parseFloat(formData.get(`item_${itemIndex}_quantity`)) || 1;
      const unitPrice = parseFloat(formData.get(`item_${itemIndex}_unit_price`)) || 0;
      items.push({
        description: formData.get(`item_${itemIndex}_description`),
        quantity,
        unit_price: unitPrice,
        total_price: quantity * unitPrice,
        set_id: formData.get(`item_${itemIndex}_set_id`) || null,
      });
      itemIndex++;
    }

    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const vatRate = parseFloat(formData.get('vat_rate')) || 25;
    const vatAmount = subtotal * (vatRate / 100);
    const totalAmount = subtotal + vatAmount;

    // Get selected customer data
    const customerId = formData.get('customer_id');
    const selectedCustomer = customers.find((c) => c._id === customerId);

    const orderData = {
      order_number: `ORD-${Date.now()}`,
      customer_id: customerId,
      customer_name: selectedCustomer?.name || formData.get('customer_name'),
      customer_email: selectedCustomer?.email || formData.get('customer_email'),
      customer_phone: selectedCustomer?.phone || formData.get('customer_phone'),
      customer_address: selectedCustomer?.address || '',
      order_date: formData.get('order_date'),
      items,
      subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total_amount: totalAmount,
      payment_method: formData.get('payment_method'),
      payment_status: formData.get('payment_status'),
      status: formData.get('status'),
      source: formData.get('source'),
      notes: formData.get('notes'),
    };

    createMutation.mutate(orderData);
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    updateMutation.mutate({ id: orderId, data: { status } });
  };

  const handleUpdatePaymentStatus = (orderId, paymentStatus, paymentDate = null) => {
    const updateData = { payment_status: paymentStatus };
    if (paymentDate) {
      updateData.payment_date = paymentDate;
    }
    updateMutation.mutate({ id: orderId, data: updateData });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'amber',
      paid: 'green',
      partial: 'blue',
      refunded: 'red',
    };
    return colors[status] || 'gray';
  };

  const OrderForm = ({ onSubmit, order = null }) => {
    const [orderItems, setOrderItems] = useState(
      order?.items || [{ description: '', quantity: 1, unit_price: 0, set_id: null }]
    );

    const addItem = () => {
      setOrderItems([
        ...orderItems,
        { description: '', quantity: 1, unit_price: 0, set_id: null },
      ]);
    };

    const removeItem = (index) => {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
      const newItems = [...orderItems];
      newItems[index][field] = value;
      setOrderItems(newItems);
    };

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_id">
              {t('language') === 'sv' ? 'Kund' : 'Customer'}
            </Label>
            <Select name="customer_id" defaultValue={order?.customer_id || ''}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    t('language') === 'sv' ? 'Välj kund' : 'Select customer'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="order_date">
              {t('language') === 'sv' ? 'Orderdatum' : 'Order Date'}
            </Label>
            <Input
              id="order_date"
              name="order_date"
              type="date"
              defaultValue={order?.order_date || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t('language') === 'sv' ? 'Orderrader' : 'Order Items'}</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              {t('language') === 'sv' ? 'Lägg till rad' : 'Add Item'}
            </Button>
          </div>

          {orderItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg">
              <div className="col-span-4">
                <Input
                  name={`item_${index}_description`}
                  placeholder={t('language') === 'sv' ? 'Beskrivning' : 'Description'}
                  defaultValue={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Select
                  name={`item_${index}_set_id`}
                  defaultValue={item.set_id || ''}
                  onValueChange={(value) => updateItem(index, 'set_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('language') === 'sv' ? 'Set (valfri)' : 'Set (optional)'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('language') === 'sv' ? 'Ingen' : 'None'}
                    </SelectItem>
                    {tireSets.map((set) => (
                      <SelectItem key={set._id} value={set._id}>
                        {set.set_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  name={`item_${index}_quantity`}
                  type="number"
                  step="1"
                  min="1"
                  placeholder={t('language') === 'sv' ? 'Antal' : 'Qty'}
                  defaultValue={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-3">
                <Input
                  name={`item_${index}_unit_price`}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('language') === 'sv' ? 'Pris' : 'Price'}
                  defaultValue={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-1 flex items-center justify-center">
                {orderItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payment_method">
              {t('language') === 'sv' ? 'Betalningsmetod' : 'Payment Method'}
            </Label>
            <Select name="payment_method" defaultValue={order?.payment_method || 'card'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  {t('language') === 'sv' ? 'Kontant' : 'Cash'}
                </SelectItem>
                <SelectItem value="card">
                  {t('language') === 'sv' ? 'Kort' : 'Card'}
                </SelectItem>
                <SelectItem value="swish">Swish</SelectItem>
                <SelectItem value="bank_transfer">
                  {t('language') === 'sv' ? 'Bankgiro' : 'Bank Transfer'}
                </SelectItem>
                <SelectItem value="invoice">
                  {t('language') === 'sv' ? 'Faktura' : 'Invoice'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payment_status">
              {t('language') === 'sv' ? 'Betalningsstatus' : 'Payment Status'}
            </Label>
            <Select
              name="payment_status"
              defaultValue={order?.payment_status || 'pending'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  {t('language') === 'sv' ? 'Väntar' : 'Pending'}
                </SelectItem>
                <SelectItem value="paid">
                  {t('language') === 'sv' ? 'Betald' : 'Paid'}
                </SelectItem>
                <SelectItem value="partial">
                  {t('language') === 'sv' ? 'Delbetalning' : 'Partial'}
                </SelectItem>
                <SelectItem value="refunded">
                  {t('language') === 'sv' ? 'Återbetald' : 'Refunded'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status">
              {t('language') === 'sv' ? 'Orderstatus' : 'Order Status'}
            </Label>
            <Select name="status" defaultValue={order?.status || 'draft'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  {t('language') === 'sv' ? 'Utkast' : 'Draft'}
                </SelectItem>
                <SelectItem value="confirmed">
                  {t('language') === 'sv' ? 'Bekräftad' : 'Confirmed'}
                </SelectItem>
                <SelectItem value="completed">
                  {t('language') === 'sv' ? 'Slutförd' : 'Completed'}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t('language') === 'sv' ? 'Avbruten' : 'Cancelled'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="source">
              {t('language') === 'sv' ? 'Källa' : 'Source'}
            </Label>
            <Select name="source" defaultValue={order?.source || 'direct'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">
                  {t('language') === 'sv' ? 'Direkt' : 'Direct'}
                </SelectItem>
                <SelectItem value="blocket">Blocket</SelectItem>
                <SelectItem value="social_media">
                  {t('language') === 'sv' ? 'Sociala medier' : 'Social Media'}
                </SelectItem>
                <SelectItem value="phone">
                  {t('language') === 'sv' ? 'Telefon' : 'Phone'}
                </SelectItem>
                <SelectItem value="website">
                  {t('language') === 'sv' ? 'Hemsida' : 'Website'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vat_rate">
              {t('language') === 'sv' ? 'Moms %' : 'VAT %'}
            </Label>
            <Input
              id="vat_rate"
              name="vat_rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue={order?.vat_rate || 25}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">
            {t('language') === 'sv' ? 'Anteckningar' : 'Notes'}
          </Label>
          <textarea
            id="notes"
            name="notes"
            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              t('language') === 'sv'
                ? 'Lägg till anteckningar...'
                : 'Add notes...'
            }
            defaultValue={order?.notes || ''}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            {t('language') === 'sv' ? 'Avbryt' : 'Cancel'}
          </Button>
          <Button type="submit">
            {t('language') === 'sv' ? 'Skapa order' : 'Create Order'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('sales')}</h1>
          <p className="text-gray-500 mt-1">
            {t('language') === 'sv' ? 'Hantera försäljning och ordrar' : 'Manage sales and orders'}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('language') === 'sv' ? 'Ny order' : 'New Order'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t('language') === 'sv' ? 'Skapa ny order' : 'Create New Order'}
              </DialogTitle>
            </DialogHeader>
            <OrderForm onSubmit={handleCreateOrder} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={t('language') === 'sv' ? 'Total intäkt' : 'Total Revenue'}
          value={`${totalRevenue.toLocaleString('sv-SE')} kr`}
          icon={Euro}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title={t('language') === 'sv' ? 'Väntande ordrar' : 'Pending Orders'}
          value={pendingOrders}
          icon={Package}
          iconColor="text-blue-600"
        />
        <StatCard
          title={t('language') === 'sv' ? 'Betalda ordrar' : 'Paid Orders'}
          value={paidOrders}
          icon={CreditCard}
          iconColor="text-green-600"
        />
        <StatCard
          title={t('language') === 'sv' ? 'Obetald summa' : 'Unpaid Amount'}
          value={`${unpaidRevenue.toLocaleString('sv-SE')} kr`}
          icon={ShoppingCart}
          iconColor="text-amber-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={
                t('language') === 'sv'
                  ? 'Sök ordernummer, kund...'
                  : 'Search order number, customer...'
              }
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('language') === 'sv' ? 'Alla status' : 'All Statuses'}
                </SelectItem>
                <SelectItem value="draft">
                  {t('language') === 'sv' ? 'Utkast' : 'Draft'}
                </SelectItem>
                <SelectItem value="confirmed">
                  {t('language') === 'sv' ? 'Bekräftad' : 'Confirmed'}
                </SelectItem>
                <SelectItem value="completed">
                  {t('language') === 'sv' ? 'Slutförd' : 'Completed'}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t('language') === 'sv' ? 'Avbruten' : 'Cancelled'}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('language') === 'sv' ? 'Alla betalningar' : 'All Payments'}
                </SelectItem>
                <SelectItem value="pending">
                  {t('language') === 'sv' ? 'Väntar' : 'Pending'}
                </SelectItem>
                <SelectItem value="paid">
                  {t('language') === 'sv' ? 'Betald' : 'Paid'}
                </SelectItem>
                <SelectItem value="partial">
                  {t('language') === 'sv' ? 'Delbetalning' : 'Partial'}
                </SelectItem>
                <SelectItem value="refunded">
                  {t('language') === 'sv' ? 'Återbetald' : 'Refunded'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12">
            <p className="text-center text-gray-500">
              {t('language') === 'sv' ? 'Laddar...' : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t('language') === 'sv' ? 'Inga ordrar' : 'No orders'}
          description={
            t('language') === 'sv'
              ? 'Skapa din första order för att komma igång'
              : 'Create your first order to get started'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <StatusBadge
                        status={order.status}
                        variant={getStatusColor(order.status)}
                      />
                      <StatusBadge
                        status={order.payment_status}
                        variant={getPaymentStatusColor(order.payment_status)}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">{order.customer_name}</span>
                      <span>•</span>
                      <span>{new Date(order.order_date).toLocaleDateString('sv-SE')}</span>
                      {order.source && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{order.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.order_number && (
                      <QRCodeGenerator
                        value={order.order_number}
                        size={80}
                        label={order.order_number}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                        >
                          <span className="font-medium">{item.description}</span>
                          <div className="flex items-center gap-4 text-gray-600">
                            <span>
                              {item.quantity} × {item.unit_price?.toLocaleString('sv-SE')} kr
                            </span>
                            <span className="font-semibold text-gray-900">
                              {item.total_price?.toLocaleString('sv-SE')} kr
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500">
                          {t('language') === 'sv' ? 'Delsumma:' : 'Subtotal:'}
                        </span>{' '}
                        <span className="font-medium">
                          {order.subtotal?.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">
                          {t('language') === 'sv' ? 'Moms' : 'VAT'} ({order.vat_rate}%):
                        </span>{' '}
                        <span className="font-medium">
                          {order.vat_amount?.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {t('language') === 'sv' ? 'Totalt:' : 'Total:'}{' '}
                        {order.total_amount?.toLocaleString('sv-SE')} kr
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateOrderStatus(order._id, 'confirmed')}
                        >
                          {t('language') === 'sv' ? 'Bekräfta' : 'Confirm'}
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                        >
                          {t('language') === 'sv' ? 'Slutför' : 'Complete'}
                        </Button>
                      )}
                      {order.payment_status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdatePaymentStatus(
                              order._id,
                              'paid',
                              new Date().toISOString().split('T')[0]
                            )
                          }
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          {t('language') === 'sv' ? 'Markera betald' : 'Mark Paid'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('language') === 'sv' ? 'Visa' : 'View'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              t('language') === 'sv'
                                ? 'Är du säker på att du vill radera denna order?'
                                : 'Are you sure you want to delete this order?'
                            )
                          ) {
                            deleteMutation.mutate(order._id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-sm text-gray-600 italic pt-2 border-t">
                      {order.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('language') === 'sv' ? 'Orderdetaljer' : 'Order Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Ordernummer:' : 'Order Number:'}
                  </span>
                  <p className="font-medium">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Datum:' : 'Date:'}
                  </span>
                  <p className="font-medium">
                    {new Date(selectedOrder.order_date).toLocaleDateString('sv-SE')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Kund:' : 'Customer:'}
                  </span>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Telefon:' : 'Phone:'}
                  </span>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Email:' : 'Email:'}
                  </span>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('language') === 'sv' ? 'Betalningsmetod:' : 'Payment Method:'}
                  </span>
                  <p className="font-medium capitalize">{selectedOrder.payment_method}</p>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    {t('language') === 'sv' ? 'Orderrader' : 'Order Items'}
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                      >
                        <span>{item.description}</span>
                        <span>
                          {item.quantity} × {item.unit_price?.toLocaleString('sv-SE')} kr ={' '}
                          {item.total_price?.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t('language') === 'sv' ? 'Delsumma:' : 'Subtotal:'}</span>
                  <span>{selectedOrder.subtotal?.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    {t('language') === 'sv' ? 'Moms' : 'VAT'} ({selectedOrder.vat_rate}%):
                  </span>
                  <span>{selectedOrder.vat_amount?.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t('language') === 'sv' ? 'Totalt:' : 'Total:'}</span>
                  <span>{selectedOrder.total_amount?.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <span className="text-sm text-gray-500">
                    {t('language') === 'sv' ? 'Anteckningar:' : 'Notes:'}
                  </span>
                  <p className="text-sm mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
