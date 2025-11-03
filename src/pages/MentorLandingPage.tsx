import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  MessageSquare,
  Info,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { useFetchAllTrustedUsMutation } from "@/services/apis/CommonApis";

function MentorLandingPage() {
  const [brandLogos, setBrandLogos] = useState([]);
  const [fetchTrustedUs] = useFetchAllTrustedUsMutation();
  
  const Title = "Unlock Financial Success with Buxlo Mentors".split(" ");

  const features = [
    {
      icon: Award,
      title: "Add Slots",
      description:
        "Create new mentoring slots with ease. Add one-time sessions or set up recurring slots to make your availability known to students.",
      link: MentorUrl.appointment,
    },
    {
      icon: Clock,
      title: "Manage Slots",
      description:
        "View all your available slots in one place. Easily cancel, delete, or update your schedule to maintain complete control over your availability.",
      link: "/mentor/availability",
    },
    {
      icon: User,
      title: "Profile & Verification",
      description:
        "Build a professional profile showcasing your credentials, certifications, experience, and expertise to attract serious learners.",
      link: MentorUrl.profile,
    },
    {
      icon: MessageSquare,
      title: "Chat Feature",
      description:
        "Connect with your mentees through seamless real-time messaging. Share resources, answer questions, and build stronger mentoring relationships.",
      link: MentorUrl.chat,
    },
    {
      icon: Info,
      title: "About",
      description:
        "Learn more about Buxlo's mission, values, and how we're revolutionizing financial mentoring. Discover our commitment to quality education.",
      link: MentorUrl.about,
    },
    {
      icon: MessageSquare,
      title: "Feedback & Reviews",
      description:
        "View detailed feedback from your mentees. Understand your strengths and areas for improvement with comprehensive reviews.",
      link: MentorUrl.feedBack,
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Mentors", icon: Users },
    { value: "₹5Cr+", label: "Mentoring Earnings", icon: TrendingUp },
    { value: "95%", label: "Mentor Rating", icon: Star },
    { value: "24/7", label: "Platform Support", icon: Award },
  ];

  const benefits = [
    {
      icon: Award,
      title: "Establish Authority",
      description:
        "Build your personal brand as a financial expert and gain recognition in your field.",
    },
    {
      icon: Zap,
      title: "Flexible Schedule",
      description:
        "Work at your own pace. Set your availability and manage sessions according to your convenience.",
    },
    {
      icon: Sparkles,
      title: "Make a Difference",
      description:
        "Transform lives by sharing your knowledge and helping others achieve their financial goals.",
    },
  ];

  const checklist = [
    "Set your own hourly rates",
    "Work completely flexible hours",
    "Access advanced analytics dashboard",
    "Direct payment to your bank account",
    "24/7 dedicated support team",
    "Marketing resources to grow your base",
  ];

  const fetchTrustedUsDatas = async () => {
    try {
      const response: IAxiosResponse = await fetchTrustedUs();
      if (response.data) {
        console.log("Trusted brands data: ", response.data);
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
      console.error("Error fetching trusted us logos", error);
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
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-black dark:to-indigo-950/20" />
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 backdrop-blur-sm">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Join 10,000+ Expert Mentors • High Earning Potential
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            {Title.map((el, i) => (
              <span key={i} className="inline-block">
                {el}{" "}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
            Guide, inspire, and transform lives with your financial expertise on
            Buxlo. Join our network of mentors and make a lasting impact today!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2">
              Become a Mentor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
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
                className="p-6 rounded-2xl transition-all hover:scale-105 border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/20 shadow-sm"
              >
                <stat.icon className="w-8 h-8 mb-3 mx-auto text-blue-600 dark:text-blue-400" />
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
          <div className="w-6 h-10 border-2 border-blue-600 dark:border-blue-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-blue-50 dark:bg-blue-950/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight">
            Why Become a Buxlo Mentor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-black rounded-3xl transition-all hover:scale-105 border border-gray-200 dark:border-white/10 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
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
        <section className="relative py-16 overflow-hidden bg-white dark:bg-black">
          <div className="w-full">
            <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Trusted by Leading Organizations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join mentors from top companies worldwide
              </p>
            </div>

            {/* Scrolling Logos Container - Full Width */}
            <div className="relative">
              {/* Scrolling Animation Container */}
              <div 
                className="flex items-center py-8 animate-[scroll_25s_linear_infinite] hover:[animation-play-state:paused]"
                style={{
                  animation: `scroll ${brandLogos.length === 1 ? '25s' : '20s'} linear infinite`
                }}
              >
                {/* First set of logos - Repeat multiple times for single image */}
                {[...Array(brandLogos.length === 1 ? 8 : 2)].map((_, setIndex) => (
                  brandLogos.map((logo, index) => (
                    <div
                      key={`logo-${setIndex}-${index}`}
                      className="flex-shrink-0 mx-6 md:mx-10 hover:scale-110 transition-transform duration-300"
                    >
                      <img
                        src={logo}
                        alt={`Brand ${index + 1}`}
                        className="h-16 md:h-20 w-auto object-contain"
                      />
                    </div>
                  ))
                ))}
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
              Powerful Tools for Mentors
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              Everything you need to succeed as a financial mentor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group p-8 rounded-3xl transition-all hover:scale-105 border h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer flex flex-col text-left"
              >
                <div className="w-14 h-14 bg-blue-600 dark:bg-blue-500 text-white rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400 flex-grow">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-4 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="relative py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Everything You Get as a Mentor
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We provide all the tools and support you need to build a
                successful mentoring career.
              </p>
              <div className="space-y-4">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-5xl font-black mb-4">₹50K+</div>
                <div className="text-2xl font-bold mb-4">
                  Average Monthly Earnings
                </div>
                <p className="text-blue-100 mb-8">
                  Our top mentors earn even more. Your success is our success.
                </p>
                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                  <div className="text-sm text-blue-100 mb-2">
                    Income Breakdown
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hourly Sessions</span>
                      <span className="font-bold">₹1000-2000/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaged Plans</span>
                      <span className="font-bold">₹5K-50K+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight">
            Loved by Mentors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Financial Advisor",
                text: "Buxlo has transformed how I share my expertise. I've helped 200+ students and earned a sustainable income doing what I love.",
              },
              {
                name: "Priya Nair",
                role: "Investment Coach",
                text: "The platform is incredibly user-friendly. My mentees love the communication tools, and I appreciate the transparent payment system.",
              },
              {
                name: "Amit Patel",
                role: "Tax Consultant",
                text: "Best decision I made. The demand for quality mentoring is huge, and Buxlo connects me with serious learners immediately.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-blue-600 text-blue-600"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-12 md:p-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Ready to Share Your Expertise?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
                Join thousands of expert mentors transforming lives and earning
                a sustainable income on Buxlo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:bg-blue-50">
                  Get Started Today
                </button>
                <button className="px-10 py-4 border-2 border-white font-bold rounded-xl transition-all hover:scale-105 hover:bg-white hover:text-blue-600">
                  Learn More
                </button>
              </div>
              <p className="text-sm mt-6 text-blue-100">
                No setup fees • Start mentoring immediately • Flexible
                withdrawal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "How much can I earn?",
                a: "Our mentors earn between ₹1000-2000 per hour depending on expertise, with top mentors making ₹50K+ monthly.",
              },
              {
                q: "Do I need specific certifications?",
                a: "Not mandatory, but relevant certifications help attract more students. We verify your qualifications during signup.",
              },
              {
                q: "When can I start mentoring?",
                a: "After verification (typically 48 hours), you can immediately start accepting sessions and earning.",
              },
              {
                q: "How are payments handled?",
                a: "Payments are processed directly to your bank account. You get 90% of session fees, we keep 10%.",
              },
              {
                q: "What support do you provide?",
                a: "24/7 customer support, marketing resources, session tools, and a dedicated mentor success coordinator.",
              },
              {
                q: "Can I set my own schedule?",
                a: "Absolutely! You control your availability. Set your hours and mentees book within your timeframe.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
              >
                <h3 className="text-lg font-bold mb-4">{faq.q}</h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MentorLandingPage;