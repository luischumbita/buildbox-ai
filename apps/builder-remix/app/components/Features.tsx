const features = [
    {
        name: 'IA Conversacional',
        description: 'Habla con tu aplicación en lenguaje natural y construye funcionalidades complejas.',
        icon: '🤖',
    },
    {
        name: 'Desarrollo en Tiempo Real',
        description: 'Ve los cambios instantáneamente mientras describes lo que quieres construir.',
        icon: '⚡',
    },
    {
        name: 'Integración de APIs',
        description: 'Conecta fácilmente con servicios externos, bases de datos y herramientas.',
        icon: '🔗',
    },
    {
        name: 'Sin Código',
        description: 'No necesitas conocimientos de programación para crear aplicaciones profesionales.',
        icon: '🚀',
    },
];

export default function Features() {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Todo lo que necesitas para construir
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Builder Bolt combina la potencia de la IA con herramientas de desarrollo modernas.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white text-2xl">
                                        {feature.icon}
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
