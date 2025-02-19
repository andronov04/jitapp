import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { cn, generateUuid } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import { StoreWrapper } from '@/lib/providers/store-provider';
import { getModels } from '@/lib/actions/model';
import { ReactScan } from '@/app/ReactScan';
import { auth } from '@/lib/supabase/auth';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'JIT.dev',
  description: 'Generate code',
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(0 0% 13%)'; //'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // { currentUser, models, authLoaded: true }
  // getModels();
  const models = await getModels();
  const currentUser = await auth();
  const users = [];
  if (currentUser) {
    users.push({
      id: currentUser.id,
      username: currentUser?.username,
      isCurrentUser: true,
    });
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      {/*<ReactScan />*/}
      <body
        className={cn(
          roboto.className,
          'bg-background min-h-screen font-sans antialiased',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <StoreWrapper
            app={{
              models,
              users,
              currentUser: currentUser?.id,
              currentBox: { id: generateUuid() },
            }}
          >
            {children}
          </StoreWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
