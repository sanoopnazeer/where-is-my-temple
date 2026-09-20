import type { SVGProps } from 'react'

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  )
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </IconBase>
  )
}

export function ShirtIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M8 3 4 7l3 3v11h10V10l3-3-4-4-2 2h-4z" />
    </IconBase>
  )
}

export function RuleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="12" y1="11" x2="12" y2="16" />
    </IconBase>
  )
}

export function BusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M3 11h18" />
      <circle cx="7.5" cy="19" r="1.5" />
      <circle cx="16.5" cy="19" r="1.5" />
    </IconBase>
  )
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 21s-7-5.686-7-11a7 7 0 0 1 14 0c0 5.314-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  )
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  )
}

export function DirectionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </IconBase>
  )
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </IconBase>
  )
}

export function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <line x1="9" y1="7" x2="9" y2="7.01" />
      <line x1="15" y1="7" x2="15" y2="7.01" />
      <line x1="9" y1="11" x2="9" y2="11.01" />
      <line x1="15" y1="11" x2="15" y2="11.01" />
      <line x1="9" y1="15" x2="9" y2="15.01" />
      <line x1="15" y1="15" x2="15" y2="15.01" />
      <path d="M10 21v-4h4v4" />
    </IconBase>
  )
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </IconBase>
  )
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </IconBase>
  )
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.2 10.8 15.8 7M8.2 13.2l7.6 3.8" />
    </IconBase>
  )
}

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7 9.5 4h5L16 7" />
      <circle cx="12" cy="13.5" r="3.5" />
    </IconBase>
  )
}

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M10 14a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1" />
    </IconBase>
  )
}

export function ShieldCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  )
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.5 6.5 2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </IconBase>
  )
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  )
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M5 20c9 0 14-5 14-14 0-1 0-2-.2-3C10 3.5 5 8.5 5 17c0 1 0 2 .2 3z" />
      <path d="M6 19C10 15 14 11 18.5 6.5" />
    </IconBase>
  )
}
