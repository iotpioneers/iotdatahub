"use client";

import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListItemWrapperProps {
  children: React.ReactNode;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children }) => {
  return (
    <div className="p-2 border-b cursor-pointer hover:bg-secondary/50">
      {children}
    </div>
  );
};

const NotificationList = () => {
  const { inboxNotifications } = useInboxNotifications();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt,
  );

  return (
    <div className="w-full max-w-[400px] rounded-md">
      <ListItemWrapper>
        <LiveblocksUIConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-green-500 text-sm">
                No new notifications
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className="flex items-center gap-4 rounded-[10px] mb-2 hover:bg-secondary/50"
                  href={`/dashboard/channels/${notification.roomId}`}
                  showActions={false}
                  kinds={{
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showActions={false}
                        showRoomName={false}
                      />
                    ),
                    textMention: (props) => (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    ),
                    $channelRoomAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Avatar>
                              <AvatarImage
                                src={
                                  typeof props.inboxNotification.activities[0]
                                    .data.avatar === "string"
                                    ? props.inboxNotification.activities[0].data
                                        .avatar
                                    : ""
                                }
                              />
                              <AvatarFallback>
                                {props.inboxNotification.activities[0].data
                                  .title !== undefined
                                  ? String(
                                      props.inboxNotification.activities[0].data
                                        .title,
                                    )
                                      .charAt(0)
                                      .toUpperCase()
                                  : "A"}
                              </AvatarFallback>
                            </Avatar>
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    ),
                  }}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </ListItemWrapper>
    </div>
  );
};

export default NotificationList;
