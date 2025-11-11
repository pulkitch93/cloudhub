import { User, Settings, Brain, GraduationCap, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-border hover:ring-primary transition-all">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            JD
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">John Doe</p>
              {isAdmin && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] px-1 py-0">
                  ADMIN
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              Infrastructure Admin
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/ai-models")} className="cursor-pointer">
          <Brain className="mr-2 h-4 w-4" />
          <span>AI Models</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/learning-hub")} className="cursor-pointer">
          <GraduationCap className="mr-2 h-4 w-4" />
          <span>Learning Hub</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/admin")} 
              className="cursor-pointer bg-red-500/5 hover:bg-red-500/10"
            >
              <Shield className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">Admin Console</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
