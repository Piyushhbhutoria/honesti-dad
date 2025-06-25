
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MessageForm from "@/components/MessageForm";
import MessageInbox from "@/components/MessageInbox";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <MessageForm />
      <MessageInbox />
    </div>
  );
};

export default Index;
