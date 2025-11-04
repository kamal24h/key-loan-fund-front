import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendOTP, verifyOTP, isLoading } = useAuthStore();
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: 'Verification code sent',
        description: `Check your email at ${email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await verifyOTP(email, otp);
      toast({
        title: 'Welcome back',
        description: 'Successfully logged in',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Invalid code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="h-8 w-8" />
            <span className="text-2xl font-bold">Fund Manager Pro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Professional Fund Management Platform
          </h1>
          
          <p className="text-lg opacity-90 mb-12">
            Institutional-grade tools for managing private equity, venture capital, and alternative investments with confidence.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-foreground/10 p-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Performance</h3>
                <p className="text-sm opacity-80">Track IRR, MOIC, and NAV with precision</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-foreground/10 p-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                <p className="text-sm opacity-80">Bank-level security for your sensitive data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-foreground/10 p-3">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Investor Relations</h3>
                <p className="text-sm opacity-80">Streamlined reporting and communication</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm opacity-70">
          © 2024 Fund Manager Pro. Enterprise-grade fund management.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold">Fund Manager Pro</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
              <CardDescription>
                Enter your email to receive a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'email' ? (
                <div key="email-form">
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send verification code'}
                    </Button>
                  </form>
                </div>
              ) : (
                <div key="otp-form">
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={isLoading}
                        autoFocus
                        maxLength={6}
                      />
                      <p className="text-sm text-muted-foreground">
                        Code sent to {email}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify and sign in'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setStep('email');
                          setOtp('');
                        }}
                        disabled={isLoading}
                      >
                        Use different email
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
