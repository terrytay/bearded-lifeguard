import Link from "next/link";
import { Home, Search, ArrowLeft, Waves, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Waves Background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-100/50 rounded-full animate-pulse"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#FF6633]/10 rounded-full flex items-center justify-center">
              <LifeBuoy className="w-12 h-12 text-[#FF6633] animate-bounce" />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-[#20334F] mb-4 opacity-20">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-3 -mt-8">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-lg mx-auto">
            Oops! It looks like this page has drifted away. Don't worry - our lifeguards 
            are here to help you navigate back to safety.
          </p>
        </div>

        {/* Floating Elements */}
        <div className="relative mb-8">
          <div className="absolute top-0 left-1/4 animate-bounce">
            <Waves className="w-8 h-8 text-blue-300 opacity-60" />
          </div>
          <div className="absolute top-8 right-1/4 animate-pulse">
            <Waves className="w-6 h-6 text-blue-400 opacity-40" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#ff8566] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#20334F] border-2 border-gray-200 rounded-xl font-semibold hover:border-[#FF6633] hover:text-[#FF6633] hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <Search className="w-5 h-5" />
            Explore Services
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4 font-medium">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/booking"
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Book a Lifeguard
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Still can't find what you're looking for?{" "}
            <Link
              href="/contact"
              className="text-[#FF6633] hover:underline font-medium"
            >
              Contact our support team
            </Link>{" "}
            and we'll help you out!
          </p>
        </div>
      </div>
    </div>
  );
}