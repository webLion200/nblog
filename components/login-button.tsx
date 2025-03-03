import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/SessionProvider";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/login/actions";
import Link from "next/link";

export default function LoginButton() {
  const session = useSession();
  const handleLogout = async () => {
    await logout();
  };

  return !session?.user ? (
    <Link href="/login" className="text-white cursor-pointer hover:underline">
      Login
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-amber-500 text-white font-bold">
            {session?.user.username}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as @{session?.user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/posts/create">New Post</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Theme</DropdownMenuItem>
        <DropdownMenuItem>Seetings</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
