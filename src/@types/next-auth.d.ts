import NextAuth from "next-auth"

declare module "next-auth" {
  interface ActiveSubscriptionDataProps {
    id: string
    price_id: string
    status: string
  }

  interface Session {
    activeSubscription: {
      data: ActiveSubscriptionDataProps | null
    }
  }
}
