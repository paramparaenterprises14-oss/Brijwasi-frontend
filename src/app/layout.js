import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from './components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'The Brijwasi',
  description: 'Authentic flavors, royal hospitality',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}