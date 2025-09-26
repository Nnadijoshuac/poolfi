const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BasicPoolModule", (m) => {
  // Deploy MockREEF token first
  const mockREEF = m.contract("MockREEF", ["Mock REEF Token", "MREEF", "1000000000000000000000000"]); // 1M tokens with 18 decimals

  // Deploy BasicPool with MockREEF address
  const basicPool = m.contract("BasicPool", [mockREEF]);

  return { mockREEF, basicPool };
});
