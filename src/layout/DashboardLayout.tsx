import FavIcon from "@/assets/favicon.svg";
import LogoDark from "@/assets/logo-dark.svg";
import Logo from "@/assets/logo.svg";
import { useProfileValue } from "@/context/ProfileContext";
import { Button } from "@chakra-ui/button";
import { Box, Text } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  LinkIcon,
  SelectorIcon,
  UserCircleIcon
} from "@heroicons/react/solid";
import classNames from "classnames";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppColorMode, useColor } from "../hooks/useColorMode";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";

export default function DashboardLayout(props: {
  centered?: boolean;
  large?: boolean;
  title?: string;
  heading?: ReactNode;
  subtitle?: ReactNode;
  CTA?: ReactNode;
  children: ReactNode;
  HeadingLeftIcon?: ReactNode;
  backPath?: string; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
}) {
  const { pathname } = useLocation();
  const { profile } = useProfileValue();
  const profilePictureSrc = profile?.imageURI;
  const { strongBg, selectedBg, strongColor, secondaryColor } = useColor();
  const { colorMode } = useAppColorMode();
  const logo = colorMode === "light" ? LogoDark : Logo;

  const navigation = [
    {
      name: "Session Types",
      href: "/session-types",
      icon: LinkIcon,
      current: pathname.startsWith("/session-types"),
    },
    {
      name: "Availability",
      href: "/availability",
      icon: ClockIcon,
      current: pathname.startsWith("/availability"),
    },
    // {
    //   name: "settings",
    //   href: "/settings/profile",
    //   icon: CogIcon,
    //   current: pathname.startsWith("/settings"),
    // },
  ];
  return (
    <Box className={classNames("flex h-screen overflow-hidden text-left")}>
      <div className="hidden md:flex lg:flex-shrink-0">
        <Box className="flex w-14 flex-col lg:w-56" bg={strongBg}>
          <Box
            className={classNames(
              "flex h-0 flex-1 flex-col border-r",
              colorMode === "light" ? "" : "border-gray-700"
            )}
          >
            <div className="flex flex-1 flex-col overflow-y-auto pt-3 lg:pt-5">
              <Link to="/session-types" className="block px-2">
                <span className="inline lg:hidden">
                  <img
                    className="mx-auto"
                    alt="Sessions"
                    title="Session"
                    src={FavIcon}
                  />
                </span>
                <span className="hidden lg:inline">
                  <img
                    className="transform origin-left scale-75"
                    alt="Sessions"
                    title="Session"
                    src={logo}
                  />
                </span>
              </Link>
              <nav className="mt-2 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <Box
                      bg={item.current ? selectedBg : ""}
                      color={item.current ? strongColor : ""}
                      opacity={item.current ? 1 : 0.7}
                      _hover={{ bg: selectedBg, opacity: 0.9 }}
                      className={classNames(
                        "group flex items-center rounded-sm px-2 py-2 my-2 text-sm font-medium"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3 opacity-60"
                        )}
                        aria-hidden="true"
                      />
                      <span className="hidden lg:inline ml-2">{item.name}</span>
                    </Box>
                  </Link>
                ))}
              </nav>
            </div>
            <Box
              className="rounded-sm mb-4 pb-2 pl-3 pt-2 pr-2 lg:mx-2 lg:pl-3"
              _hover={{ bg: selectedBg, opacity: 1 }}
            >
              <div className="text-left">
                {profile && (
                  <Link to={"/profile"}>
                    <div
                      className={classNames(
                        "group flex-1 flex-shrink-1 flex justify-center items-center text-sm font-medium"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {profilePictureSrc ? (
                          <img
                            className="h-6 w-6 rounded-full"
                            src={profilePictureSrc}
                          />
                        ) : (
                          <UserCircleIcon
                            className={classNames(
                              "text-neutral-400 group-hover:text-neutral-500",
                              "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="hidden lg:flex ml-2 flex-row items-center flex-grow">
                        <div className="items-center justify-center flex-grow">
                          <span className="text-sm block max-w-24 overflow-hidden truncate">
                            {profile.handle}
                          </span>
                        </div>
                        <SelectorIcon
                          className={classNames(
                            "text-neutral-400 group-hover:text-neutral-500",
                            "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </Box>
          </Box>
        </Box>
      </div>
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <main
          className={classNames(
            "relative z-0 flex-1 overflow-y-auto focus:outline-none",
            props.flexChildrenContainer && "flex flex-col"
          )}
        >
          <nav className="flex items-center justify-between border-b px-4 md:hidden">
            <Link to="/session-types" className="block px-2">
              <img
                className="mx-auto transform scale-50 origin-left"
                alt="Sessions"
                title="Session"
                src={FavIcon}
              />
            </Link>
            <div className="flex items-center gap-3 self-center">
              <Box mr={2}>
                <ColorModeSwitcher />
              </Box>
              <Link to={"/profile"}>
                <div
                  className={classNames(
                    "group flex-1 flex-shrink-1 flex justify-center items-center text-sm font-medium"
                  )}
                >
                  <div className="flex-shrink-0">
                    {profilePictureSrc ? (
                      <img
                        className="h-6 w-6 rounded-full"
                        src={profilePictureSrc}
                      />
                    ) : (
                      <UserCircleIcon
                        className={classNames(
                          "text-neutral-400 group-hover:text-neutral-500",
                          "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </nav>

          <div
            className={classNames(
              props.centered && "mx-auto md:max-w-5xl",
              props.flexChildrenContainer && "flex flex-1 flex-col",
              "py-8"
            )}
          >
            {!!props.backPath && (
              <div className="mx-3 mb-8 sm:mx-8">
                <Button
                  onClick={() => {
                    //TODO: back
                  }}
                  leftIcon={<ArrowLeftIcon />}
                  color="secondary"
                >
                  Back
                </Button>
              </div>
            )}
            {props.heading && props.subtitle && (
              <div
                className={classNames(
                  "block min-h-[80px] justify-between px-4 sm:flex sm:px-6 md:px-8"
                )}
              >
                {props.HeadingLeftIcon && (
                  <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>
                )}
                <div className="mb-8 w-full">
                  <Text color={strongColor} className="font-cal mb-1 text-xl font-bold capitalize tracking-wide">
                    {props.heading}
                  </Text>
                  <Text color={secondaryColor} className="min-h-10 text-sm opacity-60 ltr:mr-4 rtl:ml-4">
                    {props.subtitle}
                  </Text>
                </div>
                {props.CTA && (
                  <div className="mb-4 flex-shrink-0">{props.CTA}</div>
                )}
              </div>
            )}
            <div
              className={classNames(
                "px-4 sm:px-6 md:px-8",
                props.flexChildrenContainer && "flex flex-1 flex-col"
              )}
            >
              {props.children}
            </div>
            <nav className="md:hidden fixed bottom-0 z-30 flex w-full shadow">
              {navigation.map((item) => (
                <Link
                  to={item.href}
                  key={item.name}
                  className={classNames(
                    "border-t group relative min-w-0 flex-1 overflow-hidden text-center text-xs font-medium focus:z-10 sm:text-sm"
                  )}
                >
                  <Box
                    bg={strongBg}
                    opacity={item.current ? 1 : 0.5}
                    className={classNames("p-2")}
                    color={item.current ? strongColor : ""}
                  >
                    <item.icon
                      className={classNames(
                        "mx-auto mb-1 block h-5 w-5 flex-shrink-0 text-center"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </Box>
                </Link>
              ))}
            </nav>
          </div>
        </main>
      </div>
      <div className="fixed right-3 md:block hidden bottom-3">
        <ColorModeSwitcher />
      </div>
    </Box>
  );
}
