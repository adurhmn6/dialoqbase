type Props = {
  sessions: any[];
};

export default function AgentSessions({ sessions }: Props) {
  console.log({ sessions });
  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-bold ml-3">Sessions</h1>
        <div className="bg-white py-8 px-4 w-[500px] border sm:rounded-lg sm:px-10 dark:bg-black dark:border-gray-800">
          <p className="text-gray-500 text-center">No sessions conducted yet</p>
        </div>
      </div>
    </>
  );
}
