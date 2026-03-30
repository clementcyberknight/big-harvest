import { Keypair } from "@solana/web3.js";
import * as SecureStore from "expo-secure-store";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const walletStorage = createMMKV({
  id: "wallet-storage",
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => walletStorage.set(name, value),
  getItem: (name) => walletStorage.getString(name) ?? null,
  removeItem: (name) => walletStorage.remove(name),
};

type LocalWallet = {
  address: string;
  createdAt: number;
};

interface WalletState {
  localWallet: LocalWallet | null;
  isSeekerAuthenticated: boolean;
  setSeekerAuthenticated: (value: boolean) => void;
  createLocalWallet: () => Promise<LocalWallet>;
  getLocalWalletSecretKey: () => Promise<Uint8Array | null>;
}

const WALLET_SECRET_KEY = "wallet.local.secretKey";

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      localWallet: null,
      isSeekerAuthenticated: false,
      setSeekerAuthenticated: (value) => set({ isSeekerAuthenticated: value }),
      createLocalWallet: async () => {
        const existingWallet = get().localWallet;
        if (existingWallet) {
          return existingWallet;
        }

        const keypair = Keypair.generate();
        await SecureStore.setItemAsync(
          WALLET_SECRET_KEY,
          JSON.stringify(Array.from(keypair.secretKey)),
          {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          },
        );

        const wallet = {
          address: keypair.publicKey.toBase58(),
          createdAt: Date.now(),
        };

        set({ localWallet: wallet });
        return wallet;
      },
      getLocalWalletSecretKey: async () => {
        const raw = await SecureStore.getItemAsync(WALLET_SECRET_KEY);
        if (!raw) {
          return null;
        }

        try {
          const parsed = JSON.parse(raw) as number[];
          if (!Array.isArray(parsed)) {
            return null;
          }
          return new Uint8Array(parsed);
        } catch {
          return null;
        }
      },
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
