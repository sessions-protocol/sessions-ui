import lensHubABI from "@/web3/abis/lensHub.json";
import sessionsABI from "@/web3/abis/sessions.json";
import erc20ABI from "@/web3/abis/erc20.json";
import { LENS_HUB_CONTRACT, SESSIONS_CONTRACT } from "@/web3/contracts";
import { add } from 'date-fns';
import { ethers } from 'ethers';

class SessionApi {
  private provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
  private sessionsContract = new ethers.Contract(
    SESSIONS_CONTRACT,
    sessionsABI,
    this.provider,
  );
  private lensHubContract = new ethers.Contract(
    LENS_HUB_CONTRACT,
    lensHubABI,
    this.provider,
  );

  async getSession(sessionId: string) {
    const sessionType = await this.sessionsContract.getSessionType(sessionId)
    const profile = await this.lensHubContract.getProfile(sessionType.lensProfileId)
    const tokenPrice = {
      symbol: "MATIC",
      amount: sessionType.amount,
      decimals: 18,
      contract: null
    }
    if (sessionType.token != "0x0000000000000000000000000000000000000000") {
      const erc20Contract = new ethers.Contract(
        sessionType.token,
        erc20ABI,
        this.provider,
      );

      tokenPrice.decimals = await erc20Contract.decimals();
      tokenPrice.symbol = await erc20Contract.symbol();
      tokenPrice.contract = sessionType.token
    }

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
      token: tokenPrice,
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
    const data = sessionTypes.sessionTypeIds.map((id: any, i: number) => ({
      id:id.toString(),
      ...sessionTypes.sessionTypesByProfile[i]
    })).reverse()
    return data
  }
}

export const sessionApi = new SessionApi();
