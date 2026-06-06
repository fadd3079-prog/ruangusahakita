import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const LOGO_WITH_TEXT = {
  src: "/logo/onlytypelogo.png",
  width: 10700,
  height: 1200,
};

const LOGO_MARK = {
  src: "/logo/logo%230C2949.png",
  width: 2370,
  height: 2232,
};

type AppLogoProps = {
  className?: string;
  href?: string | null;
  imageClassName?: string;
  priority?: boolean;
  showText?: boolean;
};

export function AppLogo({
  className,
  href = "/",
  imageClassName,
  priority = false,
  showText = true,
}: AppLogoProps) {
  const logo = showText ? LOGO_WITH_TEXT : LOGO_MARK;

  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={logo.src}
        alt="Ruang Usaha Kita"
        width={logo.width}
        height={logo.height}
        priority={priority}
        className={cn(
          "block object-contain",
          showText ? "h-7 w-auto sm:h-8" : "size-8",
          imageClassName,
        )}
      />
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="Beranda Ruang Usaha Kita">
      {content}
    </Link>
  );
}
