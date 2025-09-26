const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimplePoolManagerModule", (m) => {
  // Deploy MockREEF token first
  const mockREEF = m.contract("MockREEF", ["Mock REEF Token", "MREEF", "1000000000000000000000000"]); // 1M tokens with 18 decimals

  // Deploy SimplePoolManager with MockREEF address
  const simplePoolManager = m.contract("SimplePoolManager", [mockREEF]);

  return { mockREEF, simplePoolManager };
});
