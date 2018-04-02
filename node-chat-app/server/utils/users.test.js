const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: "1",
            name: "Drago",
            room: "Cool room"
        }, {
            id: "2",
            name: "John",
            room: "Not so cool room"
        }, {
            id: "3",
            name: "Annie",
            room: "Not so cool room"
        }];
    });

    describe("addUser", () => {
        it("should add new user", () => {
            const user = {
                id: "testId",
                name: "testName",
                room: "testRoom"
            };

            users.addUser(user.id, user.name, user.room);

            expect(users.users).toContainEqual(user);
        });
    });

    describe("getUserList", () => {
        it("should return users for correct room", () => {
            const userList = users.getUserList("Not so cool room");

            expect(userList).toEqual(["John", "Annie"]);
        });
    });

    describe("removeUser", () => {
        it("should remove user if id exists", () => {
            const userId = "1";
            const user = users.removeUser(userId);

            expect(user.id).toBe(userId);
            expect(users.users.length).toBe(2);
        });

        it("should not remove user if id does not exist", () => {
            const userId = "invalid";
            const user = users.removeUser(userId);

            expect(user).toBe(undefined);
            expect(users.users.length).toBe(3);
        });
    });

    describe("getUser", () => {
        it("should return user if id exists", () => {
            const userId = "2";
            const user = users.getUser(userId);

            expect(user.id).toBe(userId);
        });

        it("should not return user if id does not exist", () => {
            const userId = "invalid";
            const user = users.getUser(userId);

            expect(user).toBe(undefined);
        });
    });
});
