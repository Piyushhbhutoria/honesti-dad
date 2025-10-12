import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MessageInbox from "@/components/MessageInbox";
import Footer from "./Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50/50 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950">
      <Header />
      <Hero />
      <MessageInbox />
      <Footer />
    </div>
  );
};

export default Index;
