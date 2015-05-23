var input = typeof process !== "undefined" ? (process.argv[2] || 14) : 14;
console.log("Input: " + input);

// 数字火柴棍数量
var stick_len = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

// A + B = C => (0 <= C.length - A.length <= 1)
// B 至少 2 根
// max = (Input - 4 - 2) / 2
// 这步应该还有很多能简化的方法，不过应该数量级不会变

// 通过上面规则推算 A 最大长度
var max_length = parseInt((input - 4 - 2) / 2 / 2, 10);

// 显示次数
var count = 0;

// 最大长度对应的最大值，由 1 组成
var max = 0;

while (max_length > 0) {
    max += Math.pow(10, max_length - 1);
    max_length--;
}

// TODO
// 这个函数都是重复计算可以缓存计算结果
var len = function (no) {
    var l = 0;

    while (no >= 0) {
        l += stick_len[no % 10];
        no = parseInt(no / 10, 10);
        if (no === 0) {
            break;
        }
    }

    return l;
};

// TODO
// 这里可以优化, 内层循环知道外层的长度
// 所以可以和 max_length 配合一下优化一下循环次数
// 这里只是演示就先不做了

for (var i = 0; i <= max; i++) {
    for (var j = 0; j <= max; j++) {
        if (len(i) + len(j) + len(i + j) === (input - 4)) {
            console.log(i + " + " + j + " = " + (i + j));
            count++;
        }
    }
}

console.log("Count: " + count);

