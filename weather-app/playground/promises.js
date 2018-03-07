const asyncAdd = (a, b) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (typeof a === "number" && typeof b === "number") {
            resolve(a + b);
        } else {
            reject("Arguments must be numbers.");
        }
    }, 1500);
});

asyncAdd(5, 7)
    .then((result) => {
        console.log(result);
        return asyncAdd(result, 33);
    })
    .then((result) => {
        console.log(result);
    })
    .catch(error => console.log(error));

// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         if (Math.random() > 0.5) {
//             resolve("Hey. It worked!");
//         } else {
//             reject("Rejected promise.");
//         }
//     }, 2000);
// });

// promise.then((result) => {
//     console.log(result);
// }, error => console.log(error));

