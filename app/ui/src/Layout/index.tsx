import { Disclosure, Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../components/Common/Avatar";
import { ApplicationMenu } from "./ApplicationMenu";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Spin } from "antd";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const { isLogged, profile, logout } = useAuth();

  React.useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  const { data } = useQuery(["fetchCredits"], async () => {
    const response = await api.get("/credit");
    return response.data as {
      credits?: number;
    };
  });

  return (
    <>
      <div className="min-h-full">
        <Disclosure
          as="nav"
          className="border-b border-gray-200 bg-white dark:bg-black dark:border-gray-800"
        >
          {() => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 justify-between">
                  <Link
                    to="/"
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center mr-4"
                  >
                    <img
                      className="h-8 w-auto"
                      src="https://www.bilic.io/favicon.ico"
                      alt="Dialoqbase"
                    />
                    <span className="ml-1 text-xl font-bold dark:text-white">
                      Agents Bilic
                    </span>
                    <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 ml-2">
                      {/* @ts-ignore */}
                      {`v${__APP_VERSION__}`}
                    </span>
                  </Link>
                  <div className=" ml-6 flex items-center gap-4">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex gap-2">
                          <h1 className="text-slate-800 text-sm">CREDITS:</h1>
                          <h1 className="text-green-800 text-sm">
                            {typeof data?.credits === "number" ? (
                              data!.credits
                            ) : (
                              <Spin />
                            )}
                          </h1>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <div className="px-4 py-2">
                              <p className="inline-block text-sm text-gray-700">
                                <InformationCircleIcon className="w-4 h-4 inline-block text-blue-500 mr-1" />
                                Credits are used to create new bots, keep bots
                                running, add new data source etc.
                              </p>
                            </div>
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                to="/credit"
                              >
                                Buy Credits
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <ApplicationMenu />
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Avatar username={profile?.username || "admin"} />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {profile?.username}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/settings"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Settings
                    </Disclosure.Button>
                    <Disclosure.Button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div>
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
