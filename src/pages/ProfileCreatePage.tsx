import { useProfileState } from '@/context/ProfileContext';
import { SessionLayout } from '@/layout/SessionLayout';
import { createProfile, profiles } from '@/lens/profile';
import { ConnectorList } from '@/web3/components/ConnectorList';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ClipboardCheckIcon } from '@heroicons/react/solid';
import { useWeb3React } from '@web3-react/core';
import { useState, useRef, FunctionComponent } from 'react';
import LoadingDots from "@/components/app/loading-dots";
import { useNavigate } from 'react-router-dom';


import toast, { Toaster } from "react-hot-toast";

export function ProfileCreatePage() {
  const { chainId, account, deactivate, library } = useWeb3React();
  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="SessionScheduled transition-all duration-500 ease-in-out">
            <div className="flex flex-col text-center p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px] min-w-[480px]">

              <div className="flex flex-row items-center my-4 mx-4">
                <ClipboardCheckIcon className="text-green-500 mx-auto -mt-1 inline-block h-12 w-12" />
                <h2 className="ml-4 text-left flex-1 font-bold text-2xl text-gray-700 dark:text-gray-200">
                  Create New Profile
                </h2>
              </div>

              <div className="flex flex-col text-center h-full px-4">
                {(!chainId || !account) ? (
                  <div>
                    <div className="text-lg font-medium mb-4">Connect Wallet</div>
                    <ConnectorList />
                  </div>
                ) : (
                  <CreateProfileView />
                )}

              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}


const CreateProfileView: FunctionComponent = () => {
  const [profileState, setProfileState] = useProfileState();

  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const profileHandleRef = useRef<HTMLInputElement | null>(null);
  const profileNameRef = useRef<HTMLInputElement | null>(null);
  const profilePictureRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  /*const { data: session }: any = useSession();
  const sessionId = session?.user.id;

  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );*/


  async function onSubmitProfile() {
    try {
      if (!profileHandleRef.current) {
        throw new Error("Missing required HANDLE");
      }
      // create profile
      const res = await createProfile({ handle: profileHandleRef.current?.value, profilePictureUri: profilePictureRef.current?.value });
      console.log("profile created", res);
      // query profile
      const profile = (await profiles(
        { handles: [profileHandleRef.current?.value] },
      )).items[0];
      setProfileState({ profile });

      navigate("/session-types");
    } catch (e: any) {
      console.log("create profile error", e);
      if (e.message === "HANDLE_TAKEN") {
        setProfileError(name);
        setCreatingSite(false);
      } else {
        toast.error("Failed to Create Profile", e.message);
        setCreatingSite(false);
      }

      return;
    }

    // TODO delete example code
    /*const res = await fetch("/api/site", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId,
        userId: sessionId,
        name: profileHandleRef.current?.value,
        subdomain: siteSubdomainRef.current?.value,
        description: siteDescriptionRef.current?.value,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      navigate(`/site/${data.siteId}`);
    }*/
  }

  return (
    <>
      <div className="my-10 grid gap-y-4">

        <FormControl>
          <FormLabel htmlFor='profile-input-handle'>HANDLE</FormLabel>
          <Input id='profile-input-handle' placeholder="youruniquehandle" ref={profileHandleRef} onInput={() => setName(profileHandleRef.current!.value)} />
        </FormControl>

        {profileError && (
          <p className="px-5 text-left text-red-500">
            Profile <b>{profileError}</b> has already been taken, please try
            another one.
          </p>
        )}

        {/*<FormControl>
          <FormLabel htmlFor='profile-input-name'>NAME</FormLabel>
          <Input id='profile-input-name' placeholder="Your Name" ref={profileNameRef} />
        </FormControl>*/}

        <FormControl>
          <FormLabel htmlFor='profile-input-picture'>PROFILE PICTURE</FormLabel>
          <Input id='profile-input-picture' placeholder="https://cc0.crypto.punks/lol.jpg" ref={profilePictureRef} />
        </FormControl>

      </div>

      <Button
        isFullWidth
        colorScheme={"green"}
        onClick={() => {
          setCreatingSite(true);
          onSubmitProfile();
        }}
        disabled={creatingSite || error !== null}
        className={creatingSite || error ? "cursor-not-allowed text-gray-400 bg-gray-50" : undefined}
      >
        {creatingSite ? <LoadingDots /> : "Create Profile"}
      </Button>

      <Toaster />
    </>
  );
};

