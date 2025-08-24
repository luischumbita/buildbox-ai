import Header from "~/components/Header";

export default function FeaturesPage() {
    const detailedFeatures = [
        {
            title: "IA Conversacional Avanzada",
            description: "Nuestro sistema de IA entiende contexto y puede mantener conversaciones complejas sobre tu proyecto.",
            benefits: ["Comprensión de contexto", "Memoria de conversación", "Sugerencias inteligentes"],
            icon: "🤖"
        },
        {
            title: "Desarrollo en Tiempo Real",
            description: "Ve los cambios instantáneamente mientras describes lo que quieres construir.",
            benefits: ["Live preview", "Hot reload", "Sincronización automática"],
            icon: "⚡"
        },
        {
            title: "Integración de APIs",
            description: "Conecta fácilmente con servicios externos, bases de datos y herramientas populares.",
            benefits: ["REST APIs", "GraphQL", "Webhooks", "OAuth"],
            icon: "🔗"
        },
        {
            title: "Base de Datos Visual",
            description: "Diseña y gestiona tu base de datos usando una interfaz visual intuitiva.",
            benefits: ["Diseño visual", "Migraciones automáticas", "Backup automático"],
            icon: "🗄️"
        },
        {
            title: "Templates Predefinidos",
            description: "Comienza rápido con plantillas para aplicaciones comunes como e-commerce, blogs, y dashboards.",
            benefits: ["Templates profesionales", "Personalización fácil", "Mejores prácticas"],
            icon: "📋"
        },
        {
            title: "Despliegue Automático",
            description: "Despliega tu aplicación en la nube con un solo clic.",
            benefits: ["Vercel", "Netlify", "AWS", "Google Cloud"],
            icon: "🚀"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Características Detalladas
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Descubre todo lo que Builder Bolt puede hacer por ti y tu equipo de desarrollo
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {detailedFeatures.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {feature.description}
                            </p>
                            <ul className="space-y-2">
                                {feature.benefits.map((benefit, benefitIndex) => (
                                    <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Únete a miles de desarrolladores que ya están construyendo con Builder Bolt
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Comenzar Ahora
                    </a>
                </div>
            </div>
        </div>
    );
}
