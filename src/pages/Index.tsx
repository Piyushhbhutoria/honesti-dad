import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MessageInbox from "@/components/MessageInbox";
import SEO from "@/components/SEO";
import Footer from "./Footer";

const Index = () => {
  return (
    <>
      <SEO canonical="/" />
      <div className="min-h-screen page-gradient">
        <Header />
        <main>
          <Hero />
          <MessageInbox />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
