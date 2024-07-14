import NetLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  children: string;
}

const Link = ({ href, children }: Props) => {
  return (
    <NetLink href={href} passHref legacyBehavior>
      <RadixLink>{children}</RadixLink>
    </NetLink>
  );
};

export default Link;
