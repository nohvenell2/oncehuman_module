import './globals.css';
import { Nanum_Gothic } from 'next/font/google';

const nanum = Nanum_Gothic({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className={nanum.className}>
            <body>{children}</body>
        </html>
    );
}
