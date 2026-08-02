"use server";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "invalid email" };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
