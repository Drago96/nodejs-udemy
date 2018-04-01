const expect = require("expect");

const { generateMessage } = require("./message");

describe("generateMessage", () => {
    it("should return the correct message object", () => {
        const from = "TestFrom";
        const text = "TestText";

        const message = generateMessage(from, text);

        expect(message).toMatchObject({
            from, text
        });
        expect(typeof message.createdAt).toBe("number");
    });
});
