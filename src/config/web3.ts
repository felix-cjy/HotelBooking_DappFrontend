import { createConfig, http } from "wagmi";
import { Chain } from "viem";
import { mainnet } from "wagmi/chains";

// 替换为您的 WalletConnect projectId
export const projectId = "YOUR_ACTUAL_PROJECT_ID"; // 需要从 WalletConnect 网站获取

// 定义 Morph Holesky 测试网
export const morphHolesky = {
  id: 2810,
  name: "Morph Holesky Testnet",
  network: "morph-holesky",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-quicknode-holesky.morphl2.io"],
    },
    public: {
      http: ["https://rpc-quicknode-holesky.morphl2.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer-holesky.morphl2.io",
    },
  },
  testnet: true,
} as const satisfies Chain;

// 元数据配置
const metadata = {
  name: "Hotel Booking DApp",
  description: "A decentralized hotel booking application",
  url: "https://your-website.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 支持的链
export const chains = [morphHolesky, mainnet] as const;

// Wagmi 配置
export const wagmiConfig = createConfig({
  chains: [morphHolesky, mainnet],
  transports: {
    [morphHolesky.id]: http(),
    [mainnet.id]: http(),
  },
});
