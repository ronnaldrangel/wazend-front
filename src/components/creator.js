import React, { useState, useRef } from 'react';

function ColorForm() {
    const [color, setColor] = useState('');
    const [word, setWord] = useState('');
    const [booleanValue, setBooleanValue] = useState('');
    const [result, setResult] = useState('');
    const [wordInputLabel, setWordInputLabel] = useState('');
    const [showWordInputLabel, setShowWordInputLabel] = useState(false);

    const handleColorChange = (selectedColor) => {
        setColor(selectedColor);
        setShowWordInputLabel(selectedColor !== ''); // Mostrar el segundo formulario solo si se selecciona un color
        switch (selectedColor) {
            case '1':
                setWordInputLabel('Ingresa tu numero de WhatsApp (Recuerda incluir codigo del pais. Ejemplo: 51924079147)');
                break;
            case '2':
                setWordInputLabel('Ingresa usuario de Telegram:');
                break;
            case '3':
                setWordInputLabel('Ingresa url personalizado:');
                break;
            default:
                setWordInputLabel('Error:');
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (color && word && booleanValue !== '') {
            //setResult(`${color} ${word} - ${booleanValue}`);
            setResult(`<link rel="stylesheet" href="https://easybutton.b-cdn.net/easybutton_v1.css">
            <script src="https://easybutton.b-cdn.net/easybutton_v1.js"></script>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    redireccionar(${color}, '${word}', ${booleanValue});
                });
                
            </script>`);
        } else {
            setResult('');
        }
    };

    const isButtonDisabled = !(color && word && booleanValue);


    // Copiar portapapeles
    const textRef = useRef(null);

    const copyToClipboard = () => {
        const textToCopy = textRef.current.innerText;
        navigator.clipboard.writeText(textToCopy);
        alert('Texto copiado al portapapeles');
    };

    return (
        <div>


            <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">



                    <div className="bg-gray-200 p-4 rounded-md shadow-md">
                        {/* Aqui va columna 1 */}

                        <form onSubmit={handleSubmit}>

                            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>1. Elige aplicaciones de mensajería</h2>

                            <div className='py-8'>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Seleccione un app:
                                </label>
                                <select value={color} onChange={(e) => handleColorChange(e.target.value)}>
                                    <option value="">-- Seleccione una app --</option>
                                    <option value="1">WhatsApp</option>
                                    <option value="2">Telegram</option>
                                    <option value="3">Custom Link</option>
                                </select>

                                {showWordInputLabel && ( // Mostrar el segundo formulario solo si showWordInputLabel es verdadero
                                    <>
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                                {wordInputLabel}
                                            </label>

                                            <input
                                                type="text"
                                                value={word}
                                                onChange={(e) => setWord(e.target.value)}
                                                placeholder=""
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>2. Personaliza tu botón</h2>

                            <div className='py-8'>

                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Mostrar Notificación:
                                </label>
                                <select
                                    value={booleanValue}
                                    onChange={(e) => setBooleanValue(e.target.value)}
                                >
                                    <option value="">-- Seleccione --</option>
                                    <option value="true">Si</option>
                                    <option value="false">No</option>
                                </select>

                            </div>

                            <button type="submit" disabled={isButtonDisabled}
                                className={`px-4 py-2 rounded ${isButtonDisabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>Generar</button>

                        </form>

                    </div>


                    <div className="bg-gray-200 p-4 rounded-md shadow-md">
                        {/* Aqui va columna 2 */}

                        <h2 className='text-2xl font-bold tracking-tight text-gray-900'>3. Instala tu botón</h2>
                        {result && (
                            <div className='mt-6'>
                                <div
                                    ref={textRef}
                                    className="p-4 text-lg bg-white rounded-md shadow-md mb-4"
                                >
                                    <p>{result}</p>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                >
                                    Copiar
                                </button>
                            </div>
                        )}

                        <h2 className='text-2xl font-bold tracking-tight text-gray-900 my-8'>Aprende a instalar tu botón</h2>
                        <a href="https://easybutton.pro/whatsapp-en-wordpress/" target="_blank" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white mr-2">WordPress</a>
                        <a href="https://easybutton.pro/whatsapp-en-shopify/" target="_blank" className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white">Shopify</a>

                    </div>


                </div>
            </div>


            {/* Renderizado en pantalla 
            {result && (
                <div className='mt-8'>
                    <p>Resultado form:</p>
                    <h1>{color} {word} {booleanValue}</h1>
                </div>
            )}
            */}


        </div>
    );
}

export default ColorForm;
