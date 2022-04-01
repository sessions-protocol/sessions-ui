import profileABI from "@/web3/abis/profile.json";
import sessionsABI from "@/web3/abis/sessions.json";
import erc20ABI from "@/web3/abis/erc20.json";
import { PROFILE_CONTRACT, SESSIONS_CONTRACT } from "@/web3/contracts";
import { add } from "date-fns";
import { ethers, Signer } from "ethers";
import { ProfileWithId } from "../types";

class SessionApi {
  private provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.matic.today"
  );
  private browserProvider = new ethers.providers.Web3Provider(
    (window as unknown as { ethereum?: any }).ethereum
  );
  private sessionsContract = new ethers.Contract(
    SESSIONS_CONTRACT,
    sessionsABI,
    this.provider
  );
  private profileContract = new ethers.Contract(
    PROFILE_CONTRACT,
    profileABI,
    this.provider
  );

  get signer() {
    return this.browserProvider.getSigner();
  }
  async getSession(sessionId: string) {
    const sessionType = await this.sessionsContract.getSessionType(sessionId);
    const profile = await this.profileContract.getProfileById(
      sessionType.profileId
    );
    const tokenPrice = {
      symbol: "MATIC",
      amount: sessionType.amount,
      decimals: 18,
      contract: null,
    };
    if (sessionType.token != "0x0000000000000000000000000000000000000000") {
      const erc20Contract = new ethers.Contract(
        sessionType.token,
        erc20ABI,
        this.provider
      );

      tokenPrice.decimals = await erc20Contract.decimals();
      tokenPrice.symbol = await erc20Contract.symbol();
      tokenPrice.contract = sessionType.token;
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
      profileId: sessionType.profileId,
      validateFollow: sessionType.validateFollow,
      token: tokenPrice,
      sessionType,
    };
  }

  async getSessionAvailability(
    sessionId: string,
    startTime: number,
    endTime: number
  ) {
    const availability =
      await this.sessionsContract.getAvailabilityBySessionTypeId(
        sessionId,
        startTime,
        endTime
      );
    return availability.map((i: any) => {
      return {
        availableSlot: i.availableSlot,
        date: new Date(i.date.toNumber() * 1000).toISOString(),
      };
    });
  }

  async getAvailabilitiesByProfile(profileId: string) {
    const availabilities = await this.sessionsContract.getAvailablitysByProfile(
      profileId
    );
    const data = availabilities.availabilityIds
      .map((id: any, i: number) => ({
        id: id.toString(),
        ...availabilities.availabilitysByProfile[i],
      }))
      .reverse();
    return data;
  }
  async getSessionTypesByProfileId(profileId: string) {
    const sessionTypes = await this.sessionsContract.getSessionTypesByProfile(
      profileId
    );
    const data = sessionTypes.sessionTypeIds
      .map((id: any, i: number) => ({
        id: id.toString(),
        ...sessionTypes.sessionTypesByProfile[i],
      }))
      .reverse();
    return data;
  }

  async getUserProfiles(userAddress: string) {
    const profiles = await this.profileContract.getUserProfiles(userAddress);
    return profiles.map((profile: any) => ({
      id: profile.id.toString(),
      imageURI: profile.imageURI,
      handle: profile.handle,
    })) as ProfileWithId[];
  }

  async getProfileByHandle(handle: string) {
    const profile = await this.profileContract.getProfileByHandle(handle);
    return {
      id: profile.id.toString(),
      imageURI: profile.imageURI,
      handle: profile.handle,
    };
  }

  async createUserProfile(handle: string, imageURI = "") {
    console.log(this.signer, handle, imageURI);
    if (!this.signer) return;
    const profileContract = new ethers.Contract(
      PROFILE_CONTRACT,
      profileABI,
      this.signer
    );
    const tx = await profileContract.createProfile(handle, imageURI);
    await tx.wait();
  }
}

export const sessionApi = new SessionApi();
