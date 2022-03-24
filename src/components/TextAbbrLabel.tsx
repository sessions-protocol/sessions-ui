import { useMemo } from "react"

export interface TextAbbrLabelProps {
  text: string;
  front?: number;
  end?: number;
  className?: string;
  asText?: boolean;
}
export function TextAbbrLabel(props: TextAbbrLabelProps) {
  const abbrText = useMemo(() => {
    const front = props.front || 6
    const end = props.end || 6
    const maxLength = front + end
    if (!props.text) return ''
    if (props.text.length > maxLength) {
      return `${props.text.slice(0, front)}...${props.text.slice(props.text.length-end, props.text.length)}`
    } else {
      return props.text
    }
  }, [props.end, props.front, props.text])
  return props.asText ? (abbrText as any) : (
    <div className={props.className}>
      {abbrText}
    </div>
  )
}