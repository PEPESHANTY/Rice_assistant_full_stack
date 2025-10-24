import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useApp } from './AppContext';
import { Sprout, Globe, Eye, EyeOff, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { authAPI } from '../services/api';
import { LoadingScreen } from './LoadingScreen';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, language, toggleLanguage } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Multi-step signup state
  const [currentStep, setCurrentStep] = useState<'login' | 'phone' | 'otp' | 'details' | 'success' | 'forgot'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    password: '',
    language: 'VI' as 'EN' | 'VI'  // Default to Vietnamese
  });

  const [forgotForm, setForgotForm] = useState({
    phone: '',
    newPassword: ''
  });

  const texts = {
    EN: {
      appName: 'FarmAssist',
      welcome: 'Welcome to FarmAssist',
      loginDesc: 'Sign in to your account to access your farming dashboard',
      signupDesc: 'Create an account to start your smart farming journey',
      login: 'Login',
      signup: 'Sign Up',
      phone: 'Your Mobile Number',
      password: 'Set Password',
      loginPassword: 'Password',
      name: 'Your Name',
      language: 'Preferred Language',
      english: 'English',
      vietnamese: 'Vietnamese',
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signInHere: 'Sign in here',
      signUpHere: 'Sign up here',
      signInButton: 'Sign In',
      createAccount: 'Create Account',
      phonePlaceholder: '+84 123 456 789',
      passwordPlaceholder: 'Create a secure password',
      loginPasswordPlaceholder: 'Enter your password',
      namePlaceholder: 'Enter your full name',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      newPassword: 'New Password',
      backToLogin: 'Back to Login',
      // Multi-step signup
      step1of3: 'Step 1 of 3',
      step2of3: 'Step 2 of 3', 
      step3of3: 'Step 3 of 3',
      enterMobile: 'Enter your mobile number',
      mobileDesc: 'We will send a verification code to this number',
      sendCode: 'Send Verification Code',
      verifyCode: 'Verify Code',
      verificationCode: 'Verification Code',
      codeDesc: 'Enter the 6-digit code we sent to',
      codePlaceholder: '000000',
      resendCode: 'Resend Code',
      resendIn: 'Resend in',
      seconds: 'seconds',
      verify: 'Verify',
      setupAccount: 'Setup Your Account',
      accountDesc: 'Almost done! Complete your profile',
      accountCreated: 'Account Created!',
      successDesc: 'Welcome to the farm assistant app. You can now access all features.',
      getStarted: 'Get Started',
      backButton: 'Back',
      loginWithPhone: 'Sign in with your phone number',
      demoLogin: 'Try Demo',
      demoLoginDesc: 'Test the app with sample data',
      orText: 'or'
    },
    VI: {
      appName: 'Trợ Lý Nông Trại',
      welcome: 'Chào mừng đến với Trợ Lý Nông Trại',
      loginDesc: 'Đăng nhập vào tài khoản của bạn để truy cập bảng điều khiển nông trại',
      signupDesc: 'Tạo tài khoản để bắt đầu hành trình nông nghiệp thông minh',
      login: 'Đăng Nhập',
      signup: 'Đăng Ký',
      phone: 'Số Điện Thoại Của Bạn',
      password: 'Đặt Mật Khẩu',
      loginPassword: 'Mật Khẩu',
      name: 'Tên Của Bạn',
      language: 'Ngôn Ngữ Ưa Thích',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt',
      noAccount: 'Chưa có tài khoản?',
      haveAccount: 'Đã có tài khoản?',
      signInHere: 'Đăng nhập tại đây',
      signUpHere: 'Đăng ký tại đây',
      signInButton: 'Đăng Nhập',
      createAccount: 'Tạo Tài Khoản',
      phonePlaceholder: '+84 123 456 789',
      passwordPlaceholder: 'Tạo mật khẩu bảo mật',
      loginPasswordPlaceholder: 'Nhập mật khẩu của bạn',
      namePlaceholder: 'Nhập họ và tên của bạn',
      forgotPassword: 'Quên Mật Khẩu?',
      resetPassword: 'Đặt Lại Mật Khẩu',
      newPassword: 'Mật Khẩu Mới',
      backToLogin: 'Quay Lại Đăng Nhập',
      // Multi-step signup
      step1of3: 'Bước 1 của 3',
      step2of3: 'Bước 2 của 3',
      step3of3: 'Bước 3 của 3',
      enterMobile: 'Nhập số điện thoại của bạn',
      mobileDesc: 'Chúng tôi sẽ gửi mã xác thực đến số này',
      sendCode: 'Gửi Mã Xác Thực',
      verifyCode: 'Xác Thực Mã',
      verificationCode: 'Mã Xác Thực',
      codeDesc: 'Nhập mã 6 chữ số chúng tôi đã gửi đến',
      codePlaceholder: '000000',
      resendCode: 'Gửi Lại Mã',
      resendIn: 'Gửi lại sau',
      seconds: 'giây',
      verify: 'Xác Thực',
      setupAccount: 'Thiết Lập Tài Khoản',
      accountDesc: 'Sắp xong! Hoàn thiện hồ sơ của bạn',
      accountCreated: 'Đã Tạo Tài Khoản!',
      successDesc: 'Chào mừng đến với Trợ Lý Nông Trại. Giờ bạn có thể truy cập tất cả tính năng.',
      getStarted: 'Bắt Đầu',
      backButton: 'Quay Lại',
      loginWithPhone: 'Đăng nhập bằng số điện thoại',
      demoLogin: 'Thử Demo',
      demoLoginDesc: 'Thử ứng dụng với dữ liệu mẫu',
      orText: 'hoặc'
    }
  };

  const t = texts[language];

  // OTP Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentStep, otpTimer]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.phone?.trim()) {
      toast.error(language === 'EN' ? 'Please enter your phone number' : 'Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(language === 'EN' ? 'Verification code sent!' : 'Đã gửi mã xác thực!');
      setCurrentStep('otp');
      setOtpTimer(30);
      setCanResendOtp(false);
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(language === 'EN' ? 'Failed to send code' : 'Không thể gửi mã');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error(language === 'EN' ? 'Please enter 6-digit code' : 'Vui lòng nhập mã 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otpCode === '123456' || otpCode === '000000') { // Demo codes
        toast.success(language === 'EN' ? 'Phone verified!' : 'Số điện thoại đã được xác thực!');
        setCurrentStep('details');
      } else {
        toast.error(language === 'EN' ? 'Invalid code' : 'Mã không hợp lệ');
      }
    } catch (error) {
      toast.error(language === 'EN' ? 'Verification failed' : 'Xác thực thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete signup
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name?.trim() || !signupForm.password?.trim() || !signupForm.phone?.trim()) {
      toast.error(language === 'EN' ? 'Please fill in all fields' : 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      // Use real API for registration
      const response = await authAPI.register({
        name: signupForm.name.trim(),
        phone: signupForm.phone.trim(),
        password: signupForm.password.trim(),
        language: signupForm.language.toLowerCase() as 'en' | 'vi'
      });
      
      if (response && response.token) {
        // Store token and user data
        localStorage.setItem('authToken', response.token);
        toast.success(language === 'EN' ? 'Account created successfully!' : 'Tạo tài khoản thành công!');
        setCurrentStep('success');
      } else {
        toast.error(language === 'EN' ? 'Signup failed' : 'Đăng ký thất bại');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.detail || 
                          (language === 'EN' ? 'Signup failed' : 'Đăng ký thất bại');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(language === 'EN' ? 'Code resent!' : 'Đã gửi lại mã!');
      setOtpTimer(30);
      setCanResendOtp(false);
      setOtpCode('');
    } catch (error) {
      toast.error(language === 'EN' ? 'Failed to resend' : 'Không thể gửi lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Use AppContext login function to ensure proper state management
      const success = await login('+84123456789', 'demo123');
      
      if (success) {
        localStorage.setItem('demoMode', 'true'); // Mark as demo mode
        toast.success(language === 'EN' ? 'Demo login successful!' : 'Đăng nhập demo thành công!');
        navigate('/dashboard');
      } else {
        toast.error(language === 'EN' ? 'Demo login failed' : 'Đăng nhập demo thất bại');
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error(language === 'EN' ? 'Demo login failed' : 'Đăng nhập demo thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.phone?.trim()) {
      toast.error(language === 'EN' ? 'Please enter your phone number' : 'Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      // Use AppContext login function to ensure proper state management
      const success = await login(loginForm.phone.trim(), loginForm.password?.trim() || '');
      
      if (success) {
        toast.success(language === 'EN' ? 'Login successful!' : 'Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        toast.error(language === 'EN' ? 'Invalid phone number or password' : 'Số điện thoại hoặc mật khẩu không hợp lệ');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 
                          (language === 'EN' ? 'Login failed' : 'Đăng nhập thất bại');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setCurrentStep('forgot');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotForm.phone?.trim()) {
      toast.error(language === 'EN' ? 'Please enter your phone number' : 'Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(language === 'EN' ? 'Password reset instructions sent!' : 'Đã gửi hướng dẫn đặt lại mật khẩu!');
      setCurrentStep('login');
      setActiveTab('login');
    } catch (error) {
      toast.error(language === 'EN' ? 'Failed to reset password' : 'Không thể đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Screen Overlay */}
      {isLoading && (
        <LoadingScreen 
          message={language === 'EN' ? 'Processing...' : 'Đang xử lý...'}
          showProgress={true}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Sprout className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">{t.appName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 sm:h-10 px-3 sm:px-4"
          >
            <Globe className="h-4 w-4 mr-1.5" />
            <span className="text-sm sm:text-base">{language === 'EN' ? 'VI' : 'EN'}</span>
          </Button>
        </div>

        <Card className="shadow-xl border-0 rounded-xl sm:rounded-2xl">
          <CardHeader className="text-center px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">{t.welcome}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8">
            {currentStep === 'forgot' ? (
              // Forgot Password Flow
              <>
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentStep('login');
                      setActiveTab('login');
                    }}
                    className="text-gray-600 -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t.backToLogin}
                  </Button>
                </div>
                <CardDescription className="text-center mb-6 text-sm sm:text-base">
                  {t.resetPassword}
                </CardDescription>

                <form onSubmit={handleResetPassword} className="space-y-5 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="forgot-phone" className="text-base sm:text-lg">{t.phone}</Label>
                    <Input
                      id="forgot-phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={forgotForm.phone}
                      onChange={(e) => setForgotForm({ ...forgotForm, phone: e.target.value })}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg farmer-input"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : t.resetPassword}
                  </Button>
                </form>
              </>
            ) : (
              <Tabs 
                value={activeTab}
                defaultValue="signup" 
                className="w-full"
                onValueChange={(value) => {
                  setActiveTab(value as 'signup' | 'login');
                  if (value === 'signup') {
                    setCurrentStep('phone');
                  } else {
                    setCurrentStep('login');
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-5 sm:mb-6 h-auto bg-transparent gap-3 p-0">
                  <TabsTrigger 
                    value="signup" 
                    className="text-base sm:text-lg py-3 sm:py-4 rounded-lg border-2 border-gray-200 bg-white text-gray-600 data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50 data-[state=active]:shadow-sm data-[state=active]:font-semibold hover:border-green-400 transition-all"
                  >
                    {t.signup}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="login" 
                    className="text-base sm:text-lg py-3 sm:py-4 rounded-lg border-2 border-gray-200 bg-white text-gray-600 data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50 data-[state=active]:shadow-sm data-[state=active]:font-semibold hover:border-green-400 transition-all"
                  >
                    {t.login}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  {/* Multi-step signup flow */}
                  {currentStep === 'phone' && (
                    <>
                      <div className="flex items-center justify-between mb-5 sm:mb-6">
                        <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1">{t.step1of3}</Badge>
                      </div>
                      <CardDescription className="text-center mb-5 sm:mb-6 text-sm sm:text-base">
                        {t.enterMobile}
                      </CardDescription>

                      <form onSubmit={handleSendOtp} className="space-y-5 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="signup-phone" className="text-base sm:text-lg">{t.phone}</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder={t.phonePlaceholder}
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                            required
                            className="h-12 sm:h-14 text-base sm:text-lg farmer-input"
                          />
                          <p className="text-xs sm:text-sm text-gray-500">{t.mobileDesc}</p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                          disabled={isLoading}
                        >
                          {isLoading ? '...' : t.sendCode}
                        </Button>
                      </form>
                    </>
                  )}

                  {currentStep === 'otp' && (
                    <>
                      <div className="flex items-center justify-between mb-5 sm:mb-6">
                        <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1">{t.step2of3}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep('phone')}
                          className="text-gray-600 h-8 sm:h-9"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          <span className="text-xs sm:text-sm">{t.backButton}</span>
                        </Button>
                      </div>
                      <CardDescription className="text-center mb-5 sm:mb-6 text-sm sm:text-base">
                        {t.codeDesc} {signupForm.phone}
                      </CardDescription>

                      <form onSubmit={handleVerifyOtp} className="space-y-5 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="otp-code" className="text-base sm:text-lg">{t.verificationCode}</Label>
                          <Input
                            id="otp-code"
                            type="text"
                            placeholder={t.codePlaceholder}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            maxLength={6}
                            className="h-12 sm:h-14 text-base sm:text-lg text-center tracking-widest farmer-input"
                          />
                          <div className="text-center">
                            {canResendOtp ? (
                              <Button
                                type="button"
                                variant="link"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-green-600 text-xs sm:text-sm"
                              >
                                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                {t.resendCode}
                              </Button>
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-500">
                                {t.resendIn} {otpTimer} {t.seconds}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                          disabled={isLoading || otpCode.length !== 6}
                        >
                          {isLoading ? '...' : t.verify}
                        </Button>
                      </form>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-blue-700 text-center">
                          {language === 'EN' ? 'Demo: Use 123456 or 000000' : 'Demo: Dùng 123456 hoặc 000000'}
                        </p>
                      </div>
                    </>
                  )}

                  {currentStep === 'details' && (
                    <>
                      <div className="flex items-center justify-between mb-5 sm:mb-6">
                        <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1">{t.step3of3}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep('otp')}
                          className="text-gray-600 h-8 sm:h-9"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          <span className="text-xs sm:text-sm">{t.backButton}</span>
                        </Button>
                      </div>
                      <CardDescription className="text-center mb-5 sm:mb-6 text-sm sm:text-base">
                        {t.setupAccount}
                      </CardDescription>

                      <form onSubmit={handleCompleteSignup} className="space-y-5 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="signup-name" className="text-base sm:text-lg">{t.name}</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder={t.namePlaceholder}
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            required
                            className="h-12 sm:h-14 text-base sm:text-lg farmer-input"
                          />
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="signup-password" className="text-base sm:text-lg">{t.password}</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder={t.passwordPlaceholder}
                              value={signupForm.password}
                              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                              required
                              className="h-12 sm:h-14 text-base sm:text-lg pr-12 farmer-input"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                          disabled={isLoading}
                        >
                          {isLoading ? '...' : t.createAccount}
                        </Button>
                      </form>
                    </>
                  )}

                  {currentStep === 'success' && (
                    <div className="text-center space-y-5 sm:space-y-6">
                      <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t.accountCreated}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{t.successDesc}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setActiveTab('login');
                          setCurrentStep('login');
                          // Pre-fill the login form with the newly created user's phone number
                          setLoginForm({
                            phone: signupForm.phone,
                            password: ''
                          });
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                      >
                        {t.getStarted}
                      </Button>
                    </div>
                  )}

                  {/* Show demo login only on initial step */}
                  {currentStep === 'phone' && (
                    <div className="mt-5 sm:mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">{t.orText}</span>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                      >
                        {t.demoLogin}
                      </Button>
                      <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                        {t.demoLoginDesc}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="login">
                  <CardDescription className="text-center mb-5 sm:mb-6 text-sm sm:text-base">
                    {t.loginWithPhone}
                  </CardDescription>
                  
                  <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="login-phone" className="text-base sm:text-lg">{t.phone}</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        placeholder={t.phonePlaceholder}
                        value={loginForm.phone}
                        onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg farmer-input"
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-base sm:text-lg">{t.loginPassword}</Label>
                        <Button
                          type="button"
                          variant="link"
                          onClick={handleForgotPassword}
                          className="h-auto p-0 text-xs sm:text-sm text-green-600 hover:text-green-700"
                        >
                          {t.forgotPassword}
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t.loginPasswordPlaceholder}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="h-12 sm:h-14 text-base sm:text-lg pr-12 farmer-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (language === 'EN' ? 'Signing in...' : 'Đang đăng nhập...') : t.signInButton}
                    </Button>
                  </form>

                  <div className="mt-5 sm:mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">{t.orText}</span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4 h-12 sm:h-14 text-base sm:text-lg farmer-button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                    >
                      {t.demoLogin}
                    </Button>
                    <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                      {t.demoLoginDesc}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-5 sm:mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-sm sm:text-base h-9 sm:h-10"
          >
            ← {language === 'EN' ? 'Back to Home' : 'Quay Lại Trang Chủ'}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
