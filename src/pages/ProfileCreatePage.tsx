import LoadingDots from "@/components/app/loading-dots";
import { useProfileState } from '@/context/ProfileContext';
import { SessionLayout } from '@/layout/SessionLayout';
import { ConnectorList } from '@/web3/components/ConnectorList';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ClipboardCheckIcon } from '@heroicons/react/solid';
import { useWeb3React } from '@web3-react/core';
import { FunctionComponent, useRef, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/SessionApi';



export function ProfileCreatePage() {
  const { chainId, account, deactivate, library } = useWeb3React();
  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="SessionScheduled transition-all duration-500 ease-in-out">
            <div className="flex flex-col text-center p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px] min-w-[480px]">
              <div className="flex flex-row items-center my-4 pb-4 mx-4 border-b border-gray-200 dark:border-gray-600">
                <div className="rounded-full h-14 w-14 flex items-center justify-center" style={{
                  backgroundColor: "rgba(42, 183, 132, 0.2)"
                }}>
                  <ClipboardCheckIcon className="text-green-500 mx-auto inline-block h-10 w-10" style={{
                    lineHeight: 0,
                  }} />
                </div>
                <h2 className="ml-4 text-left flex-1 font-bold text-2xl text-gray-700 dark:text-gray-200">
                  Create New Profile
                </h2>
              </div>

              <div className="flex flex-col text-center h-full px-4 pb-4">
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
        </div>
      </div>
    </SessionLayout>
  );
}


const CreateProfileView: FunctionComponent = () => {
  const [profileState, setProfileState] = useProfileState();

  const [creating, setCreating] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [profileError, setProfileError] = useState<string | null>(null);

  const profileHandleRef = useRef<HTMLInputElement | null>(null);
  const profilePictureRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  async function onSubmitProfile() {
    try {
      if (!profileHandleRef.current) {
        throw new Error("Missing required HANDLE");
      }
      // create profile
      const res = await sessionApi.createUserProfile(profileHandleRef.current.value, profilePictureRef.current?.value);
      console.log("profile created", res);
      // query profile
      const profile = await sessionApi.getProfileByHandle(profileHandleRef.current?.value)
      setProfileState({ profile });
      navigate("/session-types");
    } catch (e: any) {
      console.log("create profile error", e);
      if (e.message === "HANDLE_TAKEN") {
        setProfileError(name);
        setCreating(false);
      } else {
        toast.error("Failed to Create Profile", e.message);
        setCreating(false);
      }

      return;
    }
  }

  return (
    <>
      <div className="mb-6 grid gap-y-4">

        <FormControl>
          <FormLabel htmlFor='profile-input-handle'><span className='text-sm opacity-80'>HANDLE</span></FormLabel>
          <Input id='profile-input-handle' placeholder="your unique handle" ref={profileHandleRef} onInput={() => setName(profileHandleRef.current!.value)} />
        </FormControl>

        {profileError && (
          <p className="px-5 text-left text-red-500">
            Profile <b>{profileError}</b> has already been taken, please try
            another one.
          </p>
        )}

        <FormControl>
          <FormLabel htmlFor='profile-input-picture'><span className='text-sm opacity-80'>PROFILE PICTURE</span></FormLabel>
          <Input id='profile-input-picture' placeholder="https://cc0.crypto.punks/lol.jpg" ref={profilePictureRef} />
        </FormControl>

      </div>

      <Button
        isFullWidth
        colorScheme={"green"}
        onClick={() => {
          setCreating(true);
          onSubmitProfile();
        }}
        disabled={creating}
        className={creating ? "cursor-not-allowed text-gray-400 bg-gray-50" : undefined}
      >
        {creating ? <LoadingDots /> : "Create Profile"}
      </Button>

      <Toaster />
    </>
  );
};

