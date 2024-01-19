import { FastifySchema } from "fastify";

export const creditCheckoutSchema: FastifySchema = {
  querystring: {
    type: "object",
    required: ["quantity"],
    properties: {
      quantity: {
        type: "string",
      },
    },
  },
};
