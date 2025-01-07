import Layout from '../../components/layout/dashboard';

const integrationList = [
    { name: 'Shopify', href: '/integrations/shopify', content: 'Conecta tu tienda Shopify para gestionar tus pedidos automáticamente.', icon: 'https://panel.whapi.cloud/img/icons/shopify.svg' },
    { name: 'Make', href: '/integrations/make', content: 'Automatiza flujos de trabajo con Make y ahorra tiempo en tareas repetitivas.', icon: 'https://panel.whapi.cloud/img/icons/make.svg' },
    { name: 'WooCommerce', href: '/integrations/woocommerce', content: 'Integra tu tienda WooCommerce para sincronizar productos y pedidos.', icon: 'https://panel.whapi.cloud/img/icons/woocommerce.svg' },
    { name: 'n8n', href: '/integrations/n8n', content: 'Diseña flujos de integración personalizados con n8n.', icon: 'https://panel.whapi.cloud/img/icons/n8n.svg' },
];

export default function Index() {
    return (
        <Layout title="Integraciones">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrationList.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : '_self'}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center mb-2">
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="h-10 w-10 mr-4"
                            />
                            <h3 className="text-base font-semibold">{item.name}</h3>
                        </div>
                        <hr className="border-t border-gray-100 mb-4" />
                        <p className="text-sm text-gray-600">{item.content}</p>
                    </a>
                ))}
            </div>
        </Layout>
    );
}