import { FormControl, FormLabel, Popover, PopoverContent, PopoverTrigger, Switch, Select, useColorMode } from "@chakra-ui/react";
import { ChevronUpIcon, GlobeIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useTimezoneSettings } from "../hooks/useTimezoneSettings";

export function TimezoneSwitcher() {
  const { colorMode } = useColorMode();

  const initialFocusRef = useRef<any>()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { settings, setSettings, timezones } = useTimezoneSettings();

  return (
    <Popover
      isOpen={popoverOpen}
      onOpen={() => { setPopoverOpen(true) }}
      onClose={() => { setPopoverOpen(false) }}
      initialFocusRef={initialFocusRef}
      closeOnBlur={false}
      placement="bottom-start"
      isLazy
    >
      <PopoverTrigger>
        <div className="flex flex-row items-center text-gray-500 cursor-pointer">
          <GlobeIcon height={16} />
          <div className="ml-1 text-base font-normal">{settings.timezone}</div>
          <ChevronUpIcon className={classNames("ml-1 mt-[1px]", popoverOpen ? "rotate-0" : "rotate-180")} height={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent bgColor={colorMode === 'dark' ? "#595959" : undefined} border={ colorMode === 'dark' ? "none" : undefined}>
        <div className="flex flex-col m-2">
          <div className="flex flex-row justify-between items-center">
            <div className="text-lg font-medium">Timezone</div>
            <div>
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='clock24hour' mb='0'>
                  12H
                </FormLabel>
                <Switch
                  id='clock24hour'
                  colorScheme={"green"}
                  isChecked={settings.clock24hour}
                  onChange={(event) => {
                    setSettings({ ...settings, clock24hour: event.target.checked })
                  }}
                />
                <FormLabel  htmlFor='clock24hour' ml='2' mb='0'>
                  24H
                </FormLabel>
              </FormControl>
            </div>
          </div>
          <div className="mt-2">
            <Select
              ref={initialFocusRef}
              value={settings.timezone}
              onChange={(event) => {
                setSettings((prev) => ({
                  ...prev,
                  timezone: event.target.value,
                }))
              }}
            >
              {timezones.map((i) => {
                return (
                  <option key={i.tzCode} value={i.tzCode}>{i.name}</option>
                )
              })}
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}