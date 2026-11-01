import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Base(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  )
}

export function SunriseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v4M5.6 7.6l1.8 1.8M18.4 7.6l-1.8 1.8M3 14h2M19 14h2" />
      <path d="M7 17a5 5 0 0 1 10 0M3 17h18M6 21h12" />
    </Base>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </Base>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-1.8.8-3 1.8-4 .3 1.2 1 1.8 1.7 2 0-3 .5-5 1.5-8z" />
      <path d="M12 20a2 2 0 0 1-2-2c0-1.4 1.2-2 2-3.5.8 1.5 2 2.1 2 3.5a2 2 0 0 1-2 2z" />
    </Base>
  )
}

export function TempleBuildingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2v3M10.5 5h3l1 3h-5zM8.5 8h7l1 3.5h-9zM7 11.5h10l1 3.5H6zM5 15h14v6H5z" />
      <path d="M10.5 21v-3.5h3V21" />
    </Base>
  )
}

export function MeditationIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 8v5M8 11.5c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5" />
      <path d="M3 18c3 0 5-1.5 9-1.5S18 18 21 18M6 21h12" />
    </Base>
  )
}

export function MedalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.5l8 2.5v6c0 5-3.5 8.5-8 10.5C7.5 19.500 4 16 4 11V5z" />
      <path d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.300-2.400 1.300.5-2.600-1.900-1.800 2.600-.4z" />
    </Base>
  )
}

export function WavesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 8c2 0 2-1.500 4.500-1.500S10 8 12 8s2.500-1.500 4.500-1.500S19 8 21 8" />
      <path d="M3 13c2 0 2-1.500 4.500-1.500S10 13 12 13s2.500-1.500 4.500-1.500S19 13 21 13" />
      <path d="M3 18c2 0 2-1.500 4.500-1.500S10 18 12 18s2.500-1.500 4.500-1.500S19 18 21 18" />
    </Base>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 4c.6 3.600 2.400 5.400 6 6-3.600.6-5.400 2.400-6 6-.6-3.600-2.400-5.400-6-6 3.600-.6 5.400-2.400 6-6z" />
      <path d="M18 14c.3 1.800 1.200 2.700 3 3-1.800.3-2.700 1.200-3 3-.3-1.800-1.200-2.700-3-3 1.800-.3 2.700-1.200 3-3zM17 3v3M15.500 4.500h3" />
    </Base>
  )
}

export function SacredSymbolIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c3.500 0 6 2.600 6 5.800 0 2.300-1.300 3.900-3 4.700V15h-6v-1.500c-1.700-.8-3-2.400-3-4.700C6 5.600 8.500 3 12 3z" />
      <path d="M12 15v3M8 21h8M10 18h4" />
    </Base>
  )
}

export function GatheringIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="6.500" r="2.500" />
      <circle cx="5.500" cy="9.500" r="2" />
      <circle cx="18.500" cy="9.500" r="2" />
      <path d="M8 16c0-2.200 1.800-4 4-4s4 1.800 4 4v1.500H8zM2 17c0-1.800 1.500-3 3.500-3M22 17c0-1.800-1.500-3-3.500-3M3 21h18" />
    </Base>
  )
}

export function OfferingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 10.500c-2.800-1.700-4-3-4-4.500a2.500 2.500 0 0 1 4-2 2.500 2.500 0 0 1 4 2c0 1.500-1.200 2.800-4 4.500z" />
      <path d="M2 15.500h3.500l3 1.500h4.500a1.500 1.500 0 0 0 0-3h-3M8.500 15l4-1.500 5-2 3 2.500-6 5.500H8.500M2 14v7h3" />
    </Base>
  )
}

export function BathingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="16" cy="6" r="2" />
      <path d="M7 12.500l5-3 3.500 2.500M10 9.500 8 7M3 17c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1 1.500-1 3-1 1.500 1 3 1M3 21c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1 1.500-1 3-1 1.500 1 3 1" />
    </Base>
  )
}

export function PartyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 21 4.500-13 8.500 8.500z" />
      <path d="M10.500 13.500 8 16M14 5l.5-2M18 8l2-1M17 4l1.500-1.500M19 12.500l2 .5M14.500 9.500c1.500-1 3-.5 4 .5" />
    </Base>
  )
}

