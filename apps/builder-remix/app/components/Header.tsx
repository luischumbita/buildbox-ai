export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-indigo-600">Builder Bolt</h1>
                        </div>
                    </div>
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Inicio
                            </a>
                            <a href="/features" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Características
                            </a>
                            <a href="/generator" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Generador IA
                            </a>
                            <a href="/contact" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Contacto
                            </a>
                        </div>
                    </nav>
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-indigo-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
