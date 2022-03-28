import { Button } from "@chakra-ui/button";
import {
  UserCircleIcon,
  SelectorIcon,
  ArrowLeftIcon,
  ClockIcon,
  LinkIcon
} from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import { useProfileValue } from '@/context/ProfileContext';
import { getProfilePictureSrc } from '@/lens/profile';
import Loader from './Loader'

import Logo from "@/assets/logo-dark.svg";
import FavIcon from "@/assets/favicon.svg";

import { TextAbbrLabel } from "./TextAbbrLabel";
import { useProfileState } from "../context/ProfileContext";
export default function Shell(props: {
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
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  const { profile } = useProfileValue();
  const profilePictureSrc = getProfilePictureSrc(profile);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [])

  const navigation = [
    {
      name: "Session Types",
      href: "/session-types",
      icon: LinkIcon,
      current: pathname.startsWith("/session-types"),
    },
    {
      name: 'Availability',
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
  ]
  if (loading) {
    return (
      <div className="absolute z-50 flex h-screen w-full items-center bg-gray-50">
        <Loader />
      </div>
    );
  }
  return (
    <div
      className={classNames("flex h-screen overflow-hidden text-left", props.large ? "bg-white" : "bg-gray-100")}
      data-testid="dashboard-shell">
      <div className="hidden md:flex lg:flex-shrink-0">
        <div className="flex w-14 flex-col lg:w-56">
          <div className="flex h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-4 lg:pt-5">
              <Link to="/session-types">
                <a className="block px-2">
                  <span className="inline lg:hidden">
                    <img className="mx-auto" alt="Sessions" title="Session" src={FavIcon} />
                  </span>
                  <span className="hidden lg:inline">
                    <img className="mx-auto" alt="Sessions" title="Session" src={Logo} />
                  </span>
                </a>
              </Link>
              {<nav className="mt-2 flex-1 space-y-1 bg-white px-2 lg:mt-5">
                {navigation.map((item) => (
                  <Fragment key={item.name}>
                    <Link to={item.href}>
                      <a
                        className={classNames(
                          item.current
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-500 hover:bg-gray-50 hover:text-neutral-900",
                          "group flex items-center rounded-sm px-2 py-2 my-2 rounded text-sm font-medium"
                        )}>
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-neutral-500"
                              : "text-neutral-400 group-hover:text-neutral-500",
                            "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                          )}
                          aria-hidden="true"
                        />
                        <span className="hidden lg:inline ml-2">{item.name}</span>
                      </a>
                    </Link>
                  </Fragment>
                ))}
              </nav>}
            </div>
            <div className="rounded-sm pb-2 pl-3 pt-2 pr-2 hover:bg-gray-100 lg:mx-2 lg:pl-2">
              <div className="text-left">
                {profile && (
                  <Fragment>
                    <Link to={'/profile'}>
                      <div
                        className={classNames(
                          "text-neutral-500 hover:bg-gray-50 hover:text-neutral-900",
                          "group flex-1 flex-shrink-1 flex justify-center items-center rounded-sm py-2 my-2 rounded text-sm font-medium"
                        )}>
                        {profilePictureSrc ? (
                          <img className="h-6 w-6 rounded-full" src={profilePictureSrc} />
                        ) : (
                          <UserCircleIcon
                            className={classNames(
                              "text-neutral-400 group-hover:text-neutral-500",
                              "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                            )}
                            aria-hidden="true"
                          />
                        )}

                        <div className="hidden lg:flex lg:flex-1">
                          <div className="ml-2 flex-1 flex flex-row items-center">
                            <div className="text-sm flex-1 flex-grow truncate">{profile.handle}</div>
                            <div><SelectorIcon
                              className={classNames(
                                "text-neutral-400 group-hover:text-neutral-500",
                                "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                              )}
                              aria-hidden="true"
                            /></div>
                          </div>

                        </div>

                      </div>
                    </Link>
                  </Fragment>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <main
          className={classNames(
            "relative z-0 flex-1 overflow-y-auto focus:outline-none",
            status === "authenticated" && "max-w-[1700px]",
            props.flexChildrenContainer && "flex flex-col"
          )}>
          {/* show top navigation for md and smaller (tablet and phones) */}

          <div
            className={classNames(
              props.centered && "mx-auto md:max-w-5xl",
              props.flexChildrenContainer && "flex flex-1 flex-col",
              !props.large && "py-8"
            )}>
            {!!props.backPath && (
              <div className="mx-3 mb-8 sm:mx-8">
                <Button
                  onClick={() => {
                    //TODO: back
                  }}
                  leftIcon={<ArrowLeftIcon />}
                  color="secondary">
                  Back
                </Button>
              </div>
            )}
            {props.heading && props.subtitle && (
              <div
                className={classNames(
                  props.large && "bg-gray-100 py-8 lg:mb-8 lg:pt-16 lg:pb-7",
                  "block min-h-[80px] justify-between px-4 sm:flex sm:px-6 md:px-8"
                )}>
                {props.HeadingLeftIcon && <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>}
                <div className="mb-8 w-full">
                  <h1 className="font-cal mb-1 text-xl font-bold capitalize tracking-wide text-gray-900">
                    {props.heading}
                  </h1>
                  <p className="min-h-10 text-sm text-neutral-500 ltr:mr-4 rtl:ml-4">{props.subtitle}</p>
                </div>
                {props.CTA && <div className="mb-4 flex-shrink-0">{props.CTA}</div>}
              </div>
            )}
            <div
              className={classNames(
                "px-4 sm:px-6 md:px-8",
                props.flexChildrenContainer && "flex flex-1 flex-col"
              )}>
              {props.children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
