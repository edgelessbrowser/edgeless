import { JSX } from 'solid-js/jsx-runtime'

interface PanelBorderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  active: boolean
}

export default function PanelBorder(props: PanelBorderProps) {
  return (
    <div
      class={`
        w-full h-full border p-[1px] rounded-md 
        ${props.active ? ' border-slate-400' : ' border-slate-500/50'}
      `}
    >
      {props.children}
    </div>
  )
}
