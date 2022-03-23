export interface SessionSlot {
  time: string;
  booked: boolean;
}

export interface Session {
  id: string;
  user: {
    address: string;
    email: string;
  };
  title: string;
  description?: string;
  duration: number;
  availableDates: string[];
}