import { extendTheme, withDefaultProps, withDefaultSize } from "@chakra-ui/react";
export const colors = {
  bg: ["#f5f5f5", "#292929"],
  focusBd: ["black", "#eee"],
  strongBg: ["white", "neutral.900"],
  selectedBg: ["neutral.100", "neutral.800"],
  strongColor: ["black", "white"],
  secondaryColor: ["neutral.600", "neutral.400"],
  bd: ["neutral.300", "neutral.700"],
};
const color =
  ([light, dark]: string[]) =>
  ({ colorMode }: { colorMode: string }) =>
    colorMode === "dark" ? dark : light;
export const chakraTheme = extendTheme({
  components: {
    FormLabel: {
      baseStyle: {
        fontWeight: '600',
        fontSize: 14,
      }
    },
    Input: {
      // defaultProps: {
      //   focusBorderColor: "black",
      //   borderRadius: 0,
      // },
      // baseStyle: {
      //   borderRadius: 0,
      //   field: {
      //     borderRadius: 0,
      //     borderColor: "#4b4b4f",
      //     _hover: {
      //       borderColor: "black",
      //     },
      //   },
      // },
    },
    Modal: {
      baseStyle: (p: any) => ({
        dialog: {
          borderRadius: 2,
          bg: color(colors.strongBg)(p),
        },
      }),
    },
  },
  colors: {
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },
  styles: {
    global: (p: any) => ({
      "*": {
        borderColor: color(colors.bd)(p),
      },
      body: {
        bg: color(colors.bg)(p),
      },
    }),
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
});
