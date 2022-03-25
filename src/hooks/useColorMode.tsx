import { useColorMode } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTailwindColorMode } from "./useTailwindColorMode";

export function useAppColorMode() {
  const { colorMode: chakraColorMode, setColorMode: toggleChakraColorMode } = useColorMode()
  const { toggle: toggleTailwindColorMode } = useTailwindColorMode()

  const toggleColorMode = useCallback((colorMode?: 'dark' | 'light') => {
    const nextColorMode = colorMode || (chakraColorMode === 'dark' ? 'light' : 'dark')
    toggleChakraColorMode(nextColorMode)
    toggleTailwindColorMode(nextColorMode)
  }, [chakraColorMode, toggleChakraColorMode, toggleTailwindColorMode])

  return { colorMode: chakraColorMode, toggleColorMode }
}