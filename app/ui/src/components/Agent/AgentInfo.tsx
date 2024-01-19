import dateFormat from "dateformat";

type Props = {
  info: {
    name: string;
    id: string;
    user_id: number;
    initMsg: string;
    prompt: string;
    createdAt: string;
  };
};

export default function AgentInfo({ info }: Props) {
  return (
    <>
      {/* <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        
      </div> */}
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-bold ml-3">Agent Information</h1>
        <div className="bg-white py-8 px-4 w-[500px] border sm:rounded-lg sm:px-10 dark:bg-black dark:border-gray-800">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Agent Name:</div>
              <div className="ring-1 ring-gray-300 p-2 rounded-md text-sm text-gray-600">
                {info.name}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Initiation Message:</div>
              <div className="ring-1 ring-gray-300 p-2 rounded-md text-sm text-gray-600">
                {info.initMsg}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Agent Prompt:</div>
              <div className="ring-1 ring-gray-300 p-2 rounded-md text-sm text-gray-600">
                {info.prompt}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Created At:</div>
              <div className="ring-1 ring-gray-300 p-2 rounded-md text-sm text-gray-600">
                {dateFormat(info.createdAt, "dddd, mmmm dS, yyyy, h:MM TT")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
