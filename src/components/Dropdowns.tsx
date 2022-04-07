import { CheckCircleIcon } from "@heroicons/react/outline";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import { ComponentProps, forwardRef } from "react";
import { useAppColorMode, useColor } from "../hooks/useColorMode";

export const Dropdown = DropdownMenuPrimitive.Root;

type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuPrimitive["Trigger"]>;
export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className = "", ...props }, forwardedRef) => (
    <DropdownMenuPrimitive.Trigger
      {...props}
      className={
        props.asChild
          ? className
          : `inline-flex items-center rounded-sm bg-transparent px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-1 group-hover:text-black ${className}`
      }
      ref={forwardedRef}
    />
  )
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuTriggerItem = DropdownMenuPrimitive.TriggerItem;

type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive["Content"]>;
export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const {colorMode} = useAppColorMode()
    return (
      <DropdownMenuPrimitive.Content
        portalled={props.portalled}
        {...props}
        className={classNames(colorMode === 'dark' ? 'bg-neutral-700':'bg-white',`z-10 mt-1 -ml-0 w-48 origin-top-right rounded-sm text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`)}
        ref={forwardedRef}>
        {children}
      </DropdownMenuPrimitive.Content>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuPrimitive["Label"]>;
export const DropdownMenuLabel = (props: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label {...props} className="px-3 py-2 " />
);

type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuPrimitive["CheckboxItem"]>;
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className = "", ...props }, forwardedRef) => (
    <DropdownMenuPrimitive.Item
      className={`text-sm ${className}`}
      {...props}
      ref={forwardedRef}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

type DropdownMenuCheckboxItemProps = ComponentProps<typeof DropdownMenuPrimitive["CheckboxItem"]>;
export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem {...props} ref={forwardedRef}>
        {children}
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckCircleIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.CheckboxItem>
    );
  }
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

type DropdownMenuRadioItemProps = ComponentProps<typeof DropdownMenuPrimitive["RadioItem"]>;
export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.RadioItem {...props} ref={forwardedRef}>
        {children}
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckCircleIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.RadioItem>
    );
  }
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

export default Dropdown;
