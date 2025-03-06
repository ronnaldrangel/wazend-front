import { useSession } from 'next-auth/react'; // Importamos el hook de sesión
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiServiceJWT';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"; // Importamos los íconos

const SubsPage = () => {
    const { data: session } = useSession(); // Obtenemos la sesión
    const token = session?.jwt; // Extraemos el token JWT de la sesión

    // Usamos el hook que creamos para obtener los datos de 'orders'
    const { data, error, isLoading } = useStrapiData('users/me?populate=subscriptions', token);

    // Imprimir la data en consola
    console.log('Data:', data); // Aquí imprimimos la data que obtenemos

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    // Accedemos a subscriptions
    const subscriptions = data?.subscriptions || [];

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    return (
        <div className="p-4 overflow-x-auto dark:bg-black bg-white shadow-md rounded-lg dark:text-white dark:border-zinc-700 dark:shadow-black">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Producto(s)</TableHead>
                        <TableHead>Expira</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.length > 0 ? (
                        subscriptions.map((subscription, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{subscription.id_woo}</TableCell>
                                <TableCell>Plan API</TableCell>
                                <TableCell>{subscription.next_payment_date_gmt ? formatFecha(subscription.next_payment_date_gmt) : '-'}</TableCell>
                                <TableCell>USD {subscription.total}/{subscription.billing_period}</TableCell>
                                <TableCell className="flex items-center space-x-2">
                                    {subscription.status_woo === "active" ? (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="w-5 h-5 text-red-500" />
                                    )}
                                    <span className="capitalize">{subscription.status_woo}</span>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No hay datos para mostrar.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default SubsPage;