export function ShieldAtIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.500 20 5v6.500c0 4.800-3.400 8.200-8 10-4.600-1.800-8-5.200-8-10V5z" />
      <circle cx="12" cy="11.500" r="2.200" />
      <path d="M14.200 11.500v.8a1.500 1.500 0 0 0 3 0v-.8a5.200 5.200 0 1 0-2 4" />
    </Base>
  )
}

export function SendIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M21 3 3 10.500l7 3 3 7z" />
    </Base>
  )
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9.500" />
      <path d="M12 11v6M12 7.500v.01" />
    </Base>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9.500" />
      <path d="m8 12.500 3 3 5-6" />
    </Base>
  )
}

export function MailOutlineIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.500 7 8.500 6 8.500-6" />
    </Base>
  )
}

export function TrainIcon(props: IconProps) {
  return (
    <Base fill="currentColor" stroke="none" {...props}>
      <path d="M7 2h10a3 3 0 0 1 3 3v10a4 4 0 0 1-3 3.900L18.500 21h-2.200l-1.500-2h-5.600l-1.500 2H5.500L7 18.900A4 4 0 0 1 4 15V5a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v4h12V5a1 1 0 0 0-1-1zm-1 7v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4zm3 1.500a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400zm6 0a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400z" />
    </Base>
  )
}

export function PlaneIcon(props: IconProps) {
  return (
    <Base fill="currentColor" stroke="none" {...props}>
      <path d="M21 16v-2l-8-5V3.500a1.500 1.500 0 0 0-3 0V9l-8 5v2l8-2.500V19l-2 1.500V22l3.500-1 3.500 1v-1.500L13 19v-5.500z" />
    </Base>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
    </Base>
  )
}

export function NavigateRouteIcon(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <path d="M12 2.500 21.500 12 12 21.500 2.500 12z" />
      <path d="M8.500 14v-2.500a1.500 1.500 0 0 1 1.500-1.500h5M13 7.500l2.500 2.500-2.500 2.500" />
    </Base>
  )
}

export function MarkerTempleIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.800} {...props}>
      <path d="M12 2v2M10.500 4.500h3l1 2.500h-5zM8.500 7h7l1 3h-9zM7 10h10l1 3H6zM5 13h14v7H5z" />
      <path d="M10.500 20v-3h3v3" />
    </Base>
  )
}

export function DropletIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c3.500 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2.500-6 6-10z" />
    </Base>
  )
}

export function HangerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 8V6.500a2 2 0 1 1 2 2M12 8 3 15.500a1 1 0 0 0 .6 1.800h16.800a1 1 0 0 0 .6-1.800z" />
    </Base>
  )
}

export function HandIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 13V6a1.500 1.500 0 0 1 3 0v5M11 11V4.500a1.500 1.500 0 0 1 3 0V11M14 11V6a1.500 1.500 0 0 1 3 0v8a7 7 0 0 1-7 7c-3 0-4.500-1.500-6-4l-1.500-2.500a1.500 1.500 0 0 1 2.500-1.500L8 14" />
    </Base>
  )
}

export function WarningIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.500 2.500 20h19z" />
      <path d="M12 10v4.500M12 17.200v.01" />
    </Base>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9.500" />
      <path d="m15.500 8.500-2 5-5 2 2-5z" />
    </Base>
  )
}

export function ChecklistIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 6h9M3 12h6M3 18h9M15 14l5 5M20 14l-5 5M15 6.500l1.500 1.500 3-3" />
    </Base>
  )
}

export function LotusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4c2.500 2.500 3.500 5 3.500 7.500S14 17 12 19c-2-2-3.500-4-3.500-7.500S9.500 6.500 12 4z" />
      <path d="M8.500 11c-3 0-5 1.500-5.500 4 3 .5 5-.2 6.500-2M15.500 11c3 0 5 1.500 5.500 4-3 .5-5-.2-6.500-2M5 19.500c3 1.500 11 1.500 14 0" />
    </Base>
  )
}

export function PinOutlineIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s-7-5.700-7-11a7 7 0 0 1 14 0c0 5.300-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.500" />
    </Base>
  )
}

export function MapFoldIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 6 6-2.500 6 2.500 6-2.500v14.500L15 20.500 9 18l-6 2.500zM9 3.500V18M15 6v14.500" />
    </Base>
  )
}
