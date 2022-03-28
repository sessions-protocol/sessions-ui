import { ColorModeScript, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTailwindColorMode } from "../hooks/useTailwindColorMode";
import { TailwindColorModeScript } from "./TailwindColorModeScript";

export const APP_INITIAL_COLOR_MODE = "dark";

export function AppColorModeScript() {
  const { colorMode: chakraColorMode } = useColorMode()
  const { toggle: toggleTailwindColorMode } = useTailwindColorMode()

  useEffect(() => {
    toggleTailwindColorMode(chakraColorMode)
  }, [chakraColorMode, toggleTailwindColorMode])

  return (
    <>
      <TailwindColorModeScript initialColorMode={APP_INITIAL_COLOR_MODE} />
      <ColorModeScript initialColorMode={APP_INITIAL_COLOR_MODE} />
    </>
  );
}