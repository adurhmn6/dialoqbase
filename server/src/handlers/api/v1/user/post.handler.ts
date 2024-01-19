import { FastifyReply, FastifyRequest } from "fastify";
import {
  ChatRequestBody,
  RegisterUserRequestBody,
  UpdatePasswordRequestBody,
  UpdateUsernameRequestBody,
} from "./types";
import * as bcrypt from "bcryptjs";
import { getSettings } from "../../../../utils/common";
import { getGoogleOAuthTokens, getGoogleUser } from "../../../../utils/oauth";

export const userLoginHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply
) => {
  const { username, password, googleOAuthCode } = request.body;

  console.log({ username, password, googleOAuthCode });

  if (googleOAuthCode) {
    const result = await getGoogleOAuthTokens({ code: googleOAuthCode });
    if (result === null) {
      return reply.status(400).send({
        message: "Bad Request. Cannot fetch google auth token",
      });
    }

    const userGoogleData = await getGoogleUser({
      id_token: result.id_token,
      access_token: result.access_token,
    });
    if (userGoogleData === null) {
      return reply.status(400).send({
        message: "Bad Request. Cannot fetch user data from google",
      });
    }

    if (!userGoogleData.verified_email) {
      return reply.status(400).send({
        message: "Bad Request. Google account have unverified email",
      });
    }

    const user = await request.server.prisma.user.findFirst({
      where: {
        email: userGoogleData.email,
      },
    });

    if (!user) {
      // SIGNUP USER
      const prisma = request.server.prisma;
      // const settings = await getSettings(prisma);
      // if (!settings) {
      //   return reply.status(400).send({
      //     message: "Settings not found",
      //   });
      // }

      // if (!settings.allowUserToRegister) {
      //   return reply.status(400).send({
      //     message:
      //       "User registration is not allowed. Please contact the administrator",
      //   });
      // }

      const newUser = await prisma.user.create({
        data: {
          username: userGoogleData.email,
          email: userGoogleData.email,
          registerType: "google-oauth",
          password: "",
          inventory: {
            create: {},
          },
        },
      });

      const token = request.server.jwt.sign({
        user_id: newUser.user_id,
        username: newUser.username,
        is_admin: newUser.isAdministrator,
      });

      return reply.status(200).send({
        message: "Welcome to the Dialoqbase",
        token,
        user: {
          user_id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
        },
        to: "/",
      });
    } else {
      const token = request.server.jwt.sign({
        user_id: user.user_id,
        username: user.username,
        is_admin: user.isAdministrator,
      });

      return reply.status(200).send({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
        },
        to: "/",
      });
    }
  } else {
    const user = await request.server.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    if (user.registerType === "google-oauth") {
      return reply.status(404).send({
        message: "Login not allowed. Please login using Google",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(400).send({
        message: "Invalid password",
      });
    }

    const token = request.server.jwt.sign({
      user_id: user.user_id,
      username: user.username,
      is_admin: user.isAdministrator,
    });

    return reply.status(200).send({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
      to: "/",
    });
  }
};

export const updateProfileHandler = async (
  request: FastifyRequest<UpdateUsernameRequestBody>,
  reply: FastifyReply
) => {
  const user = request.user;

  const isUsernameTaken = await request.server.prisma.user.findFirst({
    where: {
      user_id: {
        not: user.user_id,
      },
      username: request.body.username,
    },
  });

  if (isUsernameTaken) {
    return reply.status(400).send({
      message: "Username is already taken",
    });
  }

  const isEmailTaken = await request.server.prisma.user.findFirst({
    where: {
      user_id: {
        not: user.user_id,
      },
      email: request.body.email,
    },
  });

  if (isEmailTaken) {
    return reply.status(400).send({
      message: "Email is already taken",
    });
  }

  await request.server.prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      username: request.body.username,
      email: request.body.email,
    },
  });

  return reply.status(200).send({
    message: "Information updated successfully",
    user: {
      user_id: user.user_id,
      username: request.body.username,
      email: request.body.email,
    },
  });
};

export const updatePasswordHandler = async (
  request: FastifyRequest<UpdatePasswordRequestBody>,
  reply: FastifyReply
) => {
  const user = request.user;

  const userDetails = await request.server.prisma.user.findFirst({
    where: {
      user_id: user.user_id,
    },
  });

  if (!userDetails) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    request.body.oldPassword,
    userDetails.password
  );

  if (!isPasswordValid) {
    return reply.status(400).send({
      message: "Invalid password",
    });
  }

  const hashedPassword = await bcrypt.hash(request.body.newPassword, 12);

  await request.server.prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return reply.status(200).send({
    message: "Password updated successfully",
  });
};

export const registerUserHandler = async (
  request: FastifyRequest<RegisterUserRequestBody>,
  reply: FastifyReply
) => {
  try {
    const prisma = request.server.prisma;
    const settings = await getSettings(prisma);
    if (!settings) {
      return reply.status(400).send({
        message: "Settings not found",
      });
    }

    if (!settings.allowUserToRegister) {
      return reply.status(400).send({
        message:
          "User registration is not allowed. Please contact the administrator",
      });
    }

    const isUsernameTaken = await prisma.user.findFirst({
      where: {
        username: request.body.username,
      },
    });

    if (isUsernameTaken) {
      return reply.status(400).send({
        message: "Username is already taken",
      });
    }

    const isEmailTaken = await prisma.user.findFirst({
      where: {
        email: request.body.email,
      },
    });

    if (isEmailTaken) {
      return reply.status(400).send({
        message: "Email is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(request.body.password, 12);

    const user = await prisma.user.create({
      data: {
        username: request.body.username,
        email: request.body.email,
        password: hashedPassword,
        inventory: {
          create: {},
        },
      },
    });

    const token = request.server.jwt.sign({
      user_id: user.user_id,
      username: user.username,
      is_admin: user.isAdministrator,
    });

    return reply.status(200).send({
      message: "Welcome to the Dialoqbase",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
      to: "/",
    });
  } catch (e) {
    console.log(e);
    return reply.status(500).send({
      message: "Error registering user",
    });
  }
};
