const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Contract", () => {
  let contract;
  let owner, bob, alice;

  beforeEach(async () => {
    const ERC20 = await ethers.getContractFactory("ERC20");
    contract = await ERC20.deploy('Gemcoin', 'GEM', 18, ethers.utils.parseEther('1000'));
    await contract.deployed();
    [owner, bob, alice] = await ethers.getSigners();
  });

  describe("name", () => {
    it("has a correct name", async () => {
      expect(await contract.name()).to.equal("Gemcoin");
    });
  });

  describe("symbol", () => {
    it("has a correct symbol", async () => {
      expect(await contract.symbol()).to.equal("GEM");
    });
  });

  describe("decimals", () => {
    it("has correct decimals", async () => {
      expect(await contract.decimals()).to.equal(18);
    });
  });

  describe("totalSupply", () => {
    it("has the total supply of 1000", async () => {
      expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther('1000'));
    });
  });

  describe("balanceOf", () => {
    it("allocates the total supply to owner account", async () => {
      expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('1000'));
      const balance = await contract.balanceOf(owner.address);
    });
  });

  describe("transfer", () => {
    it("transfer tokens from owner account to bob account", async () => {
      await contract.connect(owner).transfer(bob.address, ethers.utils.parseEther('300'));
      expect(await contract.balanceOf(bob.address)).to.equal(ethers.utils.parseEther('300'));
      expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('700'));
    });

    it("fire 'Tansfer' event when sucessfully transfer token ownership", async () => {
    const transferTx = await contract.connect(owner).transfer(bob.address, ethers.utils.parseEther('300'));
    await expect(transferTx).to.emit(contract, 'Transfer').withArgs(owner.address, bob.address, ethers.utils.parseEther('300'))
    });

    it("throws when transfer to the zero address", async () => {
      const transferTx = contract.connect(owner).transfer(ethers.constants.AddressZero, ethers.utils.parseEther('300'));
      await expect(transferTx).to.be.revertedWith("Transfer to the zero address");
    });

    it("throws when transfer more token than owned", async () => {
      const transferTx = contract.connect(owner).transfer(bob.address, ethers.utils.parseEther('2000'));
      await expect(transferTx).to.be.revertedWith("Insufficient tokens!");
    });
  });

  describe("transferFrom", () => {
    it("transfer tokens from owner account to alice account through bob account", async () => {
      await contract.connect(owner).approve(bob.address, ethers.utils.parseEther('100'));
      await contract.connect(bob).transferFrom(owner.address, alice.address, ethers.utils.parseEther('50'));
      expect(await contract.balanceOf(alice.address)).to.equal(ethers.utils.parseEther('50'));
      expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('950'));
      expect(await contract.allowance(owner.address, bob.address)).to.equal(ethers.utils.parseEther('50'));
    });

    it("fire 'Tansfer' event when sucessfully called transferFrom function", async () => {
      await contract.connect(owner).approve(bob.address, ethers.utils.parseEther('100'));
      const transferTx = await contract.connect(bob).transferFrom(owner.address, alice.address, ethers.utils.parseEther('100'));
      await expect(transferTx).to.emit(contract, 'Transfer').withArgs(owner.address, alice.address, ethers.utils.parseEther('100'))
    });

    it("throws when transfer to the zero address", async () => {
      const transferTx = contract.connect(bob).transferFrom(owner.address, ethers.constants.AddressZero, ethers.utils.parseEther('100'));
      await expect(transferTx).to.be.revertedWith("Transfer to the zero address!");
    });

    it("throws when transfer more tokens than owned", async () => {
      const transferTx = contract.connect(bob).transferFrom(owner.address, alice.address, ethers.utils.parseEther('2000'));
      await expect(transferTx).to.be.revertedWith("Insufficient tokens!");
    });

    it("throws when transfer exceeds approved tokens", async () => {
      await contract.connect(owner).approve(bob.address, ethers.utils.parseEther('100'))
      const transferTx = contract.connect(bob).transferFrom(owner.address, alice.address, ethers.utils.parseEther('200'));
      await expect(transferTx).to.be.revertedWith("Insufficient allowance!");
    });
  });

  describe("approve", () => {
    it("approves bob account to spend 100 tokens on owner account behalf", async () => {
      await contract.connect(owner).approve(bob.address, ethers.utils.parseEther('100'));
      expect(await contract.allowance(owner.address, bob.address)).to.equal(ethers.utils.parseEther('100'));
    });

    it("fire 'Approval' event when successfully called approve function", async () => {
      const approveTx = await contract.connect(owner).approve(bob.address, ethers.utils.parseEther('100'));
      await expect(approveTx).to.emit(contract, 'Approval').withArgs(owner.address, bob.address, ethers.utils.parseEther('100'));
    });

    it("throws when approve to the zero address", async () => {
      const approveTx = contract.connect(owner).approve(ethers.constants.AddressZero, ethers.utils.parseEther('100'));
      await expect(approveTx).to.be.revertedWith("Approve to the zero address!");
    });
  });
});
