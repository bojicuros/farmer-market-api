import bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../services/mail.service";

export async function getAllApproved() {
  const userInfo = await prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          is_approved: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_active: true,
      UserRole: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      UserMarket: {
        select: {
          market: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return userInfo.map((user) => {
    return {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      active: user.is_active,
      role: user.UserRole.map((userRole) => userRole.role.name),
      markets: user.UserMarket.map((userMarket) => userMarket.market.name),
    };
  });
}

export async function getById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      first_name: true,
      last_name: true,
      confirmed: true,
      is_active: true,
      UserRole: {
        select: {
          is_approved: true,
        },
      },
    },
  });
}

export async function getAllUnapproved() {
  const userInfo = await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      created_at: true,
      UserRole: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      UserRole: {
        some: {
          is_approved: false,
        },
      },
    },
  });

  return userInfo.map((user) => {
    return {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      date: user.created_at,
      role: user.UserRole.map((userRole) => userRole.role.name),
    };
  });
}

export async function create(user: User) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
}

export async function updateById(user) {
  const existingUser = await getById(user.id);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  return prisma.user.update({
    where: { id: user.id },
    data: user,
  });
}

export async function updateUserInfo(
  id: string,
  email: string,
  first_name: string,
  last_name: string,
  roles: string[],
  markets: string[]
) {
  const existingUser = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_active: true,
      UserRole: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      UserMarket: {
        select: {
          market: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: {
      id: id,
    },
  });

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  if (email && first_name && last_name) {
    await prisma.user.update({
      where: { id: id },
      data: {
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
    });
  }

  const userRoles = existingUser.UserRole.map((ur) => ur.role.name);

  if (roles) {
    const rolesToAdd = roles.filter((role) => !userRoles.includes(role));
    const rolesToRemove = userRoles.filter((role) => !roles.includes(role));

    await prisma.userRole.deleteMany({
      where: {
        user_id: id,
        role: {
          name: {
            in: rolesToRemove,
          },
        },
      },
    });

    const roleIdsToAdd = await Promise.all(
      rolesToAdd.map(async (roleName) => {
        const role = await prisma.role.findFirst({
          where: {
            name: roleName,
          },
        });
        return role ? role.id : null;
      })
    );

    await prisma.userRole.createMany({
      data: roleIdsToAdd.map((roleId) => ({
        user_id: id,
        role_id: roleId,
        is_approved: true,
      })),
    });
  }

  const userMarkets = existingUser.UserMarket.map((um) => um.market.name);

  if (markets) {
    const marketsToAdd = markets.filter(
      (market) => !userMarkets.includes(market)
    );
    const marketsToRemove = userMarkets.filter(
      (market) => !markets.includes(market)
    );

    await prisma.userMarket.deleteMany({
      where: {
        user_id: id,
        market: {
          name: {
            in: marketsToRemove,
          },
        },
      },
    });

    const marketIdsToAdd = await Promise.all(
      marketsToAdd.map(async (marketName) => {
        const market = await prisma.market.findFirst({
          where: {
            name: marketName,
          },
        });
        return market ? market.id : null;
      })
    );

    await prisma.userMarket.createMany({
      data: marketIdsToAdd.map((marketId) => ({
        user_id: id,
        market_id: marketId,
      })),
    });
  }
}

export async function deleteById(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  return prisma.user.delete({
    where: { id: userId },
  });
}

export async function approveById(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  const approvedUserInfo = await prisma.userRole.updateMany({
    where: {
      user_id: userId,
    },
    data: {
      is_approved: true,
    },
  });

  sendApprovalEmail(existingUser.email, existingUser.first_name);
  return approvedUserInfo;
}

export async function rejectById(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  await prisma.userMarket.deleteMany({
    where: { user_id: userId },
  });

  await prisma.userRole.deleteMany({
    where: { user_id: userId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  sendRejectionEmail(existingUser.email, existingUser.first_name);
}

export async function toggleActive(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      is_active: !existingUser.is_active,
    },
    select: {
      is_active: true,
    },
  });
}

export async function addMarketToUser(userId: string, marketNames: string[]) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  const markets = await prisma.market.findMany({
    where: {
      name: {
        in: marketNames,
      },
    },
    select: {
      id: true,
    },
  });

  const userMarketRecords: Prisma.UserMarketCreateManyInput[] = markets.map(
    (market) => ({
      user_id: userId,
      market_id: market.id,
    })
  );

  const createdUserMarkets = await prisma.userMarket.createMany({
    data: userMarketRecords,
  });

  return createdUserMarkets;
}
