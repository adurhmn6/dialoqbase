import { FastifyPluginAsync } from "fastify";
import {
  createAgentHandler,
  getAgentByIdHandler,
  getAllBotsAndAgentsHandler,
} from "./handlers";
import { createAgentSchema, getAgentByIdSchema } from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: createAgentSchema,
      onRequest: [fastify.authenticate],
    },
    createAgentHandler
  );

  // get bot info
  fastify.get(
    "/:id",
    {
      schema: getAgentByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getAgentByIdHandler
  );

  // get all bots
  fastify.get(
    "/with-bots",
    {
      onRequest: [fastify.authenticate],
    },
    getAllBotsAndAgentsHandler
  );
};

export default root;
