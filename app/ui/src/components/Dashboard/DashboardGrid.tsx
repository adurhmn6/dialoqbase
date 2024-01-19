import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Empty } from "antd";
import { sources } from "../../utils/sources";
import { getSessionLink, getSessionPath } from "../../utils/agent";

export const DashboardGrid = () => {
  // const { data, status } = useQuery(["getAllBots"], async () => {
  //   const response = await api.get("/bot");
  //   return response.data;
  // });
  const { data, status } = useQuery(["getAllBotsAndAgents"], async () => {
    const response = await api.get("/agent/with-bots");
    return response.data;
  });

  return (
    <>
      {status === "loading" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* create skelon loadinf */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              className="flex animate-pulse h-28 px-3 py-4 bg-gray-400 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
              key={item}
            ></div>
          ))}
        </div>
      )}
      {status === "success" && data.length === 0 && (
        <Empty description="No bots created yet" />
      )}
      {status === "success" && data.length > 0 && (
        <div className="grid grid-cols-1 mt-6 gap-4 sm:grid-cols-3">
          {data.map(({ bot, agent }: any) =>
            bot ? (
              <Link
                to={`/bot/${bot.id}`}
                className="flex rounded-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
                key={bot.id}
              >
                <div className="w-full truncate rounded-md border border-gray-200 bg-purple-200 dark:bg-[#0a0a0a] dark:border-[#232222]">
                  <div className="flex flex-1 items-center justify-between ">
                    <div className="flex-1 truncate px-4 py-4">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-gray-600 flex-shrink truncate dark:text-gray-200 dark:hover:text-gray-300">
                        {bot.name}
                      </h3>
                      <div className="w-full">
                        <div className="flex items-end justify-between">
                          <span className="text-xs lowercase text-scale-1000 text-gray-600 dark:text-gray-400">
                            {bot.model.replace("-dbase", "")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500  dark:text-white dark:hover:text-gray-300 dark:focus:ring-gray-900"
                      >
                        <span className="sr-only">Open options</span>
                        <ChevronRightIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 my-3 flex flex-wrap gap-2 text-gray-500 text-xs dark:text-gray-400">
                    {bot.source.map((source: any) => (
                      <span title={`${source.type} source`}>
                        {sources[source.type as keyof typeof sources]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to={`/agent/${agent.id}`}
                className="flex rounded-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
                key={agent.id}
              >
                <div className="w-full truncate rounded-md border border-gray-200 bg-blue-200 dark:bg-[#0a0a0a] dark:border-[#232222]">
                  <div className="flex flex-1 items-center justify-between ">
                    <div className="flex-1 truncate px-4 py-4">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-gray-600 flex-shrink truncate dark:text-gray-200 dark:hover:text-gray-300">
                        {agent.name}
                      </h3>
                      {/* <div className="w-full">
                        <div className="flex items-end justify-between">
                          <span className="text-xs lowercase text-scale-1000 text-gray-600 dark:text-gray-400">
                            {bot.model.replace("-dbase", "")}
                          </span>
                        </div>
                      </div> */}
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500  dark:text-white dark:hover:text-gray-300 dark:focus:ring-gray-900"
                      >
                        <span className="sr-only">Open options</span>
                        <ChevronRightIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 my-3 flex flex-wrap gap-2 text-gray-500 text-xs dark:text-gray-400">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(getSessionLink(agent.id));
                      }}
                      className="cursor-pointer relative inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
