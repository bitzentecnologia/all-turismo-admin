export const REGISTER_MOCK_DATA = {
  // ETAPA 1: Dados do Responsável
  responsible: {
    name: "João Silva Santos",
    email: "joao.silva@restaurante.com",
    password: "senha123456",
    phone: "(11) 99999-8888"
  },

  // ETAPA 2: Endereço
  address: {
    cep: "01310-100",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Bela Vista",
    street: "Avenida Paulista",
    number: "1000",
    complement: "Sala 501"
  },

  // ETAPA 3: Estabelecimento
  establishment: {
    name: "Restaurante Sabor & Arte",
    cnpj: "29.870.654/0001-58",
    categoryId: "gastronomia",
    subcategoryId: "restaurante",
    has_delivery: true,
    phone: "(11) 3333-4444",
    instagram: "https://instagram.com/saborearte",
    description: "Restaurante especializado em culinária brasileira contemporânea com pratos únicos."
  },

  // ETAPA 4: Horários de Funcionamento
  operatingHours: [
    { dayOfWeek: "sunday", startTime: "10:00", endTime: "22:00", isClosed: false },
    { dayOfWeek: "monday", startTime: "09:00", endTime: "23:00", isClosed: false },
    { dayOfWeek: "tuesday", startTime: "09:00", endTime: "23:00", isClosed: false },
    { dayOfWeek: "wednesday", startTime: "09:00", endTime: "23:00", isClosed: true },
    { dayOfWeek: "thursday", startTime: "09:00", endTime: "23:00", isClosed: true },
    { dayOfWeek: "friday", startTime: "09:00", endTime: "24:00", isClosed: true },
    { dayOfWeek: "saturday", startTime: "10:00", endTime: "24:00", isClosed: true }
  ],

  // ETAPA 4: Promoção
  promotion: {
    text: "🎉 PROMOÇÃO ESPECIAL! 25% de desconto em todos os pratos principais do nosso cardápio. Aproveite esta oferta imperdível! Válido por 60 dias. Não acumula com outras promoções."
  },

  // ETAPA 5: Regras e Informações
  additionalInfo: {
    // Regras do estabelecimento
    rulesItems: [
      { name: "Não aceitamos reservas para grupos maiores que 8 pessoas", checked: true },
      { name: "Mesa liberada após 2 horas de permanência em horário de pico", checked: true },
      { name: "Não permitimos entrada de menores desacompanhados após 22h", checked: false },
      { name: "É obrigatório o uso de máscara em áreas comuns", checked: true },
      { name: "Não é permitido fumar em nenhuma área do estabelecimento", checked: true }
    ],

    // Regras de delivery
    deliveryRulesItems: [
      { name: "Pedido mínimo de R$ 25,00 para delivery", checked: true },
      { name: "Taxa de entrega de R$ 5,00 (grátis para pedidos acima de R$ 50,00)", checked: true },
      { name: "Tempo de entrega: 30-45 minutos", checked: true },
      { name: "Área de entrega: até 5km do estabelecimento", checked: false },
      { name: "Pagamento: dinheiro, cartão ou PIX", checked: true }
    ],

    // Informações do estabelecimento
    informationalItems: [
      { id: "wifi", name: "Wi-Fi gratuito", icon: "wifi", checked: true },
      { id: "parking", name: "Estacionamento", icon: "local_parking", checked: false },
      { id: "accessible", name: "Acessível para cadeirantes", icon: "accessible", checked: true },
      { id: "air_conditioning", name: "Ar condicionado", icon: "ac_unit", checked: true },
      { id: "live_music", name: "Música ao vivo", icon: "music_note", checked: false },
      { id: "pet_friendly", name: "Pet friendly", icon: "pets", checked: false },
      { id: "outdoor_seating", name: "Área externa", icon: "outdoor_grill", checked: true },
      { id: "bar", name: "Bar completo", icon: "local_bar", checked: true }
    ]
  }
};

