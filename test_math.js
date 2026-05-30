const items = ['A', 'B', 'C', 'D'];
const sliceAngle = 360 / items.length;
const winnerIndex = 1; // 'B'
const winnerTextAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
const targetRotation = 0 + (5 * 360) + (360 - winnerTextAngle);

console.log("targetRotation", targetRotation);
