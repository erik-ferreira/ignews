import { mocked } from "jest-mock"
import { useSession } from "next-auth/react"
import { render, screen } from "@testing-library/react"

import { SignInButton } from "."

jest.mock("next-auth/react")

describe("Header component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
      update: null,
    })

    render(<SignInButton />)

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument()
  })

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession)
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

    render(<SignInButton />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })
})
