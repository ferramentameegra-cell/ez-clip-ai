import * as React from "react"

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find((child: any) => child?.type?.displayName === 'SelectTrigger');
  const content = childrenArray.find((child: any) => child?.type?.displayName === 'SelectContent');

  const selectedValue = React.useMemo(() => {
    if (!content || !value) return null;
    const contentChildren = React.Children.toArray((content as any).props.children);
    const selectedItem = contentChildren.find((item: any) => {
      return (item as any).props?.value === value;
    });
    return selectedItem ? (selectedItem as any).props?.children : null;
  }, [content, value]);

  // Atualizar ref quando o elemento for renderizado
  React.useEffect(() => {
    if (containerRef.current) {
      const button = containerRef.current.querySelector('button');
      if (button) {
        (triggerRef as any).current = button;
      }
    }
  }, [isOpen, selectedValue]);

  return (
    <div className="relative" ref={containerRef}>
      {trigger && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {React.cloneElement(trigger as React.ReactElement, {
            children: selectedValue || (trigger as any).props.children,
          } as any)}
        </div>
      )}
      {isOpen && content && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div
            ref={contentRef}
            className="absolute z-50"
            style={{
              top: triggerRef.current
                ? triggerRef.current.getBoundingClientRect().bottom + 4
                : 0,
              left: triggerRef.current
                ? triggerRef.current.getBoundingClientRect().left
                : 0,
              minWidth: triggerRef.current
                ? triggerRef.current.getBoundingClientRect().width
                : '200px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {React.cloneElement(content as React.ReactElement, {
              onItemClick: (itemValue: string) => {
                onValueChange?.(itemValue);
                setIsOpen(false);
              },
            } as any)}
          </div>
        </div>
      )}
    </div>
  );
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { id?: string }
>(({ className = "", children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
    {...props}
  >
    <span className="flex-1 text-left">{children}</span>
    <svg
      className="h-4 w-4 opacity-50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <span className="text-muted-foreground">{placeholder}</span>
)

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onItemClick?: (value: string) => void }
>(({ className = "", children, onItemClick, ...props }, ref) => {
  const childrenWithClick = React.Children.map(children, (child: any) => {
    if (child?.props?.value) {
      return React.cloneElement(child, {
        onClick: () => onItemClick?.(child.props.value),
      });
    }
    return child;
  });

  return (
    <div
      ref={ref}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-lg max-h-[300px] overflow-y-auto ${className}`}
      {...props}
    >
      {childrenWithClick}
    </div>
  );
})
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className = "", children, value, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"
