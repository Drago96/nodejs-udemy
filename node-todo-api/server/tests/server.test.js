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

    describe("GET", () => {
        const firstTodoId = new ObjectID();
        const secondTodoId = new ObjectID();

        const firstTodo = {
            _id: firstTodoId,
            text: "First test todo"
        };

        const secondTodo = {
            _id: secondTodoId,
            text: "Second test todo"
        };

        const todos = [firstTodo, secondTodo];

        beforeEach((done) => {
            Todo.insertMany(todos).then(() => done());
        });

        describe("/todos", () => {
            it("should get all todos", (done) => {
                request(app)
                    .get("/todos")
                    .expect(200)
                    .end((req, res) => {
                        expect(res.body.todos.length).toBe(2);
                        done();
                    });
            });
        });

        describe("/todos/:id", () => {
            it("should return todo when id exists", (done) => {
                request(app)
                    .get(`/todos/${firstTodoId.toHexString()}`)
                    .expect(200)
                    .end((req, res) => {
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
    });
});
