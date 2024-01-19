export const getSessionPath = (agentId: string) => {
  return `/session/${agentId}`;
};

export const getSessionLink = (agentId: string) => {
  return `${import.meta.env.VITE_HOST_URL}${getSessionPath(agentId)}`;
};
