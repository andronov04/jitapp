import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useStores } from '@/hooks/useStores';
import { passwordSchema } from '@/lib/schemas/auth.schema';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { NEXT_PUBLIC_BASE_URL } from '@/constants';

const FormSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const AuthView = observer(() => {
  const {
    app: { modalState, setModalState },
  } = useStores();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getRedirectUrl = () => {
    const baseUrl = `${NEXT_PUBLIC_BASE_URL}/auth/callback`;
    const nextUrl = document.location.pathname;
    // try {
    //   const el = document.querySelector("#prompt") as HTMLTextAreaElement;
    //   if (el && el.value) {
    //     url += `?prompt=${encodeURIComponent(el.value)}`;
    //   }
    // } catch (e) {
    //   console.error("Error fetching prompt value:", e);
    // }
    return `${baseUrl}?next=${nextUrl}`; //`${baseUrl}?next=${encodeURIComponent(url)}`;
  };

  async function onSubmit(body: z.infer<typeof FormSchema>) {
    // // TODO show errors
    // const resp = await fetch(`${NEXT_API_BASE_URL}/auth/email`, {
    //   method: "POST",
    //   body: JSON.stringify(body),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    // });
    // if (resp.status === 201) {
    //   const data = await resp.json();
    //   if (!data) return;
    //   setUser(data);
    //   setModalState("");
    //   await queryClient.invalidateQueries();
    // } else {
    //   let error: any = {};
    //   try {
    //     error = await resp.json();
    //   } catch {}
    //   toast.error(error?.message || "Something went wrong");
    // }
  }
  return (
    <div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      required
                      className="w-full"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      minLength={6}
                      required
                      autoComplete="password"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {/*<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />*/}
              {modalState === 'authSignup' ? 'Sign up with Email' : ''}
              {modalState === 'authLogin' ? 'Log in with Email' : ''}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              {' '}
              Or continue with{' '}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="shadow-none"
            onClick={async () => {
              await createSupabaseBrowser().auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: getRedirectUrl(),
                  scopes: 'https://www.googleapis.com/auth/userinfo.email',
                },
              });
            }}
            variant="outline"
            type="button"
            disabled={false}
          >
            <div>
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
            </div>{' '}
            Google
          </Button>
          <Button
            onClick={async () => {
              await createSupabaseBrowser().auth.signInWithOAuth({
                provider: 'github',
                options: {
                  redirectTo: getRedirectUrl(),
                },
              });
            }}
            variant="outline"
            type="button"
            className="shadow-none"
            disabled={false}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
            </div>{' '}
            Github
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 px-8 text-center text-xs">
        By continuing, you agree to our{' '}
        <a
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>
      <div>
        {modalState === 'authSignup' && (
          <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-center text-xs">
            Already have an account?{' '}
            <Button
              onClick={() => {
                setModalState('authLogin');
              }}
              size="sm"
              className="h-auto p-0"
              variant="link"
            >
              Log in
            </Button>
          </div>
        )}
        {modalState === 'authLogin' && (
          <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-center text-xs">
            Don‘t have an account?{' '}
            <Button
              onClick={() => {
                setModalState('authSignup');
              }}
              size="sm"
              className="h-auto p-0"
              variant="link"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default AuthView;
