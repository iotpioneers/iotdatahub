import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";
import { cn } from "@/lib/utils";
import type { ThreadWrapperProps } from "@/types";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "comment-thread border rounded-lg",
        isActive && "!border-blue-500 shadow-md",
        thread.resolved && "opacity-40"
      )}
    />
  );
};

const ChannelComments = () => {
  const { threads } = useThreads();

  return (
    <div className="space-y-4 p-4">
      <Composer className="comment-composer rounded-lg" />

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default ChannelComments;
