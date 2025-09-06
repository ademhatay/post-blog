import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { COLORS } from '@/lib/colors'
import './button.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
type Radius = 'none' | 'md' | 'rounded' | 'pill'

export type ButtonProps = {
  variant?: Variant
  size?: Size
  radius?: Radius
  block?: boolean
  loading?: boolean
  className?: string
  style?: React.CSSProperties
} & ButtonHTMLAttributes<HTMLButtonElement>

const makeVars = (variant: Variant) => {
  switch (variant) {
    case 'primary':
      return {
        ['--btn-bg' as any]: COLORS.ui.buttonPrimaryBg,
        ['--btn-bg-hover' as any]: COLORS.ui.buttonPrimaryHover,
        ['--btn-text' as any]: COLORS.ui.buttonPrimaryText,
        ['--btn-border' as any]: 'transparent',
      }
    case 'secondary':
      return {
        ['--btn-bg' as any]: COLORS.ui.buttonSecondaryBg,
        ['--btn-bg-hover' as any]: COLORS.ui.buttonSecondaryHover,
        ['--btn-text' as any]: COLORS.ui.buttonSecondaryText,
        ['--btn-border' as any]: 'transparent',
      }
    case 'outline':
      return {
        ['--btn-bg' as any]: 'transparent',
        ['--btn-bg-hover' as any]: COLORS.ui.background,
        ['--btn-text' as any]: COLORS.ui.inputText,
        ['--btn-border' as any]: COLORS.ui.inputBorderFocus,
      }
    case 'ghost':
    default:
      return {
        ['--btn-bg' as any]: 'transparent',
        ['--btn-bg-hover' as any]: COLORS.ui.surface,
        ['--btn-text' as any]: COLORS.ui.inputText,
        ['--btn-border' as any]: 'transparent',
      }
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      radius = 'md',
      block = false,
      loading = false,
      className = '',
      style,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const vars = makeVars(variant)
    const classes = [
      'btn',
      size ? `btn--${size}` : '',
      radius === 'rounded' ? 'btn--rounded' : '',
      radius === 'pill' ? 'btn--pill' : '',
      block ? 'btn--block' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        style={{ ...(style || {}), ...(vars as React.CSSProperties) }}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? '...' : children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

