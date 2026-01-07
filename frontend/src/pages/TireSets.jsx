import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Warehouse } from 'lucide-react';

const TireSets = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('tireSets')}</h1>
        <p className="text-gray-500 mt-1">
          {t('language') === 'sv' ? 'Hantera däckset' : 'Manage tire sets'}
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <Warehouse className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {t('language') === 'sv' ? 'Däckset' : 'Tire Sets'}
          </h2>
          <p className="text-gray-500">
            {t('language') === 'sv'
              ? 'Däckset-funktionalitet kommer snart...'
              : 'Tire Sets functionality coming soon...'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TireSets;
