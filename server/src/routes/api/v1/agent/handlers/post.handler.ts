import { FastifyReply, FastifyRequest } from "fastify";
import { CreateAgentRequest } from "./types";
import { getInventory } from "../../../../../utils/common";
import { CreditsNeeded } from "../../../../../utils/credits";

export const createAgentHandler = async (
  request: FastifyRequest<CreateAgentRequest>,
  reply: FastifyReply
) => {
  const { name, initMsg, prompt } = request.body;

  const prisma = request.server.prisma;

  const inventory = await getInventory(prisma, request.user.user_id);
  if (inventory.credit_balance < CreditsNeeded.AGENT_CREATE) {
    return reply.status(400).send({
      message: `Not enough credits. Credits Remaining: ${inventory.credit_balance}. Credits Needed: ${CreditsNeeded.AGENT_CREATE}`,
    });
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      prompt,
      initMsg,
      user_id: request.user.user_id,
    },
  });

  // consume credits (todo: consume based on prompt weight)
  await prisma.inventory.update({
    where: { user_id: request.user.user_id },
    data: {
      credit_balance: { decrement: CreditsNeeded.AGENT_CREATE },
    },
  });

  return {
    id: agent.id,
  };
};
