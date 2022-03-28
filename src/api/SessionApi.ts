import lensHubABI from "@/web3/abis/lensHub.json";
import sessionsABI from "@/web3/abis/sessions.json";
import { add } from 'date-fns';
import { ethers } from 'ethers';

class SessionApi {
  private provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
  private sessionsContract = new ethers.Contract(
    "0x54f6Fb3E799ed5A1FedeeF26E647801911BcB36d",
    sessionsABI,
    this.provider,
  );
  private lensHubContract = new ethers.Contract(
    "0xd7B3481De00995046C7850bCe9a5196B7605c367",
    lensHubABI,
    this.provider,
  );

  async getSession(sessionId: string) {
    const sessionType = await this.sessionsContract.getSessionType(sessionId)
    const profile = await this.lensHubContract.getProfile(sessionType.lensProfileId)

    return {
      id: sessionType.id,
      user: {
        handle: profile.handle,
        address: sessionType.recipient,
      },
      title: sessionType.title,
      duration: 60 * 6 * sessionType.durationInSlot,
      availableDates: [
        new Date().toISOString(),
        add(new Date(), { days: 1 }).toISOString(),
      ],
      lensProfileId: sessionType.lensProfileId,
      validateFollow: sessionType.validateFollow,
      token: {
        symbol: "MATIC",
        amount: sessionType.amount,
        decimals: 18
      },
      sessionType,
    }
  }

  async getSessionAvailability(sessionId: string, startTime: number, endTime: number) {
    const availability = await this.sessionsContract.getAvailabilityBySessionTypeId(sessionId, startTime, endTime)
    return availability.map((i: any) => {
      return {
        availableSlot: i.availableSlot,
        date: new Date(i.date.toNumber() * 1000).toISOString(),
      }
    })
  }
  async getSessionTypesByProfileId(profileId: string) {
    const sessionTypes = await this.sessionsContract.getSessionTypesByProfile(profileId)
    return sessionTypes.sessionTypeIds.map((id: any, i: number) => ({
      id:id.toNumber(),
      ...sessionTypes.sessionTypesByProfile[i]
    })).reverse()
  }
}

export const sessionApi = new SessionApi();
