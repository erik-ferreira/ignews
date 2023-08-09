import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"

import { api } from "../../services/api"
import { getStripeJS } from "../../services/stripe-js"

import styles from "./styles.module.scss"

export function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn("github")
      return
    }

    if (session.activeSubscription) {
      router.push("/posts")
      return
    }

    // create session checkout
    try {
      const response = await api.post("/subscribe")
      const { sessionId } = response.data

      const stripe = await getStripeJS()

      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      if (err.response.status === 400) {
        const { message } = err.response?.data
        alert(message)
      } else {
        alert(err.message)
      }
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
