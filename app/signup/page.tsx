import SignUpForm from "@/components/signup/form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="h-lvh flex justify-center items-center">
      <Card className="w-xl mx-auto p-4">
        <div className="text-red-400 text-center py-8">
          该系统暂不对外开放，有问题请联系管理员
        </div>
        <CardTitle className="text-center text-2xl font-bold mb-4">
          注册
        </CardTitle>
        <CardContent>
          <Suspense>
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
