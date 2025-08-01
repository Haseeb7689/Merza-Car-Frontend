"use client";
import Image from "next/image";
import Logo from "../images/logo.webp";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loginClicked, setLoginClicked] = useState(false);
  const [registerClicked, setRegisterClicked] = useState(false);
  useEffect(() => {
    if (loginClicked || registerClicked) {
      setLoginClicked(false);
      setRegisterClicked(false);
    }
  }, [pathname]);

  return (
    <div>
      <header className="bg-gray-700">
        <div className="flex h-25 justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <a className="block text-teal-600" href="/">
            <span className="sr-only">Home</span>
            <Image className="w-32 h-auto" src={Logo} alt="logo" />
          </a>

          <div className="flex-1 flex items-center justify-end md:justify-between">
            <nav
              aria-label="Global"
              className="hidden md:flex ml-30 justify-center min-w-[300px]"
            >
              <ul className="flex items-center gap-5 lg:gap-10 md:text-lg lg:text-xl">
                <li>
                  <a
                    className="text-white hover:text-orange-500   flex items-center gap-2"
                    href="#"
                  >
                    Home <IoIosArrowDown />
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-orange-500  flex items-center gap-2"
                    href="#"
                  >
                    Search <IoIosArrowDown />
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-orange-500  flex items-center gap-2"
                    href="#"
                  >
                    Pages <IoIosArrowDown />
                  </a>
                </li>
                <li>
                  <a className="text-white hover:text-orange-500 " href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4 justify-end ml-4 shrink-0">
              {!loading && !isLoggedIn && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!loginClicked) {
                        setLoginClicked(true);
                        if (pathname !== "/Login") router.push("/Login");
                      }
                    }}
                    disabled={loginClicked}
                    className={` rounded-md px-5 py-2.5 text-sm font-medium text-white ${
                      loginClicked
                        ? "bg-orange-400 opacity-60 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!registerClicked) {
                        setRegisterClicked(true);
                        if (pathname !== "/Register") router.push("/Register");
                      }
                    }}
                    disabled={registerClicked}
                    className={` rounded-md px-5 py-2.5 text-sm font-medium text-white ${
                      registerClicked
                        ? "bg-orange-400 opacity-60 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              <button
                onClick={onToggleSidebar}
                className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 hover:text-gray-600/75 cursor-pointer md:hidden"
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
