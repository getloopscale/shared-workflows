import { describe, expect, it } from "vitest";
import { keepEcosystemPackages } from "../src/registry.mjs";

describe("keepEcosystemPackages", () => {
  it("test_keeps_the_prefixed_packages_and_the_two_framework_entry_names", () => {
    expect(keepEcosystemPackages(["@getloopscale/loopzero-sdk", "@getloopscale/loopzero", "@getloopscale/create-loopzero"])).toEqual([
      "@getloopscale/create-loopzero",
      "@getloopscale/loopzero",
      "@getloopscale/loopzero-sdk",
    ]);
  });

  it("test_drops_a_third_party_package_that_merely_mentions_loopzero", () => {
    // The query is full text, because the registry search API returns nothing for
    // `scope:loopzero`. Anything whose README says "loopzero" comes back with it.
    expect(keepEcosystemPackages(["loopzero-community-plugin", "awesome-loopzero", "@acme/loopzero-tools", "@getloopscale/ui"])).toEqual([]);
  });

  it("test_survives_a_malformed_search_result_without_throwing", () => {
    // A search hit with no name is not worth crashing the whole sweep over.
    expect(keepEcosystemPackages([undefined, null, "@getloopscale/loopzero-ui"])).toEqual(["@getloopscale/loopzero-ui"]);
  });

  it("test_deduplicates_because_the_entry_names_are_appended_unconditionally", () => {
    expect(keepEcosystemPackages(["@getloopscale/loopzero", "@getloopscale/loopzero", "@getloopscale/create-loopzero"])).toEqual([
      "@getloopscale/create-loopzero",
      "@getloopscale/loopzero",
    ]);
  });
});
