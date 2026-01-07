import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    tireSets: 'Tire Sets',
    warehouse: 'Warehouse',
    tireHotel: 'Tire Hotel',
    customers: 'Customers',
    sales: 'Sales',
    settings: 'Settings',

    // Common actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    view: 'View',
    all: 'All',
    loading: 'Loading',

    // Common fields
    type: 'Type',
    brand: 'Brand',
    dimension: 'Dimension',
    season: 'Season',
    status: 'Status',
    condition: 'Condition',
    price: 'Price',
    notes: 'Notes',
    date: 'Date',
    total: 'Total',
    quantity: 'Quantity',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    postalCode: 'Postal Code',
    city: 'City',
    name: 'Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    companyName: 'Company Name',
    orgNumber: 'Organization Number',

    // Tire related
    tire: 'Tire',
    tires: 'Tires',
    set: 'Set',
    sets: 'Sets',
    addTire: 'Add Tire',
    tireDimension: 'Tire Dimension',
    rimSize: 'Rim Size',
    boltPattern: 'Bolt Pattern',
    centerBore: 'Center Bore',
    offset: 'Offset',
    treadDepth: 'Tread Depth',
    position: 'Position',
    positions: 'Positions',
    warehousePosition: 'Warehouse Position',
    manufacturingYear: 'Manufacturing Year',
    manufacturingWeek: 'Manufacturing Week',
    year: 'Year',
    week: 'Week',
    inches: 'inches',

    // Tire sets
    setNumber: 'Set Number',
    createSet: 'Create Set',
    completeSets: 'Complete Sets',
    partialSets: 'Partial Sets',
    tiresInSet: 'Tires in Set',
    totalSets: 'Total Sets',

    // Customers
    customer: 'Customer',
    customerNumber: 'Customer Number',
    registrationNumber: 'Registration Number',
    vehicle: 'Vehicle',
    vehicles: 'Vehicles',
    contactPerson: 'Contact Person',

    // Sales
    order: 'Order',
    orders: 'Orders',
    orderNumber: 'Order Number',
    createOrder: 'Create Order',
    recentSales: 'Recent Sales',
    subtotal: 'Subtotal',
    vat: 'VAT',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    source: 'Source',

    // Tire Hotel
    checkIn: 'Check In',
    checkInDate: 'Check-In Date',
    checkOutDate: 'Check-Out Date',
    stored: 'Stored',
    customerSets: 'Customer Sets',
    storageFee: 'Storage Fee',
    conditionNotes: 'Condition Notes',

    // Settings
    language: 'Language',
    userManagement: 'User Management',
    inviteUser: 'Invite User',
    user: 'User',
    administrator: 'Administrator',
    invitationSent: 'Invitation Sent',

    // Messages
    saveSuccess: 'Saved successfully',
    deleteSuccess: 'Deleted successfully',
    errorOccurred: 'An error occurred',
    noResults: 'No results found',
    confirmDelete: 'Are you sure you want to delete this?',
    requiredField: 'This field is required',
    clearFilters: 'Clear Filters',

    // Dashboard
    totalInventoryValue: 'Total Inventory Value',
    tiresInStock: 'Tires in Stock',
    customerTiresStored: 'Customer Tires Stored',
    pendingPayments: 'Pending Payments',

    // Other
    purchasePrice: 'Purchase Price',
    sellingPrice: 'Selling Price',
    productId: 'Product ID',
    addItem: 'Add Item',
  },
  sv: {
    // Navigation
    dashboard: 'Översikt',
    inventory: 'Lager',
    tireSets: 'Däckset',
    warehouse: 'Lager',
    tireHotel: 'Däckhotell',
    customers: 'Kunder',
    sales: 'Försäljning',
    settings: 'Inställningar',

    // Common actions
    add: 'Lägg till',
    edit: 'Redigera',
    delete: 'Radera',
    save: 'Spara',
    cancel: 'Avbryt',
    close: 'Stäng',
    search: 'Sök',
    filter: 'Filtrera',
    view: 'Visa',
    all: 'Alla',
    loading: 'Laddar',

    // Common fields
    type: 'Typ',
    brand: 'Märke',
    dimension: 'Dimension',
    season: 'Säsong',
    status: 'Status',
    condition: 'Skick',
    price: 'Pris',
    notes: 'Anteckningar',
    date: 'Datum',
    total: 'Totalt',
    quantity: 'Antal',
    email: 'E-post',
    phone: 'Telefon',
    address: 'Adress',
    postalCode: 'Postnummer',
    city: 'Stad',
    name: 'Namn',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    companyName: 'Företagsnamn',
    orgNumber: 'Org.nummer',

    // Tire related
    tire: 'Däck',
    tires: 'Däck',
    set: 'Set',
    sets: 'Set',
    addTire: 'Lägg till däck',
    tireDimension: 'Däckdimension',
    rimSize: 'Fälgstorlek',
    boltPattern: 'Bultmönster',
    centerBore: 'Navet',
    offset: 'ET',
    treadDepth: 'Mönsterdjup',
    position: 'Position',
    positions: 'Positioner',
    warehousePosition: 'Lagerplats',
    manufacturingYear: 'Tillverkningsår',
    manufacturingWeek: 'Tillverkningsvecka',
    year: 'År',
    week: 'Vecka',
    inches: 'tum',

    // Tire sets
    setNumber: 'Setnummer',
    createSet: 'Skapa set',
    completeSets: 'Kompletta set',
    partialSets: 'Ofullständiga set',
    tiresInSet: 'Däck i set',
    totalSets: 'Totalt antal set',

    // Customers
    customer: 'Kund',
    customerNumber: 'Kundnummer',
    registrationNumber: 'Registreringsnummer',
    vehicle: 'Fordon',
    vehicles: 'Fordon',
    contactPerson: 'Kontaktperson',

    // Sales
    order: 'Order',
    orders: 'Ordrar',
    orderNumber: 'Ordernummer',
    createOrder: 'Skapa order',
    recentSales: 'Senaste försäljningar',
    subtotal: 'Delsumma',
    vat: 'Moms',
    paymentMethod: 'Betalningsmetod',
    paymentStatus: 'Betalningsstatus',
    source: 'Källa',

    // Tire Hotel
    checkIn: 'Incheckning',
    checkInDate: 'Incheckningsdatum',
    checkOutDate: 'Utcheckningsdatum',
    stored: 'Förvarade',
    customerSets: 'Kundset',
    storageFee: 'Förvaringsavgift',
    conditionNotes: 'Skicksanteckningar',

    // Settings
    language: 'Språk',
    userManagement: 'Användarhantering',
    inviteUser: 'Bjud in användare',
    user: 'Användare',
    administrator: 'Administratör',
    invitationSent: 'Inbjudan skickad',

    // Messages
    saveSuccess: 'Sparat',
    deleteSuccess: 'Raderat',
    errorOccurred: 'Ett fel uppstod',
    noResults: 'Inga resultat',
    confirmDelete: 'Är du säker på att du vill radera?',
    requiredField: 'Detta fält är obligatoriskt',
    clearFilters: 'Rensa filter',

    // Dashboard
    totalInventoryValue: 'Totalt lagervärde',
    tiresInStock: 'Däck i lager',
    customerTiresStored: 'Kundäck förvarade',
    pendingPayments: 'Väntande betalningar',

    // Other
    purchasePrice: 'Inköpspris',
    sellingPrice: 'Försäljningspris',
    productId: 'Produkt-ID',
    addItem: 'Lägg till artikel',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'sv';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
