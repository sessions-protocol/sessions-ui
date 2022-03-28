import { BigNumber } from "ethers";

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
  lensProfileId: number;
  validateFollow: boolean;
  token: {
    symbol: string,
    amount: any,
    decimals: number,
    contract: string | null;
  }
  sessionType: SessionType;
}

export interface SessionType {
  recipient: string;
  durationInSlot: number;
  openBookingDeltaDays: number;
  title: string;
  description: string;
  archived: boolean;
  locked: boolean;
  validateFollow: boolean;
  token: string;
  amount: string;
  sessionNFT: string;
  availabilityId: BigNumber;
  lensProfileId: BigNumber;
}

export interface Availability {
  availableSlot: BigNumber;
  date: string;
}

export interface ParsedSlot {
  time: Date;
  slot: number;
}
export interface ParsedDateSlot {
  date: Date;
  slots: ParsedSlot[];
}