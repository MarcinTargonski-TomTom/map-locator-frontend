import {
  Heading,
  Navbar,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuLink,
} from "tombac";
import { Link } from "react-router";
import { useSessionContext } from "../context/sessionContext";

export const ROOT_PATH = "/";
export const MAP_PATH = "/map";
export const SIGN_IN_PATH = "/sign-in";
export const SIGN_UP_PATH = "/sign-up";

export function AppNavbar() {
  const { role, logOut } = useSessionContext();

  return (
    <Navbar>
      <NavbarLogo as={Link} to={ROOT_PATH} title="Near&Far" />
      <NavbarMenu>
        <NavbarMenuItem>
          {!role ? (
            <>
              <NavbarMenuLink as={Link} to={SIGN_IN_PATH}>
                <Heading level={5}>Sign in</Heading>
              </NavbarMenuLink>
              <NavbarMenuLink as={Link} to={SIGN_UP_PATH}>
                <Heading level={5}>Sign up</Heading>
              </NavbarMenuLink>
            </>
          ) : (
            <>
              <NavbarMenuLink as={Link} to={MAP_PATH}>
                <Heading level={5}>Map</Heading>
              </NavbarMenuLink>

              <NavbarMenuLink as={Link} to={SIGN_IN_PATH} onClick={logOut}>
                <Heading level={5}>Log out</Heading>
              </NavbarMenuLink>
            </>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
