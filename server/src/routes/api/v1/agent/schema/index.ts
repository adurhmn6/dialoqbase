import { FastifySchema } from "fastify";

export const createAgentSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      initMsg: {
        type: "string",
      },
      prompt: {
        type: "string",
      },
    },
  },
};

export const getAgentByIdSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
};
