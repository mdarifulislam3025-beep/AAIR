import { loginController, registerController, verifyOtpController } from "@/modules/auth/auth.controller";

export const authRoutes = {
  register: registerController,
  verifyOtp: verifyOtpController,
  login: loginController,
};
