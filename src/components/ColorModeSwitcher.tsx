import { Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useAppColorMode } from "../hooks/useColorMode";

export function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useAppColorMode()

  return (
    <Button
      p={2}
      size="sm"
      variant="unstyled"
      onClick={() => { toggleColorMode() }}
    >
      {colorMode === "light" && (
        <SunIcon />
      )}
      {colorMode === "dark" && (
        <MoonIcon />
      )}
    </Button>
  )
}