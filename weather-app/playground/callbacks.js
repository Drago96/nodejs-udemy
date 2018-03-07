const getUser = (id, callback) => {
    const userObject = {
        id,
        name: "Dragomir"
    };

    setTimeout(() => callback(userObject), 3000);
};

getUser(13, (user) => console.log(user));
