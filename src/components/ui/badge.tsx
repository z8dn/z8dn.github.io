import * as React from 'react'
import { Slot as SlotPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 w-fit whitespace-nowrap shrink-0 font-mono font-medium uppercase text-xs tracking-[0.04em] transition-colors [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground [a&]:hover:text-accent',
        destructive: 'text-destructive',
        outline:
          'rounded-full border px-2.5 py-0.5 text-muted-foreground [a&]:hover:text-foreground [a&]:hover:border-foreground/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
