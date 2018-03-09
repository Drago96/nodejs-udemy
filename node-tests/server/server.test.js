const request = require("supertest");
const app = require("./server").app;
const expect = require("chai").expect;

describe("Server", () => {
    describe("GET /", () => {
        it("should return hello world response", (done) => {
            request(app)
                .get("/")
                .expect(404)
                .expect((response) => {
                    expect(response.body).to.include({
                        name: "Todo App v1.0"
                    });
                })
                .end(done);
        });
    });

    describe("GET /users", () => {
        it("should return correct user array for request to /users",
            (done) => {
                request(app)
                    .get("/users")
                    .expect(200)
                    .expect((response) => {
                        expect(response.body).to.deep.equal([{
                            name: "User 1",
                            age: 10
                        }, {
                            name: "User 2",
                            age: 20
                        }, {
                            name: "User 3",
                            age: 30
                        }]);
                    })
                    .end(done);
            });
    });
});
