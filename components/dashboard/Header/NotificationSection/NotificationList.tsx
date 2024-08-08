"use client";

import PropTypes from "prop-types";

// material-ui
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { useTheme } from "@mui/material/styles";

interface ListItemWrapperProps {
  children: React.ReactNode;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "primary.light",
        },
      }}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node,
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
  const theme = useTheme();

  const { inboxNotifications } = useInboxNotifications();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt
  );

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 330,
        py: 0,
        borderRadius: "10px",
        [theme.breakpoints.down("md")]: {
          maxWidth: 300,
        },
        "& .MuiListItemSecondaryAction-root": {
          top: 22,
        },
        "& .MuiDivider-root": {
          my: 0,
        },
        "& .list-container": {
          pl: 7,
        },
      }}
    >
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
              <p className="py-2 text-center text-green-500 text-md">
                No new notifications
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className="bg-dark-200 text-white"
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
                    $documentAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Avatar
                              alt={
                                typeof props.inboxNotification.activities[0]
                                  .data.avatar === "string"
                                  ? props.inboxNotification.activities[0].data
                                      .avatar
                                  : ""
                              }
                              src={
                                typeof props.inboxNotification.activities[0]
                                  .data.avatar === "string"
                                  ? props.inboxNotification.activities[0].data
                                      .avatar
                                  : ""
                              }
                            />
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
      <Divider />
    </List>
  );
};

export default NotificationList;
