import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

interface ListItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string;
  href?: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  (props, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={classNames("ListItemLink", props.className)}
          {...props}
          ref={forwardedRef}
        >
          <div className="ListItemHeading">{props.title}</div>
          <p className="ListItemText">{props.children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
);

const NavigationMenuLinks = () => {
  return (
    <div className="lg:w-full lg:block hidden my-5">
      <NavigationMenu.Root className="NavigationMenuRoot">
        <NavigationMenu.List className="NavigationMenuList">
          {/* Developers Section */}
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Developers <CaretDownIcon className="CaretDown" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List one">
                <ListItem title="Tech Support" href="/tech-support">
                  Get assistance with technical issues.
                </ListItem>
                <ListItem
                  title="Developer Resources"
                  href="/developer-resources"
                >
                  Explore resources for developers.
                </ListItem>
                <ListItem title="Documentation" href="/documentation">
                  Access API and user documentation.
                </ListItem>
                <ListItem title="Featured Hardware" href="/featured-hardware">
                  Discover featured IoT hardware.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          {/* Enterprise Section */}
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Enterprise <CaretDownIcon className="CaretDown" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List one">
                <ListItem title="HVAC" href="/hvac">
                  Manage HVAC systems efficiently.
                </ListItem>
                <ListItem title="Smart Farming" href="/smart-farming">
                  Optimize agricultural processes.
                </ListItem>
                <ListItem title="Smart Cities" href="/smart-cities">
                  Implement IoT solutions in urban environments.
                </ListItem>
                <ListItem title="Smart Home" href="/smart-home">
                  Enhance home automation with IoT.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          {/* Features Section */}
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Features <CaretDownIcon className="CaretDown" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List two">
                <ListItem title="Channels" href="/channels">
                  Manage and configure IoT device channels.
                </ListItem>
                <ListItem title="Devices" href="/devices">
                  View and manage IoT devices.
                </ListItem>
                <ListItem title="API Keys" href="/api-keys">
                  Generate and manage API keys for secure access.
                </ListItem>
                <ListItem title="Data Visualization" href="/data-visualization">
                  Visualize and analyze IoT data.
                </ListItem>
                <ListItem title="Analytics" href="/analytics">
                  Perform analytics on IoT data points.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          {/* Company Section */}
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Company <CaretDownIcon className="CaretDown" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List one">
                <ListItem title="About Us" href="/about-us">
                  Learn more about our company.
                </ListItem>
                <ListItem title="Blogs" href="/blogs">
                  Read our latest blogs and updates.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          {/* Pricing Section */}
          <NavigationMenu.Item>
            <NavigationMenu.Link className="NavigationMenuLink" href="/pricing">
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <div className="ViewportPosition">
          <NavigationMenu.Viewport className="NavigationMenuViewport" />
        </div>
      </NavigationMenu.Root>
    </div>
  );
};

export default NavigationMenuLinks;
