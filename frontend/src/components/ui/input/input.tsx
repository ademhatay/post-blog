import { forwardRef, useMemo, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { COLORS } from '@/lib/colors'
import './input.css'

type Size = 'sm' | 'md' | 'lg'
type Radius = 'none' | 'md' | 'rounded' | 'pill'
type Variant = 'default' | 'filled' | 'underline'

export type InputProps = {
  label?: string
  helperText?: string
  error?: string | boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: Size
  radius?: Radius
  variant?: Variant
  block?: boolean
  passwordToggle?: boolean
  className?: string
  wrapperClassName?: string
  style?: React.CSSProperties
} & InputHTMLAttributes<HTMLInputElement>

const makeVars = () => ({
  ['--input-bg' as any]: COLORS.ui.inputBg,
  ['--input-text' as any]: COLORS.ui.inputText,
  ['--input-border' as any]: COLORS.ui.inputBorder,
  ['--input-border-focus' as any]: COLORS.ui.inputBorderFocus,
})

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      radius = 'md',
      variant = 'default',
      block = true,
      passwordToggle = false,
      className = '',
      wrapperClassName = '',
      style,
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    const [show, setShow] = useState(false)
    const vars = useMemo(() => makeVars(), [])
    const rootClasses = [
      'input',
      size ? `input--${size}` : '',
      radius === 'rounded' ? 'input--rounded' : '',
      radius === 'pill' ? 'input--pill' : '',
      variant !== 'default' ? `input--${variant}` : '',
      leftIcon ? 'input--with-left' : '',
      (rightIcon || passwordToggle) ? 'input--with-right' : '',
      error ? 'input--error' : '',
      block ? 'w-full' : '',
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ')

    const controlType = type === 'password' && passwordToggle ? (show ? 'text' : 'password') : type

    return (
      <div className={rootClasses} style={{ ...(style || {}), ...(vars as React.CSSProperties) }}>
        {label ? <label className="input__label">{label}</label> : null}
        <div className="input__field">
          {leftIcon ? <span className="input__icon input__icon--left">{leftIcon}</span> : null}
          <input ref={ref} className={`input__control ${className}`} type={controlType} {...rest} />
          {passwordToggle && type === 'password' ? (
            <button type="button" className="input__icon input__icon--right input__toggle" onClick={() => setShow((s) => !s)}>
              {show ? 'Gizle' : 'Göster'}
            </button>
          ) : rightIcon ? (
            <span className="input__icon input__icon--right">{rightIcon}</span>
          ) : null}
        </div>
        {error ? <span className="input__error">{typeof error === 'string' ? error : 'Hatalı değer'}</span> : helperText ? <span className="input__helper">{helperText}</span> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
