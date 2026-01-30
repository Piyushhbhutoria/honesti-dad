import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MessageInbox from "@/components/MessageInbox";
import Footer from "./Footer";

const Index = () => {
  return (
    <div className="min-h-screen page-gradient">
      <Header />
      <Hero />
      <MessageInbox />
      <Footer />
    </div>
  );
};

export default Index;
