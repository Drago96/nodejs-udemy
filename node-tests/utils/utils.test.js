const utils = require("./utils");
const expect = require("chai").expect;

describe("Utils", () => {
    describe("#add", () => {
        it("should add two numbers", () => {
            const result = utils.add(3, 5);
            expect(result).to.equal(8);
            expect(result).to.be.a("number");
        });
    });

    describe("#square", () => {
        it("should square a number", () => {
            const result = utils.square(3);
            expect(result).to.equal(9);
            expect(result).to.be.a("number");
        });
    });

    describe("#setName", () => {
        it("should set first and last name correctly", () => {
            let user = {
                location: "Plovdiv",
                age: 21
            };
            user = utils.setName(user, "Dragomir Proychev");
            expect(user).to.deep.equal({
                location: "Plovdiv",
                age: 21,
                firstName: "Dragomir",
                lastName: "Proychev"
            });
            expect(user).to.be.a("object");
        });
    });

    describe("#asyncAdd", () => {
        it("should execute callback function with sum of arguments", (done) => {
            utils.asyncAdd(4, 3, (sum) => {
                expect(sum).to.equal(7);
                expect(sum).to.be.a("number");
                done();
            });
        });
    });

    describe("#asyncSquare", () => {
        it("should execute callback function with square of argument",
            (done) => {
                utils.asyncSquare(5, (square) => {
                    expect(square).to.equal(25);
                    expect(square).to.be.a("number");
                    done();
                });
            });
    });
});
