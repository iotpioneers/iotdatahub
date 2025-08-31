import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Define an interface for the component's props
interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  shadow?: string | number;
  sx?: object;
  title?: React.ReactNode;
  elevation?: number;
  className?: string;
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = false,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      darkTitle,
      secondary,
      shadow,
      title,
      elevation,
      className,
      ...others
    },
    ref,
  ) => {
    const cardStyles = cn(
      "transition-shadow duration-200",
      {
        border: border,
        "border-none": !border,
        "shadow-sm hover:shadow-md": boxShadow && !elevation,
        ...(typeof elevation === "number"
          ? {
              [`shadow-[0_${elevation}px_${elevation * 2}px_rgba(0,0,0,0.1)]`]:
                true,
            }
          : {}),
      },
      className,
    );

    return (
      <Card ref={ref} className={cardStyles} {...others}>
        {/* card header and action */}
        {title && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle
                className={cn(
                  darkTitle ? "text-2xl font-bold" : "text-lg font-medium",
                )}
              >
                {title}
              </CardTitle>
              {secondary && <div>{secondary}</div>}
            </div>
          </CardHeader>
        )}

        {/* content & header divider */}
        {title && <Separator />}

        {/* card content */}
        {content && (
          <CardContent className={cn("pt-6", contentClass)}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  },
);

MainCard.displayName = "MainCard";

export default MainCard;
