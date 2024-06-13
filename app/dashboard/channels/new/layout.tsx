import { Theme } from "@radix-ui/themes";

export default function AddChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Theme>
        <main>{children}</main>
      </Theme>
    </section>
  );
}
