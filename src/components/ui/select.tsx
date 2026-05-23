import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean;
    label?: string;
  }
>(({ className, children, error, label, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const isCompact = className?.includes('h-8') || className?.includes('h-10');
  
  return (
    <div className="flex w-full flex-col gap-2">
      {label && !isCompact && (
        <span
          className={cn(
            "ml-1 text-[13px] font-medium leading-none text-[#454745]",
            error && "text-red-500",
            isFocused && !error && "text-blue-600",
          )}
        >
          {label}
        </span>
      )}
      <div className="relative">
        <SelectPrimitive.Trigger
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "flex items-center justify-between rounded-full border border-gray-300 bg-white transition-all duration-200",
            "text-gray-900 placeholder:text-gray-400",
            "outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            "data-[placeholder]:text-gray-400",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            isCompact ? "h-8 px-3 text-[13px]" : "h-14 px-8 text-base",
            className,
          )}
          {...props}
        >
          <div className="truncate flex-1 text-left">
            {children}
          </div>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className={cn("text-[#9A9A9A] opacity-70 flex-shrink-0", isCompact ? "h-3.5 w-3.5 ml-1" : "h-5 w-5")} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>
    </div>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[9999] max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
        "rounded-2xl border border-gray-200 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-2",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-2",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-xl py-3 pl-10 pr-4 text-sm text-[#101828]",
      "outline-none transition-colors",
      "focus:bg-blue-50 focus:text-blue-700",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-3.5 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-blue-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#ECECEC]", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/** Wrapper with label support */
interface LabeledSelectProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const LabeledSelect = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled,
  error,
  className,
}: LabeledSelectProps) => {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="flex flex-col gap-2 w-full mb-5">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn(className)} error={!!error} label={label} value={value}>
          <span
            className={cn(
              "block truncate text-left",
              selectedLabel ? "text-[#101828]" : "text-gray-400",
            )}
          >
            {selectedLabel || placeholder}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value || "__empty__"}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[12px] text-red-500 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Pill variant select — Refined with balanced padding and precise label positioning */
const PillSelect = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled,
  error,
  className
}: LabeledSelectProps) => {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="flex flex-col gap-2 w-full mb-5">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn(className)} error={!!error} label={label} value={value}>
          <span
            className={cn(
              "block truncate text-left",
              selectedLabel ? "text-[#101828]" : "text-gray-400",
            )}
          >
            {selectedLabel || placeholder}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value || "__empty__"}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[12px] text-red-500 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  LabeledSelect,
  PillSelect,
};
