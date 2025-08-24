export default function Hero() {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                        <span className="block">Construye aplicaciones</span>
                        <span className="block text-indigo-200">con IA en tiempo real</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Builder Bolt te permite crear aplicaciones web completas usando solo lenguaje natural.
                        Integra IA, bases de datos y APIs sin escribir código.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a
                                href="/demo"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                            >
                                Probar Demo
                            </a>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <a
                                href="/docs"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10"
                            >
                                Ver Documentación
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
