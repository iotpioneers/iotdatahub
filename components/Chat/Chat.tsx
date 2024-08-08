"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  ScrollArea,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ask me anything" },
    { sender: "user", text: "Hello" },
  ]);

  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="soft">
            <ChatBubbleLeftIcon width="16" height="16" />
            Need help or support?
          </Button>
        </Popover.Trigger>
        <Popover.Content width="400px">
          <Grid gap="5">
            <Box flexGrow="1">
              <ScrollArea
                type="always"
                scrollbars="vertical"
                style={{ height: 280 }}
              >
                <Box p="2" pr="4">
                  <Flex direction="column" gap="4">
                    {messages.map((message, index) => (
                      <Text
                        key={index}
                        as="p"
                        className={`border rounded-md p-3 ${
                          message.sender === "bot" ? "mr-16" : "ml-16"
                        }`}
                      >
                        {message.text}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </ScrollArea>
            </Box>
            <Flex gap="3">
              <Box flexGrow="1">
                <TextArea
                  placeholder="Write a message…"
                  style={{ height: 20 }}
                />
                <Flex gap="3" mt="3" justify="between">
                  <Button size="1">Send</Button>
                </Flex>
              </Box>
            </Flex>
          </Grid>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default Chat;
