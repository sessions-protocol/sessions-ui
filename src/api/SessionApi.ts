import { ethers } from 'ethers';
import lensHubABI from "@/web3/abis/lensHub.json";
import sessionsABI from "@/web3/abis/sessions.json";
import { add } from 'date-fns';

class SessionApi {
  async getSession(sessionId: string) {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
    const sessionsContract = new ethers.Contract(
      "0x54f6Fb3E799ed5A1FedeeF26E647801911BcB36d",
      sessionsABI,
      provider
    );
    const lensHubContract = new ethers.Contract(
      "0xd7B3481De00995046C7850bCe9a5196B7605c367",
      lensHubABI,
      provider
    );

    const sessionType = await sessionsContract.getSessionType(sessionId)
    const profile = await lensHubContract.getProfile(sessionType.lensProfileId)

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
        add(new Date(), { days: 1}).toISOString(),
      ],
      lensProfileId: sessionType.lensProfileId,
      validateFollow: sessionType.validateFollow,
      token: {
        symbol: "MATIC",
        amount: sessionType.amount,
        decimals: 18
      }
    }
  }
}

export const sessionApi = new SessionApi();
