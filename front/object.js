let a = {};

console.log("a :", a);
const b = { b: "b" };
a = b;
console.log("a connected :", a);

b.c = "c";

console.log("b updated:", b);
console.log("a updated as well? :", a);
console.log("a and b same? :", a === b);