// Mock para categorias
export const CATEGORIES_MOCK = [
  { id: "gastronomia", name: "Gastronomia" },
  { id: "hospedagem", name: "Hospedagem" },
  { id: "turismo", name: "Turismo" },
  { id: "entretenimento", name: "Entretenimento" },
  { id: "saude", name: "Saúde" },
  { id: "beleza", name: "Beleza" }
];

// Mock para subcategorias de gastronomia
export const SUBCATEGORIES_GASTRONOMIA_MOCK = [
  { id: "restaurante", name: "Restaurante" },
  { id: "lanchonete", name: "Lanchonete" },
  { id: "pizzaria", name: "Pizzaria" },
  { id: "hamburgueria", name: "Hamburgueria" },
  { id: "sorveteria", name: "Sorveteria" },
  { id: "confeitaria", name: "Confeitaria" },
  { id: "cafe", name: "Café" },
  { id: "bar", name: "Bar" },
  { id: "pub", name: "Pub" }
];

// Mock para regras de estabelecimento
export const RULES_TEMPLATES_MOCK = [
  { text: "Não aceitamos reservas para grupos maiores que 8 pessoas" },
  { text: "Mesa liberada após 2 horas de permanência" },
  { text: "Não permitimos entrada de menores desacompanhados" },
  { text: "É obrigatório o uso de máscara em áreas comuns" },
  { text: "Não é permitido fumar em nenhuma área do estabelecimento" },
  { text: "Respeite o silêncio e a tranquilidade dos outros clientes" },
  { text: "Não é permitido trazer comida de fora" },
  { text: "Crianças devem estar acompanhadas por responsáveis" }
];

// Mock para regras de delivery
export const DELIVERY_RULES_TEMPLATES_MOCK = [
  { text: "Pedido mínimo de R$ 25,00 para delivery" },
  { text: "Taxa de entrega de R$ 5,00" },
  { text: "Tempo de entrega: 30-45 minutos" },
  { text: "Área de entrega: até 5km do estabelecimento" },
  { text: "Pagamento: dinheiro, cartão ou PIX" },
  { text: "Não aceitamos troco para valores acima de R$ 50,00" },
  { text: "Produtos podem variar conforme disponibilidade" },
  { text: "Cancelamentos devem ser feitos até 15 minutos após o pedido" }
];

// Mock para informações do estabelecimento
export const INFORMATIONAL_ITEMS_MOCK = [
  { id: "wifi", name: "Wi-Fi gratuito", icon: "wifi" },
  { id: "parking", name: "Estacionamento", icon: "local_parking" },
  { id: "accessible", name: "Acessível para cadeirantes", icon: "accessible" },
  { id: "air_conditioning", name: "Ar condicionado", icon: "ac_unit" },
  { id: "live_music", name: "Música ao vivo", icon: "music_note" },
  { id: "pet_friendly", name: "Pet friendly", icon: "pets" },
  { id: "outdoor_seating", name: "Área externa", icon: "outdoor_grill" },
  { id: "bar", name: "Bar completo", icon: "local_bar" },
  { id: "delivery", name: "Delivery próprio", icon: "delivery_dining" },
  { id: "takeout", name: "Para viagem", icon: "takeout_dining" },
  { id: "reservation", name: "Sistema de reservas", icon: "event_seat" },
  { id: "kids_menu", name: "Cardápio infantil", icon: "child_care" }
];

