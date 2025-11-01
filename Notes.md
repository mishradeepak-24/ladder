


















<DropdownMenuContent className="w-52 mt-2" align="end">
          <DropdownMenuLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <UserCircle2 className="w-4 h-4" />
            {user?.name || "Guest"}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {user?.user_type === "admin" && (
            <>
              <DropdownMenuItem
                onClick={handleAdminClick}
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <Shield className="mr-2 h-4 w-4 text-blue-600" />
                Admin Panel
              </DropdownMenuItem>

              {/* ✅ Login Player (only if ladderId exists) */}
              {getEncodedLadderId() && (
                <Link
                  href={`/login-user?id=${getEncodedLadderId()}`}
                  className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 px-2 py-1"
                >
                  <LogIn className="mr-2 h-4 w-4 text-purple-600" />
                  Login Player
                </Link>
              )}

              {/* ✅ Register Player (only if ladderId exists) */}
              {getEncodedLadderId() && (
                <Link
                  href={`/register-user?id=${getEncodedLadderId()}`}
                  className="flex items-center gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 px-2 py-1"
                >
                  <UserPlus className="mr-2 h-4 w-4 text-green-600" />
                  Register Player
                </Link>
              )}
            </>
          )}

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>