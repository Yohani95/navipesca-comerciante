import { forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium">
            {label}
          </label>
        )}
        <Input
          ref={ref}
          className={cn(
            "mt-1",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-muted-foreground text-xs">{helperText}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput' 