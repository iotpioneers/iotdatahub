import * as React from "react";
import { useSession } from "next-auth/react";
import { Link, PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";
import NavigationMenuLinks from "../NavigationMenuLinks/NavigationMenuLinks";
import ToggleButton from "../Button";
import { navigation } from "@/constants";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function HomeHeader({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);

  const { status, data: session } = useSession();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Link
                href="/"
                className={`${logoStyle} flex justify-center items-center mx-5`}
              >
                <h1 className="flex text-lg text-center justify-center cursor-pointer font-bold text-blue-900">
                  <span className="hover:text-zinc-950">IoTDataHub</span>
                </h1>
              </Link>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <NavigationMenuLinks />
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {status !== "loading" && (
                <Button
                  className="flex  xs:mr-1 "
                  href={status === "authenticated" ? "/dashboard" : "/login"}
                >
                  {status === "authenticated" ? "DASHBOARD" : "SIGN IN"}
                </Button>
              )}
              {status !== "loading" && status === "unauthenticated" && (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  href="/material-ui/getting-started/templates/sign-up/"
                  target="_blank"
                >
                  Sign up
                </Button>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  {navigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={toggleDrawer(false)}
                      className={`lg:hidden block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-2`}
                    >
                      <MenuItem onClick={() => toggleDrawer(false)}>
                        {item.title}
                      </MenuItem>
                    </Link>
                  ))}
                  <Divider />
                  <MenuItem>
                    {status !== "loading" && (
                      <Button
                        className="flex  xs:mr-1 "
                        href={
                          status === "authenticated" ? "/dashboard" : "/login"
                        }
                      >
                        {status === "authenticated" ? "DASHBOARD" : "SIGN IN"}
                      </Button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {status !== "loading" && status === "unauthenticated" && (
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        component="a"
                        href="/material-ui/getting-started/templates/sign-up/"
                        target="_blank"
                      >
                        Sign up
                      </Button>
                    )}
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default HomeHeader;
