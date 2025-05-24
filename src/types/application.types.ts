export interface TimerState {
  time: number;
  isRunning: boolean;
  initialTime: { minutes: number; seconds: number };
}

export interface MusicPlayerState {
  isPlaying: boolean;
  currentTrack: string;
  volume: number;
  currentFile: File | null;
}

export interface FakeDataState {
  cpf: string;
  cnpj: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
}
