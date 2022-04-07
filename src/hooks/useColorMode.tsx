import { useColorMode } from "@chakra-ui/react";
import { mapValues, nth } from "lodash/fp";
import { useCallback } from "react";
import { colors } from "../styles/chakra";
import { useTailwindColorMode } from "./useTailwindColorMode";

export function useAppColorMode() {
  const { colorMode: chakraColorMode, setColorMode: toggleChakraColorMode } =
    useColorMode();
  const { toggle: toggleTailwindColorMode } = useTailwindColorMode();

  const toggleColorMode = useCallback(
    (colorMode?: "dark" | "light") => {
      const nextColorMode =
        colorMode || (chakraColorMode === "dark" ? "light" : "dark");
      toggleChakraColorMode(nextColorMode);
      toggleTailwindColorMode(nextColorMode);
    },
    [chakraColorMode, toggleChakraColorMode, toggleTailwindColorMode]
  );

  return { colorMode: chakraColorMode, toggleColorMode };
}

export function useColor<T extends string>(
  custom?: Record<T, [string, string]>
) {
  const { colorMode } = useColorMode();
  const i = colorMode === "light" ? 0 : 1;
  return mapValues(nth(i))({...colors, ...custom})
}
