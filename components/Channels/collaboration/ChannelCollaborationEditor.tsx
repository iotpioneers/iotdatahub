"use client";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import React from "react";

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
import { UserAccessType } from "@/types";
import LoadingSpinner from "../../LoadingSpinner";

const ChannelCollaborationEditor = ({
  roomId,
  currentUserType,
  channelDescription,
}: {
  roomId: string;
  currentUserType: UserAccessType;
  channelDescription: string;
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

  function Placeholder({ channelDescription }: { channelDescription: string }) {
    return (
      <div className="editor-placeholder">
        {channelDescription || "Enter some rich text..."}
      </div>
    );
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="w-full mx-1">
        <div className="toolbar-wrapper flex justify-between">
          <ToolbarPlugin />
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {status === "not-loaded" || status === "loading" ? (
            <LoadingSpinner />
          ) : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={
                  <Placeholder channelDescription={channelDescription} />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === "editor" && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <ChannelComments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
};
export default ChannelCollaborationEditor;
