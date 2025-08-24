import Header from "~/components/Header";
import Hero from "~/components/Hero";
import Features from "~/components/Features";

export default function Index() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Hero />
            <Features />
        </div>
    );
}
