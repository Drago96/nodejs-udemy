const sinon = require("sinon");
const rewire = require("rewire");

describe("App", () => {
    let app;
    let db;

    beforeEach(() => {
        app = rewire("./app");
        db = {
            saveUser: sinon.spy()
        };
        app.__set__("db", db);
    });

    it("should call saveUser with user object", () => {
        const email = "dragproychev@gmail.com";
        const password = "123abc";

        app.handleSignUp(email, password);
        sinon.assert.calledWith(db.saveUser, {
            email,
            password
        });
    });
});
