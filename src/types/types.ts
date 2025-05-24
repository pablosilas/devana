export interface WindowState {
  id: string;
  title: string;
  component: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface FakeData {
  cpf: string;
  cnpj: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
}
