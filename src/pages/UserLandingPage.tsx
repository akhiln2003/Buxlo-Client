import { useEffect, useState } from "react";
import {
  BarChart3,
  Wallet,
  CreditCard,
  Target,
  ArrowRight,
  User,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
  Star,
  Lock,
  MessageSquare,
} from "lucide-react";
import ChatbotModal from "@/components/common/chatBot/ChatbotModal";
import FloatingChatButton from "@/components/common/chatBot/FloatingChatButton";
import { Link } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { useFetchAllTrustedUsMutation } from "@/services/apis/CommonApis";

function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [brandLogos, setBrandLogos] = useState([]);
  const [fetchTrustedUs] = useFetchAllTrustedUsMutation();
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const features = [
    {
      icon: BarChart3,
      title: "Financial Dashboard",
      description:
        "Get a complete overview of your financial health with real-time tracking of income, expenses, and net worth in one unified dashboard.",
      link: UserUrls.dashboard,
    },
    {
      icon: Wallet,
      title: "Smart Wallet Management",
      description:
        "Keep track of your balance, manage multiple accounts, and monitor all your transactions seamlessly from one place.",
      link: UserUrls.dashboard,
    },
    {
      icon: CreditCard,
      title: "Transaction Tracking",
      description:
        "Upload bank statements, add manual entries, and maintain a comprehensive history of all your financial transactions.",
      link: UserUrls.paymentHistory,
    },
    {
      icon: Target,
      title: "Expert Financial Mentorship",
      description:
        "Connect with certified financial advisors who provide personalized guidance to help you achieve your financial goals.",
      link: UserUrls.listMentors,
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description:
        "Chat directly with your booked mentors. Ask questions, get insights, and maintain ongoing communication with ease.",
      link: UserUrls.chat,
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your financial data is encrypted with bank-level security. We never share your information with third parties.",
      link: UserUrls.profile,
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: User },
    { value: "₹2Cr+", label: "Money Managed", icon: TrendingUp },
    { value: "98%", label: "User Satisfaction", icon: Star },
    { value: "24/7", label: "Expert Support", icon: Shield },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "Military-grade encryption keeps your financial data completely safe and private.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Insights",
      description:
        "Real-time analytics and instant updates help you make quick financial decisions.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Intelligence",
      description:
        "Smart algorithms provide personalized recommendations based on your spending patterns.",
    },
  ];

  const fetchTrustedUsDatas = async () => {
    try {
      const response: IAxiosResponse = await fetchTrustedUs({});
      if (response.data) {
        console.log("edededed ", response.data);

        setBrandLogos(response.data);
      } else {
        errorTost(
          "Failed to fetch",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching turstedus logos", error);
      errorTost("Failed to fetch", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  useEffect(() => {
    fetchTrustedUsDatas();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trusted by 50,000+ users • Bank-level security
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
            Take Control of
            <br />
            <span className="relative inline-block">
              Your Finances
              <svg
                className="absolute -bottom-4 left-0 w-full"
                viewBox="0 0 500 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 Q250,20 500,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
            Track expenses, monitor investments, and get expert guidance—all in
            one powerful platform designed for your financial success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-black dark:border-white rounded-xl font-bold text-lg transition-all hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl transition-all hover:scale-105 border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <stat.icon className="w-8 h-8 mb-3 mx-auto" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-black/30 dark:border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-black/50 dark:bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-black/5 dark:bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-black rounded-3xl transition-all hover:scale-105 border border-black/10 dark:border-white/10 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Brands Section - Only shows when brandLogos has values */}
      {brandLogos.length > 0 && (
        <section className="relative py-16 overflow-hidden bg-black/5 dark:bg-white/5">
          <div className="w-full ">
            <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Trusted by Leading Organizations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join thousands of users from top companies worldwide
              </p>
            </div>

            {/* Scrolling Logos Container - Full Width */}
            <div className="relative ">
              {/* Scrolling Animation Container */}
              <div
                className="flex items-center py-8 animate-[scroll_25s_linear_infinite] hover:[animation-play-state:paused] "
                style={{
                  animation: `scroll ${
                    brandLogos.length === 1 ? "25s" : "20s"
                  } linear infinite`,
                }}
              >
                {/* First set of logos - Repeat multiple times for single image */}
                {[...Array(brandLogos.length === 1 ? 8 : 2)].map(
                  (_, setIndex) =>
                    brandLogos.map((logo, index) => (
                      <div
                        key={`logo-${setIndex}-${index}`}
                        className="flex-shrink-0 mx-6 md:mx-10 hover:scale-110 transition-transform duration-300 "
                      >
                        <img
                          src={logo}
                          alt={`Brand ${index + 1}`}
                          className="h-16 md:h-16 w-auto object-contain"
                        />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* CSS Animation Styles */}
          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              Comprehensive tools and features designed to give you complete
              financial clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group p-8 rounded-3xl transition-all hover:scale-105 border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-4 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-12 md:p-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-black/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 dark:bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Ready to Transform
                <br />
                Your Financial Future?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300 dark:text-gray-700">
                Join thousands who are taking control of their finances with
                expert guidance and powerful tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-10 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-4 border-2 border-white dark:border-black font-bold rounded-xl transition-all hover:scale-105 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white"
                >
                  Learn More
                </Link>
              </div>
              <p className="text-sm mt-6 text-gray-400 dark:text-gray-600">
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Components */}
      <FloatingChatButton onClick={toggleChat} isChatOpen={isChatOpen} />
      <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default LandingPage;
