import { FastifyPluginAsync } from "fastify";
import { creditCheckoutHandler, creditsHandler } from "./handlers/get.handler";
import { creditCheckoutSchema } from "./schema";
import { creditWebhookHandler } from "./handlers/post.handler";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
    },
    creditsHandler
  );

  fastify.get(
    "/checkout",
    {
      onRequest: [fastify.authenticate],
      schema: creditCheckoutSchema,
    },
    creditCheckoutHandler
  );

  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    function (req, body, done) {
      try {
        var newBody = {
          raw: body,
        };
        done(null, newBody);
      } catch (error: any) {
        error.statusCode = 400;
        done(error, undefined);
      }
    }
  );

  fastify.post("/webhook", creditWebhookHandler);
};

export default root;
