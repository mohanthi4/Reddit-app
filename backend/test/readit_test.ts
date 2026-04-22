import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import Readit from "../src/readit.ts";
import { createClient } from "../src/persistence.ts";

const { postData, length } = await createClient();
let readit: Readit;

describe("Readit class", () => {
  beforeEach(() => {
    readit = new Readit(postData, length);
  });
  it("get all feed data", async () => {
    const data = await readit.getPosts();
    assertEquals(data, "");
  });
});
