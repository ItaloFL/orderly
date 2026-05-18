import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 border",
        isActive
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          : "border-white/[0.06] bg-transparent text-white/40 hover:bg-white/[0.05] hover:text-white/70",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <button
      aria-label="Go to previous page"
      className={cn(
        "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium border transition-all duration-200",
        "border-white/[0.06] bg-transparent text-white/40 hover:bg-white/[0.05] hover:text-white/70",
        "disabled:pointer-events-none disabled:opacity-30",
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon size={15} />
      <span className="hidden sm:block">Anterior</span>
    </button>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <button
      aria-label="Go to next page"
      className={cn(
        "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium border transition-all duration-200",
        "border-white/[0.06] bg-transparent text-white/40 hover:bg-white/[0.05] hover:text-white/70",
        "disabled:pointer-events-none disabled:opacity-30",
        className,
      )}
      {...props}
    >
      <span className="hidden sm:block">Próximo</span>
      <ChevronRightIcon size={15} />
    </button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center text-white/20",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon size={15} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
