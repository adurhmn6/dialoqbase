export interface CreateAgentRequest {
  Body: {
    initMsg: string;
    prompt: string;
    name: string;
  };
}

export interface GetAgentRequestById {
  Params: {
    id: string;
  };
}
