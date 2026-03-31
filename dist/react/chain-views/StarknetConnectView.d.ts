import * as react_jsx_runtime from 'react/jsx-runtime';

interface Colors {
    textSecondary: string;
    border: string;
    text: string;
    accent: string;
    hoverBg: string;
}
interface StarknetConnectViewProps {
    colors: Colors;
    onClose: () => void;
}
declare function StarknetConnectView({ colors, onClose }: StarknetConnectViewProps): react_jsx_runtime.JSX.Element;

export { StarknetConnectView as default };