// Função para preencher o formulário com dados mock
export function fillFormWithMockData(form: any): void {
  // ETAPA 1: Dados do Responsável
  form.get('responsible.name')?.setValue(REGISTER_MOCK_DATA.responsible.name);
  form.get('responsible.email')?.setValue(REGISTER_MOCK_DATA.responsible.email);
  form.get('responsible.password')?.setValue(REGISTER_MOCK_DATA.responsible.password);
  form.get('responsible.phone')?.setValue(REGISTER_MOCK_DATA.responsible.phone);

  // ETAPA 2: Endereço
  form.get('address.cep')?.setValue(REGISTER_MOCK_DATA.address.cep);
  form.get('address.state')?.setValue(REGISTER_MOCK_DATA.address.state);
  form.get('address.city')?.setValue(REGISTER_MOCK_DATA.address.city);
  form.get('address.neighborhood')?.setValue(REGISTER_MOCK_DATA.address.neighborhood);
  form.get('address.street')?.setValue(REGISTER_MOCK_DATA.address.street);
  form.get('address.number')?.setValue(REGISTER_MOCK_DATA.address.number);
  form.get('address.complement')?.setValue(REGISTER_MOCK_DATA.address.complement);

  // ETAPA 3: Estabelecimento
  form.get('establishment.name')?.setValue(REGISTER_MOCK_DATA.establishment.name);
  form.get('establishment.cnpj')?.setValue(REGISTER_MOCK_DATA.establishment.cnpj);
  form.get('establishment.categoryId')?.setValue(REGISTER_MOCK_DATA.establishment.categoryId);
  form.get('establishment.subcategoryId')?.setValue(REGISTER_MOCK_DATA.establishment.subcategoryId);
  form.get('establishment.has_delivery')?.setValue(REGISTER_MOCK_DATA.establishment.has_delivery);
  form.get('establishment.phone')?.setValue(REGISTER_MOCK_DATA.establishment.phone);
  form.get('establishment.instagram')?.setValue(REGISTER_MOCK_DATA.establishment.instagram);
  form.get('establishment.description')?.setValue(REGISTER_MOCK_DATA.establishment.description);

  // ETAPA 4: Horários de Funcionamento
  const operatingHoursArray = form.get('operatingHours');
  REGISTER_MOCK_DATA.operatingHours.forEach((day, index) => {
    if (operatingHoursArray && operatingHoursArray.at(index)) {
      operatingHoursArray.at(index).get('dayOfWeek')?.setValue(day.dayOfWeek);
      operatingHoursArray.at(index).get('startTime')?.setValue(day.startTime);
      operatingHoursArray.at(index).get('endTime')?.setValue(day.endTime);
      operatingHoursArray.at(index).get('isClosed')?.setValue(day.isClosed);
    }
  });

  // ETAPA 4: Promoção
  form.get('promotion.text')?.setValue(REGISTER_MOCK_DATA.promotion.text);

  // ETAPA 5: Regras e Informações
  // As regras e informações serão preenchidas automaticamente quando a categoria for selecionada
  // através dos métodos onCategoryChange() e carregamento dos templates
}

// Função para gerar dados mock aleatórios
export function generateRandomMockData(): typeof REGISTER_MOCK_DATA {
  const names = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Ferreira"];
  const emails = ["joao@email.com", "maria@email.com", "pedro@email.com", "ana@email.com", "carlos@email.com"];
  const restaurants = ["Restaurante Sabor & Arte", "Cantina da Nonna", "Bistro Moderno", "Casa do Sabor", "Gastronomia & Cia"];
  const streets = ["Rua das Flores", "Avenida Paulista", "Rua Augusta", "Alameda Santos", "Rua Oscar Freire"];
  const neighborhoods = ["Centro", "Vila Madalena", "Pinheiros", "Jardins", "Bela Vista"];

  const randomIndex = Math.floor(Math.random() * names.length);

  return {
    ...REGISTER_MOCK_DATA,
    responsible: {
      ...REGISTER_MOCK_DATA.responsible,
      name: names[randomIndex],
      email: emails[randomIndex],
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
    },
    address: {
      ...REGISTER_MOCK_DATA.address,
      street: streets[randomIndex],
      neighborhood: neighborhoods[randomIndex],
      number: (Math.floor(Math.random() * 9999) + 1).toString()
    },
    establishment: {
      ...REGISTER_MOCK_DATA.establishment,
      name: restaurants[randomIndex],
      phone: `(11) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
    }
  };
}
