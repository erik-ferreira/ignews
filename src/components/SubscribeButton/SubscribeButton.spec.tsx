import { mocked } from "jest-mock"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { api } from "../../services/api"
import { getStripeJS } from "../../services/stripe-js"

import { SubscribeButton } from "."

// jest.mock("axios")
jest.mock("next-auth/react")
jest.mock("../../services/api")
jest.mock("../../services/stripe-js")
jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => {
  push: jest.fn()
})
// jest.spyOn(require("../../services/api"), "post").mockImplementation(() => {
//   post: jest.fn()
// })

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
      update: null,
    })

    render(<SubscribeButton />)

    expect(screen.getByText("Subscribe now")).toBeInTheDocument()
  })

  it("redirect user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
      update: null,
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText("Subscribe now")
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it("redirect user to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          image: "image.png",
        },
        expires: "fake-expires",
        activeSubscription: {
          data: {
            id: "fake-id",
            price_id: "fake-price-id",
            status: "fake-status",
          },
        },
      },
      status: "authenticated",
      update: null,
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<SubscribeButton />)

    const subscriptionButton = screen.getByText("Subscribe now")
    fireEvent.click(subscriptionButton)

    expect(pushMock).toHaveBeenCalledWith("/posts")
  })

  it("redirect user to checkout when user is authenticated, has no subscription and fetch post is successfully", async () => {
    const apiPostMocked = mocked(api.post)
    const useSessionMocked = mocked(useSession)
    const getStripeJSMocked = mocked(getStripeJS)
    const redirectToCheckoutMocked = jest.fn().mockResolvedValueOnce({})

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          image: "image.png",
        },
      },
      status: "authenticated",
    } as any)

    apiPostMocked.mockReturnValueOnce({
      data: {
        sessionId: "fake-session-id",
      },
    } as any)

    getStripeJSMocked.mockResolvedValueOnce({
      redirectToCheckout: redirectToCheckoutMocked,
    } as any)

    render(<SubscribeButton />)

    const subscriptionButton = screen.getByText("Subscribe now")
    fireEvent.click(subscriptionButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/subscribe")
      expect(getStripeJSMocked).toHaveBeenCalled()

      expect(redirectToCheckoutMocked).toHaveBeenCalledWith({
        sessionId: "fake-session-id",
      })
    })
  })
})
