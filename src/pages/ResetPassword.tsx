
import { ResetPassword as ResetPasswordComponent } from "@/components/auth/ResetPassword";
import { NavigationBar } from "@/components/navigation/NavigationBar";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <ResetPasswordComponent />
      </div>
    </div>
  );
};

export default ResetPassword;
