const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

describe("Server", () => {
    beforeEach((done) => {
        Todo.remove().then(() => done());
    });

    describe("POST /todos", () => {
        it("should create a new todo with valid date", (done) => {
            const text = "Test todo text";

            request(app)
                .post("/todos")
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
            completed: false
        };

        const secondTodo = {
            _id: secondTodoId,
            text: "Second test todo",
            completed: true,
            completedAt: 333
        };

        const todos = [firstTodo, secondTodo];

        beforeEach((done) => {
            Todo.insertMany(todos).then(() => done());
        });

        describe("GET /todos", () => {
            it("should get all todos", (done) => {
                request(app)
                    .get("/todos")
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        expect(res.body.todos.length).toBe(2);
                        done();
                    });
            });
        });

        describe("GET /todos/:id", () => {
            it("should return todo when id exists", (done) => {
                request(app)
                    .get(`/todos/${firstTodoId.toHexString()}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        expect(res.body.todo.text).toBe(firstTodo.text);
                        done();
                    });
            });

            it("should return 404 if todo not found", (done) => {
                request(app)
                    .get(`/todos/${new ObjectID().toHexString()}`)
                    .expect(404)
                    .end(done);
            });

            it("should return 400 if id is invalid", (done) => {
                request(app)
                    .get(`/todos/{}}`)
                    .expect(400)
                    .end(done);
            });
        });

        describe("DELETE /todos/:id", () => {
            it("should remove todo if id exists", (done) => {
                const hexId = firstTodoId.toHexString();
                request(app)
                    .delete(`/todos/${hexId}`)
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

            it("should return 404 if todo not found", (done) => {
                request(app)
                    .delete(`/todos/${new ObjectID().toHexString()}`)
                    .expect(404)
                    .end(done);
            });

            it("should return 400 if id is invalid", (done) => {
                request(app)
                    .delete(`/todos/{}}`)
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
