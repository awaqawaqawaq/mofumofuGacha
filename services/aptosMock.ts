// 轻量 Aptos 钱包与支付本地 Mock（无网络）
// 提供：connect/disconnect/getState/subscribe/pay/airdrop

type Network = 'aptos:testnet' | 'aptos:mainnet';

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: Network;
  balances: Record<string, number>; // 资产符号 -> 余额，例如 { APT: 123.45 }
}

type Listener = (s: WalletState) => void;

const LS_KEY = 'aptosMockWallet';

function randomAddress() {
  // 简化的地址，仅用于展示
  const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return '0x' + hex;
}

function readState(): WalletState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as WalletState;
  } catch {}
  const initial: WalletState = {
    connected: false,
    address: null,
    network: 'aptos:testnet',
    balances: { APT: 100 },
  };
  return initial;
}

let state: WalletState = readState();
const listeners: Set<Listener> = new Set();

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l(state));
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getState(): WalletState {
  return state;
}

export function connect() {
  if (!state.connected) {
    state = {
      ...state,
      connected: true,
      address: state.address ?? randomAddress(),
    };
    persist();
    emit();
  }
}

export function disconnect() {
  if (state.connected) {
    state = { ...state, connected: false };
    persist();
    emit();
  }
}

export function airdrop(symbol: string, amount: number) {
  const cur = state.balances[symbol] ?? 0;
  state = { ...state, balances: { ...state.balances, [symbol]: cur + amount } };
  persist();
  emit();
}

export function pay(symbol: string, amount: number): { ok: boolean; error?: string } {
  const cur = state.balances[symbol] ?? 0;
  if (!state.connected) return { ok: false, error: '未连接钱包' };
  if (amount <= 0) return { ok: false, error: '金额需大于 0' };
  if (cur < amount) return { ok: false, error: '余额不足' };
  state = { ...state, balances: { ...state.balances, [symbol]: cur - amount } };
  persist();
  emit();
  return { ok: true };
}

