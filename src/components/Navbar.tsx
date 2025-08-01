import {
  Heading,
  Navbar,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuLink,
} from "tombac";
import { Link } from "react-router";

export function AppNavbar() {
  return (
    <Navbar>
      <NavbarLogo as={Link} to="/" title="Near&Far" />
      <NavbarMenu>
        <NavbarMenuItem>
          <NavbarMenuLink as={Link} to="/map">
            <Heading level={5}>Map</Heading>
          </NavbarMenuLink>
          <NavbarMenuLink as={Link} to="/sign-in">
            <Heading level={5}>Sign in</Heading>
          </NavbarMenuLink>
          <NavbarMenuLink as={Link} to="/sign-up">
            <Heading level={5}>Sign up</Heading>
          </NavbarMenuLink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
