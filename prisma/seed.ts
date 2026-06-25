import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create plans
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 29,
        seats: 5,
        features: ["5 team seats", "Basic reporting", "Email support"],
        isActive: true,
      },
      {
        name: "Growth",
        price: 99,
        seats: 25,
        features: ["25 team seats", "Advanced reporting", "Priority support", "SSO"],
        isActive: true,
      },
      {
        name: "Scale",
        price: 299,
        seats: 100,
        features: ["100 team seats", "Custom reporting", "Dedicated support", "SSO + SCIM", "Audit log"],
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Plans seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());