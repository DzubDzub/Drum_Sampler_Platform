import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LuUser,
  LuLogOut,
  LuLayoutDashboard,
  LuSquareKanban,
} from "react-icons/lu";
import useAuthStore from "stores/AuthStore";
import { Link, useNavigate } from "react-router-dom";

function AccountDropdown() {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    alert("LOGGED OUT!");
  };

  return (
    <div className="absolute z-50 flex items-center gap-5 px-3 py-1 top-4 right-4">
      {token ? (
        <>
          <p>{username}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="text-2xl">
                <LuUser />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <LuLayoutDashboard />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="../">
                  <LuSquareKanban />
                  Drum Sampler
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LuLogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="text-2xl">
              <LuUser />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/login">Login</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default AccountDropdown;
