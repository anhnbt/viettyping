const items = ['ba', 'bóng', 'bò', 'bé', 'bàn'];
let rotation = 0;
const sliceAngle = 360 / items.length;

for (let i = 0; i < 5; i++) {
  const winnerIndex = Math.floor(Math.random() * items.length);
  const winnerTextAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
  const randomOffset = 0; // Math.random() * (sliceAngle * 0.8) - (sliceAngle * 0.4);
  const targetRotation = rotation + (5 * 360) + (360 - winnerTextAngle) - (rotation % 360) + randomOffset;
  
  console.log(`Spin ${i}: winner=${items[winnerIndex]}, index=${winnerIndex}, textAngle=${winnerTextAngle}`);
  console.log(`targetRot=${targetRotation}, itemFinalPos=${(targetRotation + winnerTextAngle) % 360}`);
  rotation = targetRotation;
}
