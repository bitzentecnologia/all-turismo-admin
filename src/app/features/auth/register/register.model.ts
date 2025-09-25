/**
 * Interfaces para o formulário de registro
 */

import { DropDownItem } from '../../../shared/models/dropdown.model';

export interface ResponsibleData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AddressData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

export interface EstablishmentData {
  name: string;
  cnpj: string;
  categoryId: string;
  subcategoryId?: string;
  phone: string;
  instagram?: string;
  description?: string;
  logoFile?: File | null;
  logoPreview?: string;
  has_delivery: boolean;
}

export interface InformationalItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface RegisterFormData {
  responsible: ResponsibleData;
  address: AddressData;
  establishment: EstablishmentData;
  additionalInfo: {
    informationalItems: InformationalItem[];
    rulesItems: InformationalItem[];
    deliveryRulesItems: InformationalItem[];
  };
}
