import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MessageInbox from "@/components/MessageInbox";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <Header />
      <Hero />
      <MessageInbox />
    </div>
  );
};

export default Index;
