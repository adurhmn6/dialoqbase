const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { FastifyReply, FastifyRequest } from "fastify";
import { CreditCheckout } from "./types";
import Stripe from "stripe";

export const creditWebhookHandler = async (
  request: FastifyRequest<CreditCheckout>,
  reply: FastifyReply
) => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      (request.body as any).raw,
      request.headers["stripe-signature"]!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log("Signature verify failed");
    return reply.status(500).send({ message: "Something went wrong" });
  }

  const prisma = request.server.prisma;

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const user_id = +event.data.object.metadata?.user_id;
      const credits_purchased = +event.data.object.metadata?.credits_purchased;

      if (isNaN(user_id) || isNaN(credits_purchased) || credits_purchased < 0) {
        console.log("Invalid metadata for payment_intent.succeeded");
        return reply.status(500).send({ message: "Invalid metadata" });
      }

      console.log(event.data.object.metadata);
      await prisma.inventory.update({
        where: { user_id },
        data: {
          credit_balance: {
            increment: credits_purchased,
          },
        },
      });
      break;
    default:
    // ... handle other event types
    // console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  reply.status(200).send();
};
