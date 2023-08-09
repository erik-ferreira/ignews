import { mocked } from "jest-mock"
import { signIn } from "next-auth/react"
import { fireEvent, render, screen } from "@testing-library/react"

import { SubscribeButton } from "."

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: null,
        status: "unauthenticated",
        update: null,
      }
    },
    signIn: jest.fn(),
  }
})

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    render(<SubscribeButton />)

    expect(screen.getByText("Subscribe now")).toBeInTheDocument()
  })

  it("redirect user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText("Subscribe now")
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it("redirect user to posts when user already has a subscription", () => {})
})
