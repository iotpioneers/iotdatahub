import * as React from "react";
import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import { TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

type Color = "blue" | "green";

type ExtendedTreeItemProps = {
  color?: Color;
  id: string;
  label: string;
  href?: string;
};

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: "1",
    label: "Dashboard",
    children: [
      { id: "1.1", label: "Overview", color: "green", href: "/dashboard" },
      {
        id: "1.2",
        label: "Device Management",
        color: "green",
        href: "/dashboard/devices",
      },
      {
        id: "1.3",
        label: "Channels",
        color: "green",
        href: "/dashboard/channels",
      },
      {
        id: "1.4",
        label: "Organization Management",
        color: "green",
        href: "/dashboard/organization",
      },
      {
        id: "1.5",
        label: "Upgrade Management",
        color: "green",
        href: "/dashboard/subscription",
      },
      {
        id: "1.6",
        label: "Account Management",
        children: [
          {
            id: "1.6.1",
            label: "Settings",
            color: "blue",
            href: "/dashboard/settings",
          },
          {
            id: "1.6.2",
            label: "Profile",
            color: "blue",
            href: "/dashboard/account",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Administartion Management",
    children: [
      { id: "2.1", label: "Overview", color: "green", href: "/admin" },
      {
        id: "2.2",
        label: "User Management",
        color: "green",
        href: "/admin/users",
      },
      {
        id: "2.3",
        label: "Pricing Management",
        color: "green",
        href: "/admin/pricing",
      },
    ],
  },
  { id: "3", label: "Settings", color: "blue" },
  { id: "4", label: "Help & Support", color: "blue" },
];

function DotIcon({ color }: { color: string }) {
  return (
    <Box sx={{ marginRight: 1, display: "flex", alignItems: "center" }}>
      <svg width={6} height={6}>
        <circle cx={3} cy={3} r={3} fill={color} />
      </svg>
    </Box>
  );
}

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

interface CustomLabelProps {
  children: React.ReactNode;
  color?: Color;
  expandable?: boolean;
  href?: string;
}

function CustomLabel({
  color,
  expandable,
  children,
  href,
  ...other
}: CustomLabelProps) {
  const theme = useTheme();
  const colors = {
    blue: theme.palette.primary.main,
    green: theme.palette.success.main,
  };

  const iconColor = color ? colors[color] : null;

  const router = useRouter();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (href) {
      router.push(href);
    }
  };

  return (
    <TreeItem2Label
      {...other}
      sx={{ display: "flex", alignItems: "center" }}
      onClick={handleClick}
    >
      {iconColor && <DotIcon color={iconColor} />}
      <Typography
        className="labelText"
        variant="body2"
        sx={{ color: "text.primary" }}
      >
        {children}
      </Typography>
    </TreeItem2Label>
  );
}

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const color = item?.color;
  const href = item?.href;

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <TreeItem2Content
          {...getContentProps({
            className: clsx("content", {
              expanded: status.expanded,
              selected: status.selected,
              focused: status.focused,
              disabled: status.disabled,
            }),
          })}
        >
          {status.expandable && (
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
          )}

          <CustomLabel {...getLabelProps({ color, href })} />
        </TreeItem2Content>
        {children && (
          <TransitionComponent
            {...getGroupTransitionProps({ className: "groupTransition" })}
          />
        )}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export default function CustomizedTreeView() {
  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Platform Navigation
        </Typography>
        <RichTreeView
          items={ITEMS}
          aria-label="platform-navigation"
          multiSelect
          defaultExpandedItems={["1", "1.1"]}
          defaultSelectedItems={["1.1", "1.4.1"]}
          sx={{
            m: "0 -8px",
            pb: "8px",
            height: "fit-content",
            flexGrow: 1,
            overflowY: "auto",
          }}
          slots={{ item: CustomTreeItem }}
        />
      </CardContent>
    </Card>
  );
}
