import { describe, expect, it } from "vitest";
import { keepEcosystemPackages } from "../src/registry.mjs";

describe("keepEcosystemPackages", () => {
  it("test_keeps_the_scope_and_the_two_unscoped_names", () => {
    expect(keepEcosystemPackages(["@getloopscale/loopzero-sdk", "loopzero", "create-loopzero"])).toEqual([
      "@getloopscale/loopzero-sdk",
      "create-loopzero",
      "loopzero",
    ]);
  });

  it("test_drops_a_third_party_package_that_merely_mentions_loopzero", () => {
    // The query is full text, because the registry search API returns nothing for
    // `scope:loopzero`. Anything whose README says "loopzero" comes back with it.
    expect(keepEcosystemPackages(["loopzero-community-plugin", "awesome-loopzero", "@acme/loopzero-tools"])).toEqual([]);
  });

  it("test_survives_a_malformed_search_result_without_throwing", () => {
    // A search hit with no name is not worth crashing the whole sweep over.
    expect(keepEcosystemPackages([undefined, null, "@getloopscale/loopzero-ui"])).toEqual(["@getloopscale/loopzero-ui"]);
  });

  it("test_deduplicates_because_the_unscoped_names_are_appended_unconditionally", () => {
    expect(keepEcosystemPackages(["loopzero", "loopzero", "create-loopzero"])).toEqual(["create-loopzero", "loopzero"]);
  });
});
