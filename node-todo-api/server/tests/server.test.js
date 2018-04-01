const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { users, populateUsers } = require("./seed/seed");

describe("Server", function () {
    this.timeout(10000);

    beforeEach(populateUsers);

    describe("Todos", () => {
        beforeEach((done) => {
            Todo.remove().then(() => done());
        });

        describe("POST /todos", () => {
            it("should create a new todo with valid date", (done) => {
                const text = "Test todo text";

                request(app)
                    .post("/todos")
                    .set("x-auth", users[0].tokens[0].token)
                    .send({
                        text
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.text).toBe(text);
                    })
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Todo.find().then((todos) => {
                            expect(todos.length).toBe(1);
                            expect(todos[0].text).toBe(text);
                            done();
                        }).catch((e) => done(e));
                    });
            });

            it("should not create todo with empty object", (done) => {
                request(app)
                    .post("/todos")
                    .set("x-auth", users[0].tokens[0].token)
                    .send({})
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Todo.find().then((todos) => {
                            expect(todos.length).toBe(0);
                            done();
                        }).catch((e) => done(e));
                    });
            });
        });

        describe("with predefined data in database", () => {
            const firstTodoId = new ObjectID();
            const secondTodoId = new ObjectID();

            const firstTodo = {
                _id: firstTodoId,
                text: "First test todo",
                completed: false,
                _creator: users[0]._id
            };

            const secondTodo = {
                _id: secondTodoId,
                text: "Second test todo",
                completed: true,
                completedAt: 333,
                _creator: users[1]._id
            };

            const todos = [firstTodo, secondTodo];

            beforeEach((done) => {
                Todo.insertMany(todos).then(() => done());
            });

            describe("GET /todos", () => {
                it("should get all todos for current user", (done) => {
                    request(app)
                        .get("/todos")
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }

                            expect(res.body.todos.length).toBe(1);
                            done();
                        });
                });
            });

            describe("GET /todos/:id", () => {
                it("should return todo when id exists", (done) => {
                    request(app)
                        .get(`/todos/${firstTodoId.toHexString()}`)
                        .expect(200)
                        .set("x-auth", users[0].tokens[0].token)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }

                            expect(res.body.todo.text).toBe(firstTodo.text);
                            done();
                        });
                });

                it("should not return todo created by another user", (done) => {
                    request(app)
                        .get(`/todos/${firstTodoId.toHexString()}`)
                        .expect(404)
                        .set("x-auth", users[1].tokens[0].token)
                        .end(done);
                });

                it("should return 404 if todo not found", (done) => {
                    request(app)
                        .get(`/todos/${new ObjectID().toHexString()}`)
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(404)
                        .end(done);
                });

                it("should return 400 if id is invalid", (done) => {
                    request(app)
                        .get(`/todos/{}}`)
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(400)
                        .end(done);
                });
            });

            describe("DELETE /todos/:id", () => {
                it("should remove todo if id exists", (done) => {
                    const hexId = firstTodoId.toHexString();
                    request(app)
                        .delete(`/todos/${hexId}`)
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.todo._id).toBe(hexId);
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }

                            Todo.findById(hexId)
                                .then(todo => {
                                    expect(todo).toBe(null);
                                    done();
                                }).catch(e => done(e));
                        });
                });

                it("should not remove todo by another user", (done) => {
                    const hexId = firstTodoId.toHexString();
                    request(app)
                        .delete(`/todos/${hexId}`)
                        .set("x-auth", users[1].tokens[0].token)
                        .expect(404)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }

                            Todo.findById(hexId)
                                .then(todo => {
                                    expect(todo).not.toBe(null);
                                    done();
                                }).catch(e => done(e));
                        });
                });

                it("should return 404 if todo not found", (done) => {
                    request(app)
                        .delete(`/todos/${new ObjectID().toHexString()}`)
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(404)
                        .end(done);
                });

                it("should return 400 if id is invalid", (done) => {
                    request(app)
                        .delete(`/todos/{}}`)
                        .set("x-auth", users[0].tokens[0].token)
                        .expect(400)
                        .end(done);
                });
            });

            describe("PATCH /todos/:id", () => {
                it("should update todo correctly when setting complete to true"
                    , (done) => {
                        const hexId = firstTodoId.toHexString();

                        const expectedText = "Test text";
                        const patchBody = {
                            text: expectedText,
                            completed: true
                        };

                        request(app)
                            .patch(`/todos/${hexId}`)
                            .set("x-auth", users[0].tokens[0].token)
                            .send(patchBody)
                            .expect(200)
                            .expect(res => {
                                const todo = res.body.todo;
                                expect(todo.completed).toBe(true);
                                expect(todo.text).toBe(expectedText);
                                expect(typeof todo.completedAt).toBe("number");
                            })
                            .end(done);
                    });

                it("should fail to update todo from another user"
                    , (done) => {
                        const hexId = firstTodoId.toHexString();

                        const expectedText = "Test text";
                        const patchBody = {
                            text: expectedText,
                            completed: true
                        };

                        request(app)
                            .patch(`/todos/${hexId}`)
                            .set("x-auth", users[1].tokens[0].token)
                            .send(patchBody)
                            .expect(404)
                            .end(done);
                    });

                it("should update todo correctly when setting completed to false"
                    , (done) => {
                        const hexId = secondTodoId.toHexString();

                        const expectedText = "Test text";
                        const patchBody = {
                            text: expectedText,
                            completed: false
                        };

                        request(app)
                            .patch(`/todos/${hexId}`)
                            .send(patchBody)
                            .set("x-auth", users[1].tokens[0].token)
                            .expect(200)
                            .expect(res => {
                                const todo = res.body.todo;
                                expect(todo.completed).toBe(false);
                                expect(todo.text).toBe(expectedText);
                                expect(todo.completedAt).toBe(null);
                            })
                            .end(done);
                    });
            });
        });
    });

    describe("Users", () => {
        describe("GET /users/me", () => {
            it("should return user if authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body._id).toBe(users[0]._id.toHexString());
                        expect(res.body.email).toBe(users[0].email);
                    })
                    .end(done);
            });

            it("should return 401 if not authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .expect(401)
                    .expect(res => {
                        expect(res.body).toEqual({});
                    })
                    .end(done);
            });
        });

        describe("POST /users", () => {
            it("should create a user with correct data", (done) => {
                const email = "uniqueEmail@email.com";
                const password = "123ert";

                request(app)
                    .post("/users")
                    .send({
                        email, password
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.headers["x-auth"]).not.toBeFalsy();
                        expect(res.body._id).not.toBeFalsy();
                        expect(res.body.email).not.toBeFalsy();
                    })
                    .end(err => {
                        if (err) {
                            return done(err);
                        }

                        User.findOne({ email }).then(user => {
                            expect(user).not.toBeFalsy();
                            expect(user.password).not.toBe(password);
                            done();
                        }).catch(e => done(e));
                    });
            });

            it("should return validation errors if request invalid", (done) => {
                const email = "invalid";
                const password = "inv";

                request(app)
                    .post("/users")
                    .send({ email, password })
                    .expect(400)
                    .end(done);
            });

            it("should not create a user if email is in use", (done) => {
                request(app)
                    .post("/users")
                    .send({ email: users[0].email, password: "validpass" })
                    .expect(400)
                    .end(done);
            });
        });

        describe("POST /users/login", () => {
            it("should login user and return auth token", (done) => {
                request(app)
                    .post("/users/login")
                    .send({
                        email: users[0].email,
                        password: users[0].password
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.headers["x-auth"]).not.toBeFalsy();
                    })
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        User.findById(users[0]._id)
                            .then(user => {
                                expect(user.tokens[1]).toEqual(
                                    expect.objectContaining({
                                        access: "auth",
                                        token: res.headers["x-auth"]
                                    }));
                                done();
                            })
                            .catch(e => done(e));
                    });
            });

            it("should reject invalid login", (done) => {
                request(app)
                    .post("/users/login")
                    .send({
                        email: users[0].email,
                        password: "wrongPassword"
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.headers["x-auth"]).toBeFalsy();
                    })
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        User.findById(users[0]._id)
                            .then(user => {
                                expect(user.tokens.length).toBe(1);
                                done();
                            })
                            .catch(e => done(e));
                    });
            });
        });

        describe("DELETE /users/me/token", () => {
            it("should remove auth token on logout", (done) => {
                request(app)
                    .delete("/users/me/token")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        User.findById(users[0]._id)
                            .then((user) => {
                                expect(user.tokens.length).toBe(0);
                                done();
                            })
                            .catch(e => done(e));
                    });
            });

            it("should return 401 if user not logged in", (done) => {
                request(app)
                    .delete("/users/me/token")
                    .set("x-auth", "invalidtoken")
                    .expect(401)
                    .end(done);
            });
        });
    });
});
