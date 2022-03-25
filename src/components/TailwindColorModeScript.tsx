import { useEffect } from "react";
import { useTailwindColorMode } from "../hooks/useTailwindColorMode";


export interface TailwindColorModeScriptProps {
  initialColorMode: 'dark' | 'light';
}
export function TailwindColorModeScript(props: TailwindColorModeScriptProps) {

  const { getStoredColorMode, toggle } = useTailwindColorMode();

  useEffect(() => {
    const _colorMode = getStoredColorMode();
    if (!_colorMode || !(_colorMode === 'dark' || _colorMode === 'light')) {
      toggle(props.initialColorMode)
    }
  }, [getStoredColorMode, props.initialColorMode, toggle])

  return null;
}