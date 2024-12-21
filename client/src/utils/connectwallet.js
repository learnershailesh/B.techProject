import { ethers } from "ethers";
export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const account = await ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return {provider, signer };
}
