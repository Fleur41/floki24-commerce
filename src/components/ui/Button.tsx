import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";
type Size = "regular" | "large";

type StyleProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

function buttonClassName(
  { variant = "primary", size = "regular", fullWidth }: StyleProps,
  extra?: string,
) {
  return [
    styles.button,
    styles[variant],
    size === "large" && styles.large,
    fullWidth && styles.fullWidth,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ComponentProps<"button"> & StyleProps;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth }, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...props} />;
}
