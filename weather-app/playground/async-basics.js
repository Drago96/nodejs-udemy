console.log("Starting app");

setTimeout(() => console.log("Inside of callback"), 0);

console.log("Finishing up");

for (let i = 0; i < 100000; i++) {
    console.log(i);
}
