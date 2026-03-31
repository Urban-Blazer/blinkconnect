import * as react_jsx_runtime from 'react/jsx-runtime';

interface Colors {
    textSecondary: string;
    textMuted: string;
    border: string;
    text: string;
    accent: string;
    hoverBg: string;
}
interface SuiConnectViewProps {
    colors: Colors;
    onClose: () => void;
}
declare function SuiConnectView({ colors, onClose }: SuiConnectViewProps): react_jsx_runtime.JSX.Element;

export { SuiConnectView as default };
