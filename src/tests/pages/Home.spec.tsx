import { mocked } from "jest-mock"
import { render, screen } from "@testing-library/react"

import Home, { getStaticProps } from "../../pages"
import { stripe } from "../../services/stripe"

jest.mock("next-auth/react", () => {
  return {
    useSession: () => ({
      data: null,
      status: "unauthenticated",
      update: null,
    }),
  }
})
jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => {
  push: jest.fn()
})
jest.mock("../../services/stripe")

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$10,00" }} />)

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
  })

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 2000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$20.00",
          },
        },
      })
    )
  })
})
