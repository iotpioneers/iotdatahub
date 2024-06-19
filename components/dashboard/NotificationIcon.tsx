import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  HoverCard,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
} from "@radix-ui/themes";

const NotificationIcon = () => {
  return (
    <IconButton color="crimson" variant="ghost">
      <HoverCard.Root>
        <HoverCard.Trigger>
          <BellIcon className="h-6 w-6 text-gray-500" />
        </HoverCard.Trigger>
        <HoverCard.Content maxWidth="300px">
          <Flex gap="4">
            <Avatar size="3" fallback="R" radius="full" src="/person-4.png" />
            <Box>
              <Heading size="3" as="h3">
                Emmanuel
              </Heading>
              <Text as="div" size="2" color="gray" mb="2">
                emashyirambere1@gmail.com
              </Text>
              <Text as="div" size="2">
                Hey, you got a new message
              </Text>
            </Box>
          </Flex>
        </HoverCard.Content>
      </HoverCard.Root>
    </IconButton>
  );
};

export default NotificationIcon;
