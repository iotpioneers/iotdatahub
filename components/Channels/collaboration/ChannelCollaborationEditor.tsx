"use client";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
} from "@liveblocks/react-lexical";

import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import { useThreads } from "@liveblocks/react/suspense";
import ChannelComments from "./ChannelComments";
import type { UserAccessType } from "@/types";
import { Typography } from "@mui/material";
import { LinearLoading } from "@/components/LinearLoading";
import { motion } from "framer-motion";

const ChannelCollaborationEditor = ({
  currentUserType,
}: {
  currentUserType: UserAccessType;
}) => {
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    nodes: [HeadingNode],
    onError: (error: Error) => {
      throw error;
    },
    theme: Theme,
    editable: currentUserType === "editor",
  });

  function Placeholder() {
    return (
      <div className="editor-placeholder">
        Enter some rich text to communicate with others
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary/5 border-primary/10 rounded-2xl p-6"
    >
      <LexicalComposer initialConfig={initialConfig}>
        <Typography variant="h4" sx={{ my: 2 }}>
          The collaboration room workspace{" "}
        </Typography>
        <div className="w-full mx-1">
          <div className="toolbar-wrapper flex justify-between">
            <ToolbarPlugin />
          </div>

          <div className="editor-wrapper flex flex-col lg:flex-row gap-6 items-start justify-start">
            {status === "not-loaded" || status === "loading" ? (
              <LinearLoading />
            ) : (
              <div className="editor-inner flex-1 relative mb-5 h-auto min-h-[400px] w-full max-w-[800px] shadow-md lg:mb-10 rounded-lg">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="editor-input h-full min-h-[400px] p-4 rounded-lg" />
                  }
                  placeholder={<Placeholder />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                {currentUserType === "editor" && <FloatingToolbarPlugin />}
                <HistoryPlugin />
                {/* <AutoFocusPlugin /> */}
              </div>
            )}

            <div className="flex-shrink-0 w-full lg:w-[350px]">
              <LiveblocksPlugin>
                <FloatingComposer className="w-full" />
                <FloatingThreads threads={threads} />
                <ChannelComments />
              </LiveblocksPlugin>
            </div>
          </div>
        </div>
      </LexicalComposer>
    </motion.div>
  );
};
export default ChannelCollaborationEditor;
