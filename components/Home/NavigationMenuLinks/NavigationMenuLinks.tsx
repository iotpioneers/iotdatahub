"use client";

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
  ({ className, title, children, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={classNames("ListItemLink", className)}
          {...props}
          ref={forwardedRef}
        >
          <div className="ListItemHeading text-orange-50">{title}</div>
          <p className="ListItemText">{children}</p>
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
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger text-orange-50">
              Developers{" "}
              <CaretDownIcon className="CaretDown text-orange-50" aria-hidden />
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
                <ListItem title="Documentation" href="#">
                  Access API and user documentation.
                </ListItem>
                <ListItem
                  title="Featured Hardware"
                  href="https://iotpioneersshop.com/"
                >
                  Discover featured IoT hardware.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger text-orange-50">
              Enterprise <CaretDownIcon className="CaretDown cc" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List one">
                <ListItem title="HVAC" href="#">
                  Manage HVAC systems efficiently.
                </ListItem>
                <ListItem title="Smart Farming" href="#">
                  Optimize agricultural processes.
                </ListItem>
                <ListItem title="Smart Cities" href="#">
                  Implement IoT solutions in urban environments.
                </ListItem>
                <ListItem title="Smart Home" href="#">
                  Enhance home automation with IoT.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger text-orange-50">
              Features{" "}
              <CaretDownIcon className="CaretDown text-orange-50" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List two">
                <ListItem title="Channels" href="#">
                  Manage and configure IoT device channels.
                </ListItem>
                <ListItem title="Devices" href="#">
                  View and manage IoT devices.
                </ListItem>
                <ListItem title="API Keys" href="#">
                  Generate and manage API keys for secure access.
                </ListItem>
                <ListItem title="Data Visualization" href="#">
                  Visualize and analyze IoT data.
                </ListItem>
                <ListItem title="Analytics" href="#">
                  Perform analytics on IoT data points.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger text-orange-50">
              Company{" "}
              <CaretDownIcon className="CaretDown text-orange-50" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="NavigationMenuContent">
              <ul className="List one">
                <ListItem title="About Us" href="#">
                  Learn more about our company.
                </ListItem>
                <ListItem title="Blogs" href="/blogs">
                  Read our latest blogs and updates.
                </ListItem>
                <ListItem title="Contact Us" href="/contact">
                  Get in touch with us.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="NavigationMenuLink text-orange-50"
              href="/pricing"
            >
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
