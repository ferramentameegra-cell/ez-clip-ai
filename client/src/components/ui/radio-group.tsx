import * as React from "react"

export interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({});

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, children, className = "" }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  id?: string
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className = "", value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const checked = context.value === value;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (context.onValueChange) {
        context.onValueChange(e.target.value);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <input
        type="radio"
        ref={ref}
        value={value}
        id={id}
        checked={checked}
        onChange={handleChange}
        className={`h-4 w-4 border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"
