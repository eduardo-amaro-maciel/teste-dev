import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { layoutRoutes } from "@/routes/layout-routes";

export function SidebarNavigation() {
  return (
    <div className="h-screen p-4 bg-[#F3F2EE] border border-r max-[650px]:hidden">
      <img src={logo} alt="logo empresa" className="w-44 my-10" />
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
    </div>
  );
}
