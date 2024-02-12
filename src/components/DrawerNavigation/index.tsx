import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { layoutRoutes } from "@/routes/layout-routes";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function DrawerNavigation() {
  return (
    <div className="hidden max-[650px]:block sticky bg-[#F3F2EE]  w-full top-0 p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <img src={logo} alt="logo empresa" className="w-44 my-10" />
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            {layoutRoutes.map((route) => (
              <NavLink to={route.path} key={route.key}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start text-base flex gap-2 items-center"
                  >
                    <route.icon />
                    {route.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
