import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { B as BlinkConnectConfig, c as ChainType, A as AdapterHookResult } from '../../types-Cw0KStB0.cjs';

interface TronProviderProps {
    children: ReactNode;
    config: BlinkConnectConfig;
    onAdapter: (chain: ChainType, adapter: AdapterHookResult) => void;
}
declare function TronProvider({ children, config, onAdapter }: TronProviderProps): react_jsx_runtime.JSX.Element;

export { TronProvider as default };
