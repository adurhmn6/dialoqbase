import { FastifyReply, FastifyRequest } from "fastify";
import { CreditCheckout } from "./types";
import Stripe from "stripe";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY) as Stripe;

export const creditsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const user = await prisma.user.findUnique({
    where: {
      user_id: request.user.user_id,
    },
    include: {
      inventory: true,
    },
  });

  if (!user) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  return {
    credits: user.inventory?.credit_balance,
  };
};

export const creditCheckoutHandler = async (
  request: FastifyRequest<CreditCheckout>,
  reply: FastifyReply
) => {
  const userId = request.user?.user_id;
  const quantity = request.query.quantity;

  if (!userId) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  if (isNaN(+quantity)) {
    return reply.status(400).send({
      message: "Invalid quantity",
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1ONVLABD8v9wlFBJec0MlUoX",
        quantity: +quantity * 1000,
      },
    ],
    mode: "payment",
    payment_intent_data: {
      metadata: {
        user_id: userId,
        credits_purchased: +quantity * 1000,
      },
    },
    success_url: `${
      process.env.NODE_ENV === "production"
        ? process.env.BACKEND_HOST_URL
        : process.env.FRONTEND_HOST_URL_DEV
    }/#/credit?purchase_success=true`,
    cancel_url: `${
      process.env.NODE_ENV === "production"
        ? process.env.BACKEND_HOST_URL
        : process.env.FRONTEND_HOST_URL_DEV
    }/#/credit?purchase_canceled=true`,
  });

  return reply.status(200).send({ redirect: session.url });
};
