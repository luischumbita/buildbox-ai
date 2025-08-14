import Header from "~/components/Header";
import PageGenerator from "~/components/PageGenerator";

export default function GeneratorPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <PageGenerator />
        </div>
    );
}
