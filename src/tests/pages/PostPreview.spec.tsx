import { mocked } from "jest-mock"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { render, screen } from "@testing-library/react"

import { getPrismicClient } from "../../services/prismic"
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]"

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "09 de Agosto",
}

jest.mock("next-auth/react")
jest.mock("../../services/prismic")
jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => {
  push: jest.fn()
})

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
      update: null,
    })

    render(<PostPreview post={post} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("Post content")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  })

  it("redirects user to full post when user is subscribed", () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
      },
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<PostPreview post={post} />)

    expect(pushMock).toBeCalledWith("/posts/my-new-post")
  })

  it("loads initial data", async () => {
    const useSessionMocked = mocked(useSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
      },
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "08-09-2023",
      }),
    } as any)

    const response = await getStaticProps({ params: { slug: post.slug } })

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
