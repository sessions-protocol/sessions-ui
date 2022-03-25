import { ColorModeScript, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTailwindColorMode } from "../hooks/useTailwindColorMode";
import { TailwindColorModeScript } from "./TailwindColorModeScript";

export const APP_INITIAL_COLOR_MODE = "dark";

export function AppColorModeScript() {
  const { colorMode: chakraColorMode } = useColorMode()
  const { toggle: toggleTailwindColorMode, getStoredColorMode: getTailwindStoredColorMode } = useTailwindColorMode()

  useEffect(() => {
    const _colorMode = getTailwindStoredColorMode();
    if (!_colorMode || !(_colorMode === 'dark' || _colorMode === 'light')) {
      toggleTailwindColorMode(APP_INITIAL_COLOR_MODE)
    }
  }, [getTailwindStoredColorMode, toggleTailwindColorMode])

  return (
    <>
      <TailwindColorModeScript initialColorMode={APP_INITIAL_COLOR_MODE} />
      <ColorModeScript initialColorMode={APP_INITIAL_COLOR_MODE} />
    </>
  );
}