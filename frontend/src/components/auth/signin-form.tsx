import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

import { useAppDispatch } from "@/redux/hooks"; // Hook của chúng ta
import { signIn } from "@/redux/slices/authSlice";


const signInSchema = z.object({
  username: z.string("Username is required"),
  password: z.string("Password is required"),
});



type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // const { signIn } = useAuthStore(); // destructure signIn function from useAuthStore
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    try {
      // await signIn(username, password);
      await dispatch(signIn({ username, password })).unwrap(); 
      navigate("/admin", { replace: true });
    } catch (error) {

    }

  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent>
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="Logo" />
                </a>

                <h1 className="text-2x1 font-bold">Sign In</h1>
                <p className="text-muted-foreground text-balance">
                  Sign in your admin account
                </p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="tuong_hoang_phu_04"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="error-message">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="error-message">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Sign In
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
