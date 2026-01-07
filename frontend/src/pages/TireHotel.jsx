import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Hotel } from 'lucide-react';

const TireHotel = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('tireHotel')}</h1>
        <p className="text-gray-500 mt-1">
          {t('language') === 'sv' ? 'Hantera kundlagring' : 'Manage customer tire storage'}
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {t('language') === 'sv' ? 'Däckhotell' : 'Tire Hotel'}
          </h2>
          <p className="text-gray-500">
            {t('language') === 'sv'
              ? 'Däckhotell-funktionalitet kommer snart...'
              : 'Tire Hotel functionality coming soon...'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TireHotel;
