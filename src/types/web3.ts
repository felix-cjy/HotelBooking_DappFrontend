export interface Web3ProviderProps {
  children: React.ReactNode;
}

export interface ContractAddresses {
  booking: `0x${string}`;
  token: `0x${string}`;
}

export interface ContractConfig {
  address: `0x${string}`;
  abi: any[];
}
