import { mocked } from "jest-mock"
import { getSession } from "next-auth/react"
import { screen, render } from "@testing-library/react"

import { getPrismicClient } from "../../services/prismic"
import Post, { getServerSideProps } from "../../pages/posts/[slug]"

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "09 de Agosto",
}

jest.mock("next-auth/react")
jest.mock("../../services/prismic")

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("Post content")).toBeInTheDocument()
  })

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockReturnValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    )
  })

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "08-09-2023",
      }),
    } as any)

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any)

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post excerpt</p>",
            updatedAt: "09 de agosto de 2023",
          },
        },
      })
    )
  })
})
