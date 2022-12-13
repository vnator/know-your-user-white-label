import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { Referral } from "src/module/kyc/entity/referral";
import { fake } from "test/mock";
import { KycPayload } from "./kyc-payload";

describe("KycPayload", () => {
  it("should get kyc payload from mgm", () => {
    const kyc = fake(MemberGetMember);
    const payload = KycPayload.getPayload(kyc);
    expect(payload).toHaveProperty("data");
    expect(payload).toHaveProperty("data.referenceCode", kyc.referenceCode);
    expect(payload).toHaveProperty("data.codeKind", kyc.codeKind.value);
    expect(payload).toHaveProperty(
      "customerReferenceId",
      kyc.customerReferenceId,
    );
    expect(payload).toHaveProperty("createdAt", kyc.createdAt.toISOString());
    expect(payload).toHaveProperty("updatedAt", kyc.updatedAt.toISOString());
    expect(payload).toHaveProperty("id", kyc.id);
    expect(payload).toHaveProperty("kind", kyc.kind);
  });

  it("should get kyc payload from referral", () => {
    const kyc = fake(Referral);
    const payload = KycPayload.getPayload(kyc);
    expect(payload).toHaveProperty("data", kyc.choices);
    expect(payload).toHaveProperty("createdAt", kyc.createdAt.toISOString());
    expect(payload).toHaveProperty("updatedAt", kyc.updatedAt.toISOString());
    expect(payload).toHaveProperty("id", kyc.id);
    expect(payload).toHaveProperty("kind", kyc.kind);
    expect(payload).toHaveProperty(
      "customerReferenceId",
      kyc.customerReferenceId,
    );
  });
});
