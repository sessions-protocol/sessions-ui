import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { ConnectorList } from "@/web3/components/ConnectorList";
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import { TextAbbrLabel } from "../../../components/TextAbbrLabel";
import { useFormik } from "formik";

export function SessionBookFlow() {
  const { chainId, account, deactivate } = useWeb3React()
  const { params } = SessionBookPagePropsContext.usePageContext()

  const [profile, setProfile] = useState<{ username: string } | null>(null)

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      setProfile({ username: values.username })
    }
  });

  return (
    <div>
      <div className="text-left">
        {chainId && account && (
          <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 mb-2">
            <div className="text-xs dark:text-gray-300">Wallet Connected</div>
            <div className="flex flex-row items-center">
              <div className="text-sm"><TextAbbrLabel text={account} front={6} end={4} /></div>
            </div>
          </div>
        )}

        {profile && (
          <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 mb-2">
            <div className="text-xs dark:text-gray-300">Lens logged in</div>
            <div className="flex flex-row items-center">
              <div className="text-sm">{profile.username}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        {(!chainId || !account) && (
          <div>
            <div className="text-lg font-medium mb-4">Connect Wallet</div>
            <ConnectorList />
          </div>
        )}
        {chainId && account && !profile && (
          <div>
            <div className="text-lg font-medium mb-4">Create Lens Profile</div>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                </FormControl>
                <Button type="submit" colorScheme="green" isFullWidth>
                  Create
                </Button>
              </VStack>
            </form>
          </div>
        )}
        {chainId && account && profile && (
          <div>
            <div className="text-lg font-medium mb-4">Confirm Session Slot</div>
            <Button
              isFullWidth
              colorScheme={"green"}
              onClick={() => {
              }}
            >Book</Button>
          </div>
        )}
      </div>
    </div>

  );
}
