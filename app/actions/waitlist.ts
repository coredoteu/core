"use server";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "invalid email" };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, integrate with Resend, Mailchimp, or database here.
  console.log("Waitlist entry:", email);

  return { success: true };
}
