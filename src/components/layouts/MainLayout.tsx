import { SidebarNavigation } from "../SidebarNavigation";
import { DrawerNavigation } from "../DrawerNavigation";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen max-[650px]:flex-col">
      <SidebarNavigation />
      <DrawerNavigation />
      <div className="p-16 w-full bg-white overflow-x-hidden overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
