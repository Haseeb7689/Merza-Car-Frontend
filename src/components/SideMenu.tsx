"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoCarSportOutline } from "react-icons/io5";
import { HiOutlineQueueList } from "react-icons/hi2";
import { useAuth } from "@/components/AuthContext";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, loading } = useAuth();

  const busyRef = useRef(false);
  const [navBusy, setNavBusy] = useState(false);

  useEffect(() => {
    if (busyRef.current) {
      busyRef.current = false;
      setNavBusy(false);
    }
  }, [pathname]);

  const go = (to: string) => {
    if (busyRef.current) return;
    if (to === pathname) return;
    busyRef.current = true;
    setNavBusy(true);
    router.push(to);
  };

  const handleLogout = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setNavBusy(true);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/Login");
  };

  if (loading) return null;
  return (
    <div>
      <div className="flex h-screen w-30 flex-col justify-between border-e border-gray-100 bg-white">
        <div className="flex justify-center items-center flex-col">
          <div className="inline-flex size-16 items-center justify-center">
            <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              L
            </span>
          </div>

          <div className="border-t border-gray-100">
            <div className="px-2">
              <ul className="space-y-1 border-t border-gray-100 pt-4">
                <li>
                  <button
                    type="button"
                    onClick={() => go("/AddTeamForm")}
                    disabled={navBusy || pathname === "/AddTeamForm"}
                    className={`group relative flex justify-center w-full rounded-sm px-2 py-1.5 hover:cursor-pointer ${
                      pathname === "/AddTeamForm"
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : navBusy
                        ? "opacity-60"
                        : "text-gray-500 hover:bg-blue-50 hover:text-gray-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-7 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="invisible absolute w-19 end-full top-1/2 me-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Add Teams
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => go("/AddCarsForm")}
                    disabled={navBusy || pathname === "/AddCarsForm"}
                    className={`group relative flex justify-center w-full rounded-sm px-2 py-1.5 cursor-pointer ${
                      pathname === "/AddCarsForm"
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : navBusy
                        ? "opacity-60"
                        : "text-gray-500 hover:bg-blue-50 hover:text-gray-700"
                    }`}
                  >
                    <IoCarSportOutline className="size-7 opacity-75" />
                    <span className="invisible absolute w-17 end-full top-1/2 me-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Add Cars
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => go("/Listings")}
                    disabled={navBusy || pathname === "/Listings"}
                    className={`group relative flex justify-center w-full rounded-sm px-2 py-1.5 cursor-pointer ${
                      pathname === "/Listings"
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : navBusy
                        ? "opacity-60"
                        : "text-gray-500 hover:bg-blue-50 hover:text-gray-700"
                    }`}
                  >
                    <HiOutlineQueueList className="size-7 opacity-75" />
                    <span className="invisible absolute end-full top-1/2 me-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Listings
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => go("/404Page")}
                    disabled={navBusy || pathname === "/Account"}
                    className={`group relative flex justify-center w-full rounded-sm px-2 py-1.5 cursor-pointer ${
                      pathname === "/Account"
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : navBusy
                        ? "opacity-60"
                        : "text-gray-500 hover:bg-blue-50 hover:text-gray-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-7 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="invisible absolute end-full top-1/2 me-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Account
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {isLoggedIn && (
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="group relative flex justify-center w-full rounded-sm px-2 py-1.5 text-gray-500 hover:text-blue-600 font-semibold hover:bg-blue-50 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-7 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="invisible absolute end-full top-1/2 me-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideMenu;
