import { expect, test } from "bun:test"
import { toPostNodes } from "@/service/to-post-nodes"

const post = {
  id: "post-first",
  createdAt: new Date(1_234_567),
  text: null,
  fileIds: null,
  isDeleted: null,
  likesCount: 2,
  repliesCount: 3,
}

test("normalizes nullable database columns and timestamps", () => {
  expect(toPostNodes({ posts: [post], reactions: [] })).toEqual([
    {
      id: "post-first",
      createdAt: 1234,
      text: null,
      fileIds: [],
      isDeleted: false,
      likesCount: 2,
      repliesCount: 3,
      reactions: [],
    },
  ])
})

test("groups active reactions by post in creation order without changing input", () => {
  const reaction = {
    id: "reaction-newer",
    postId: post.id,
    text: "newer",
    createdAt: new Date(2000),
    secretCount: 1,
    usersCount: 0,
  }
  const reactions = [
    reaction,
    { ...reaction, id: "inactive", secretCount: 0 },
    {
      ...reaction,
      id: "reaction-older",
      text: "older",
      createdAt: new Date(1000),
      secretCount: 0,
      usersCount: 2,
    },
    { ...reaction, id: "other-reaction", postId: "post-second" },
  ]
  const nodes = toPostNodes({
    posts: [
      post,
      { ...post, id: "post-second", fileIds: ["image"], isDeleted: true },
      { ...post, id: "post-without-reactions" },
    ],
    reactions,
  })

  expect(nodes.map((node) => node.id)).toEqual([post.id, "post-second", "post-without-reactions"])
  expect(nodes[0]?.reactions).toEqual([
    {
      id: "reaction-older",
      text: "older",
      count: 2,
      secretCount: 0,
      isConnected: false,
    },
    {
      id: "reaction-newer",
      text: "newer",
      count: 0,
      secretCount: 1,
      isConnected: false,
    },
  ])
  expect(nodes[1]).toMatchObject({ fileIds: ["image"], isDeleted: true })
  expect(nodes[1]?.reactions.map((entry) => entry.id)).toEqual(["other-reaction"])
  expect(nodes[2]?.reactions).toEqual([])
  expect(reactions.map((entry) => entry.id)).toEqual([
    "reaction-newer",
    "inactive",
    "reaction-older",
    "other-reaction",
  ])
})
