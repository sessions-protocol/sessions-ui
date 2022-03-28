import { ethers } from 'ethers';
import lensHubABI from "@/web3/abis/lensHub.json";
import sessionsABI from "@/web3/abis/sessions.json";
import { add } from 'date-fns';

class SessionApi {
  async getSession(sessionId: string) {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
    const sessionsContract = new ethers.Contract(
      "0xf19C27C92EEA361F8e2FD246283CD058e4d78F00",
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
      token: {
        symbol: "MATIC",
        amount: sessionType.amount,
        decimals: 18
      }
    }
  }
}

export const sessionApi = new SessionApi();
