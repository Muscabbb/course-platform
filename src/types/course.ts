import { Prisma } from "@prisma/client";

// Define the include type that matches your query
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const courseInclude = {
  products: {
    include: {
      product: true,
    },
  },
  sections: true,
  users: {
    include: {
      user: true,
    },
  },
} satisfies Prisma.CourseInclude;

// Generate the type based on the include
export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: typeof courseInclude;
}>;
