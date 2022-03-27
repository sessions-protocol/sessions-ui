export interface SessionSlot {
  time: string;
  booked: boolean;
}

export interface Session {
  id: string;
  user: {
    address: string;
    handle: string;
  };
  title: string;
  description?: string;
  duration: number;
  availableDates: string[];
  token: {
    symbol: string,
    amount: any,
    decimals: number
  }
}