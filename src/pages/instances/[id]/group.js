import Image from 'next/image';

export default function Index({ groupList, loading }) {
    if (loading) {
        return <div className="text-center py-10">Cargando grupos...</div>;
    }

    if (!groupList || groupList.length === 0) {
        return <div className="text-center py-10">No hay grupos disponibles.</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {groupList.map((item, index) => (
                    <div
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white shadow-md rounded-lg p-6 transition-shadow duration-200"
                    >
                        <div className="flex items-center mb-2">
                            {item.pictureUrl ? (
                                <Image
                                    src={item.pictureUrl}
                                    alt={item.subject}
                                    width={200}
                                    height={100}
                                    className="h-10 w-10 mr-4 object-cover rounded"
                                />
                            ) : (
                                <div className="h-10 w-10 mr-4 bg-gray-300 rounded flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-600">
                                        {item.subject[0]}
                                    </span>
                                </div>
                            )}
                            <h3 className="text-base font-semibold truncate">{item.subject}</h3>
                        </div>
                        <hr className="border-t border-gray-100 mb-4" />
                        <p className="text-sm text-gray-600 line-clamp-3">Creador: {item.owner}</p>
                        {item.desc && <p className="text-sm text-gray-600 line-clamp-3">{item.desc}</p>}
                    </div>
                ))}
            </div>
        </>
    );
}
