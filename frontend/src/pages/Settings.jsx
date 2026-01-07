import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('settings')}</h1>
        <p className="text-gray-500 mt-1">
          {t('language') === 'sv' ? 'Hantera appinställningar' : 'Manage application settings'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('language') === 'sv' ? 'Profil' : 'Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              {t('language') === 'sv'
                ? 'Hantera din profil och preferenser'
                : 'Manage your profile and preferences'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('language') === 'sv' ? 'Notifieringar' : 'Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              {t('language') === 'sv'
                ? 'Konfigurera notifieringar'
                : 'Configure notifications'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('language') === 'sv' ? 'Säkerhet' : 'Security'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              {t('language') === 'sv'
                ? 'Säkerhetsinställningar och lösenord'
                : 'Security settings and password'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              {t('language') === 'sv' ? 'Systemet' : 'System'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              {t('language') === 'sv'
                ? 'Systeminställningar och preferenser'
                : 'System settings and preferences'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
