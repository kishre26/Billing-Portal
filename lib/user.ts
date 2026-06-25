import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Check if user already exists in our DB
  let user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // If not, create them
  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        role: "admin", // first user gets admin
      },
    });

    // Give them sample invoices and a payment method
    await db.invoice.createMany({
      data: [
        { userId: user.id, description: "Growth plan — June 2026", amount: 99, status: "paid" },
        { userId: user.id, description: "Growth plan — May 2026", amount: 99, status: "paid" },
        { userId: user.id, description: "Growth plan — April 2026", amount: 99, status: "paid" },
        { userId: user.id, description: "Starter plan — March 2026", amount: 29, status: "paid" },
        { userId: user.id, description: "Starter plan — February 2026", amount: 29, status: "overdue" },
      ],
    });

    await db.paymentMethod.createMany({
      data: [
        { userId: user.id, brand: "Visa", last4: "4242", expiry: "08/28", isDefault: true },
        { userId: user.id, brand: "Mastercard", last4: "4444", expiry: "11/27", isDefault: false },
      ],
    });
  }

  return user;
}