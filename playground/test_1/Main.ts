const arr: Array<{name: string}> = [{name: "r1"}, {name: "r2"}];

arr.forEach(item => console.log(item.name));

const tmp: {name: string} = arr[0];
tmp.name = "r3";
arr.forEach(item => console.log(item.name));

const arr2: number[] = [1, 2, 3, 1, 1, 2, 3];
arr2.filter(item => item !== 1).forEach(item => console.log(item))