import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { PricingProvider } from '@/context/PricingContext';
import '../app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <PricingProvider>
                <Component {...pageProps} />
            </PricingProvider>
        </AuthProvider>
    );
}
