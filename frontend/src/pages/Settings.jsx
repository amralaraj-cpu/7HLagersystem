import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/apiClient';
import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Plus,
  Save,
  Trash2,
  Edit,
} from 'lucide-react';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  // Fetch system settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => base44.entities.SystemSettings.list('setting_key'),
  });

  const settings = settingsData?.data || [];

  // Create setting mutation
  const createMutation = useMutation({
    mutationFn: (newSetting) => base44.entities.SystemSettings.create(newSetting),
    onSuccess: () => {
      queryClient.invalidateQueries(['systemSettings']);
      setIsCreateDialogOpen(false);
      toast.success(t('language') === 'sv' ? 'Inställning skapad' : 'Setting created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SystemSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['systemSettings']);
      setEditingSetting(null);
      toast.success(t('language') === 'sv' ? 'Inställning uppdaterad' : 'Setting updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete setting mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SystemSettings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['systemSettings']);
      toast.success(t('language') === 'sv' ? 'Inställning raderad' : 'Setting deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateSetting = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const settingData = {
      setting_key: formData.get('setting_key'),
      setting_value: formData.get('setting_value'),
      setting_type: formData.get('setting_type'),
    };

    createMutation.mutate(settingData);
  };

  const handleUpdateSetting = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const settingData = {
      setting_value: formData.get('setting_value'),
      setting_type: formData.get('setting_type'),
    };

    updateMutation.mutate({ id: editingSetting._id, data: settingData });
  };

  const getSetting = (key) => {
    const setting = settings.find((s) => s.setting_key === key);
    if (!setting) return null;

    switch (setting.setting_type) {
      case 'number':
        return parseFloat(setting.setting_value);
      case 'boolean':
        return setting.setting_value === 'true';
      case 'json':
        try {
          return JSON.parse(setting.setting_value);
        } catch {
          return setting.setting_value;
        }
      default:
        return setting.setting_value;
    }
  };

  const updateAppSetting = (key, value, type = 'string') => {
    const existing = settings.find((s) => s.setting_key === key);
    const stringValue = type === 'json' ? JSON.stringify(value) : String(value);

    if (existing) {
      updateMutation.mutate({
        id: existing._id,
        data: { setting_value: stringValue, setting_type: type },
      });
    } else {
      createMutation.mutate({
        setting_key: key,
        setting_value: stringValue,
        setting_type: type,
      });
    }
  };

  const SettingForm = ({ onSubmit, setting = null }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="setting_key">
          {t('language') === 'sv' ? 'Nyckel' : 'Key'}
        </Label>
        <Input
          id="setting_key"
          name="setting_key"
          defaultValue={setting?.setting_key || ''}
          placeholder="storage_fee_per_month"
          disabled={!!setting}
          required
        />
      </div>

      <div>
        <Label htmlFor="setting_value">
          {t('language') === 'sv' ? 'Värde' : 'Value'}
        </Label>
        <Input
          id="setting_value"
          name="setting_value"
          defaultValue={setting?.setting_value || ''}
          placeholder="500"
          required
        />
      </div>

      <div>
        <Label htmlFor="setting_type">
          {t('language') === 'sv' ? 'Typ' : 'Type'}
        </Label>
        <Select name="setting_type" defaultValue={setting?.setting_type || 'string'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">
              {t('language') === 'sv' ? 'Text' : 'String'}
            </SelectItem>
            <SelectItem value="number">
              {t('language') === 'sv' ? 'Nummer' : 'Number'}
            </SelectItem>
            <SelectItem value="boolean">
              {t('language') === 'sv' ? 'Sant/Falskt' : 'Boolean'}
            </SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateDialogOpen(false);
            setEditingSetting(null);
          }}
        >
          {t('language') === 'sv' ? 'Avbryt' : 'Cancel'}
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {t('language') === 'sv' ? 'Spara' : 'Save'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('settings')}</h1>
          <p className="text-gray-500 mt-1">
            {t('language') === 'sv' ? 'Hantera appinställningar' : 'Manage application settings'}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('language') === 'sv' ? 'Ny inställning' : 'New Setting'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('language') === 'sv' ? 'Skapa ny inställning' : 'Create New Setting'}
              </DialogTitle>
            </DialogHeader>
            <SettingForm onSubmit={handleCreateSetting} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('language') === 'sv' ? 'Profil' : 'Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">
                {t('language') === 'sv' ? 'Företagsnamn' : 'Company Name'}
              </Label>
              <Input
                id="company_name"
                defaultValue={getSetting('company_name') || import.meta.env.VITE_COMPANY_NAME}
                onBlur={(e) => updateAppSetting('company_name', e.target.value, 'string')}
              />
            </div>
            <div>
              <Label htmlFor="app_name">
                {t('language') === 'sv' ? 'Appnamn' : 'App Name'}
              </Label>
              <Input
                id="app_name"
                defaultValue={getSetting('app_name') || import.meta.env.VITE_APP_NAME}
                onBlur={(e) => updateAppSetting('app_name', e.target.value, 'string')}
              />
            </div>
            <div>
              <Label htmlFor="language">
                {t('language') === 'sv' ? 'Språk' : 'Language'}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sv">Svenska</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('language') === 'sv' ? 'Notifieringar' : 'Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications">
                {t('language') === 'sv' ? 'E-postnotiser' : 'Email Notifications'}
              </Label>
              <Select
                value={getSetting('email_notifications') ? 'true' : 'false'}
                onValueChange={(value) =>
                  updateAppSetting('email_notifications', value === 'true', 'boolean')
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    {t('language') === 'sv' ? 'På' : 'On'}
                  </SelectItem>
                  <SelectItem value="false">
                    {t('language') === 'sv' ? 'Av' : 'Off'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="low_stock_alerts">
                {t('language') === 'sv' ? 'Låglagerlarm' : 'Low Stock Alerts'}
              </Label>
              <Select
                value={getSetting('low_stock_alerts') ? 'true' : 'false'}
                onValueChange={(value) =>
                  updateAppSetting('low_stock_alerts', value === 'true', 'boolean')
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    {t('language') === 'sv' ? 'På' : 'On'}
                  </SelectItem>
                  <SelectItem value="false">
                    {t('language') === 'sv' ? 'Av' : 'Off'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('language') === 'sv' ? 'Säkerhet' : 'Security'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api_key">
                {t('language') === 'sv' ? 'API-nyckel' : 'API Key'}
              </Label>
              <Input
                id="api_key"
                type="password"
                defaultValue={import.meta.env.VITE_BASE44_API_KEY}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('language') === 'sv'
                  ? 'API-nyckeln är konfigurerad i .env-filen'
                  : 'API key is configured in .env file'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_logout">
                {t('language') === 'sv' ? 'Auto-utloggning' : 'Auto Logout'}
              </Label>
              <Select
                value={getSetting('auto_logout') ? 'true' : 'false'}
                onValueChange={(value) =>
                  updateAppSetting('auto_logout', value === 'true', 'boolean')
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    {t('language') === 'sv' ? 'På' : 'On'}
                  </SelectItem>
                  <SelectItem value="false">
                    {t('language') === 'sv' ? 'Av' : 'Off'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              {t('language') === 'sv' ? 'Affärsinställningar' : 'Business Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storage_fee_per_month">
                {t('language') === 'sv' ? 'Lagringsavgift/månad (kr)' : 'Storage Fee/Month (kr)'}
              </Label>
              <Input
                id="storage_fee_per_month"
                type="number"
                step="0.01"
                defaultValue={getSetting('storage_fee_per_month') || 500}
                onBlur={(e) =>
                  updateAppSetting('storage_fee_per_month', parseFloat(e.target.value), 'number')
                }
              />
            </div>
            <div>
              <Label htmlFor="default_vat_rate">
                {t('language') === 'sv' ? 'Standard moms (%)' : 'Default VAT Rate (%)'}
              </Label>
              <Input
                id="default_vat_rate"
                type="number"
                step="0.01"
                defaultValue={getSetting('default_vat_rate') || 25}
                onBlur={(e) =>
                  updateAppSetting('default_vat_rate', parseFloat(e.target.value), 'number')
                }
              />
            </div>
            <div>
              <Label htmlFor="currency">
                {t('language') === 'sv' ? 'Valuta' : 'Currency'}
              </Label>
              <Input
                id="currency"
                defaultValue={getSetting('currency') || 'SEK'}
                onBlur={(e) => updateAppSetting('currency', e.target.value, 'string')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Settings Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('language') === 'sv' ? 'Alla systeminställningar' : 'All System Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">
              {t('language') === 'sv' ? 'Laddar...' : 'Loading...'}
            </p>
          ) : settings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {t('language') === 'sv'
                ? 'Inga inställningar hittades'
                : 'No settings found'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">
                      {t('language') === 'sv' ? 'Nyckel' : 'Key'}
                    </th>
                    <th className="text-left p-3 font-semibold">
                      {t('language') === 'sv' ? 'Värde' : 'Value'}
                    </th>
                    <th className="text-left p-3 font-semibold">
                      {t('language') === 'sv' ? 'Typ' : 'Type'}
                    </th>
                    <th className="text-right p-3 font-semibold">
                      {t('language') === 'sv' ? 'Åtgärder' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map((setting) => (
                    <tr key={setting._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{setting.setting_key}</td>
                      <td className="p-3">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {setting.setting_value?.length > 50
                            ? setting.setting_value.substring(0, 50) + '...'
                            : setting.setting_value}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-xs text-gray-600 capitalize">
                          {setting.setting_type}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSetting(setting)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (
                                window.confirm(
                                  t('language') === 'sv'
                                    ? 'Är du säker på att du vill radera denna inställning?'
                                    : 'Are you sure you want to delete this setting?'
                                )
                              ) {
                                deleteMutation.mutate(setting._id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Setting Dialog */}
      <Dialog
        open={!!editingSetting}
        onOpenChange={(open) => !open && setEditingSetting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('language') === 'sv' ? 'Redigera inställning' : 'Edit Setting'}
            </DialogTitle>
          </DialogHeader>
          {editingSetting && <SettingForm onSubmit={handleUpdateSetting} setting={editingSetting} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
