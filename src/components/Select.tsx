import classNames from "classnames";
import ReactSelect, { components, GroupBase, Props } from "react-select";
import { useAppColorMode } from "../hooks/useColorMode";


function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...props }: Props<Option, IsMulti, Group>) {
  const { colorMode } = useAppColorMode();
  const colors = {
    text: colorMode === "dark" ? "white" : "black",
    bg: colorMode === "light" ? "white" : "#292929",
    focusBd: colorMode === "light" ? "#63b3ed" : "#63b3ed",
    bd: colorMode === 'light' ? '#d4d4d4' : '#525252',
    active: colorMode === 'light' ? '#f8f8f8' : '#333'
  };
  return (
    <ReactSelect
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          neutral0: colors.bg,
          neutral20: colors.bd,
          neutral80: colors.text,
          primary: colors.focusBd,
          primary25: colors.active,
          primary50: colors.active,
        },
        borderRadius: 2,
      })}
      components={{
        ...components,
        IndicatorSeparator: () => null,
      }}
      className={classNames(
        " text-sm shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export default Select;
