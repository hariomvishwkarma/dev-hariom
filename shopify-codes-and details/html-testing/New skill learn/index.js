// var
var x = 10;
var x = 20; // allowed
console.log(x); // 20

// let
let y = 10;
// let y = 20; // ❌ Error (can't redeclare in same scope)
y = 20; // ✅ re-assign allowed
console.log(y); // 20

// const
const z = 10;
// z = 20; // ❌ Error (can't re-assign)
console.log(z); // 10

// const with object
const obj = { name: "Hariom" };
obj.name = "Vishwakarma"; // ✅ allowed (object property change)
console.log(obj);
