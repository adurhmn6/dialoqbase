import { FastifyReply, FastifyRequest } from "fastify";
import { GetAgentRequestById } from "./types";

export const getAllBotsAndAgentsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;

  const bots = await prisma.bot.findMany({
    where: {
      user_id: request.user.user_id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      source: {
        distinct: ["type"],
        select: {
          type: true,
        },
      },
    },
  });

  const agents = await prisma.agent.findMany({
    where: {
      user_id: request.user.user_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const combined = [...bots, ...agents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((x: any) =>
      x?.temperature! === undefined ? { agent: x } : { bot: x }
    );

  return combined;
};

export const getAgentByIdHandler = async (
  request: FastifyRequest<GetAgentRequestById>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const agent = await prisma.agent.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
  });

  if (!agent) {
    return reply.status(404).send({
      message: "Agent not found",
    });
  }
  return { ...agent, sessions: [] };
};
