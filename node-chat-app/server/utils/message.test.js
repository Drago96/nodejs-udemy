const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message");

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

describe("generateLocationMessage", () => {
    it("should generate correct location object", () => {
        const from = "TestFrom";
        const latitude = 10.33;
        const longitude = 21.13;

        const expectedUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message = generateLocationMessage(from, latitude, longitude);

        expect(message).toMatchObject({
            from, url: expectedUrl
        });
        expect(typeof message.createdAt).toBe("number");
    });
});
