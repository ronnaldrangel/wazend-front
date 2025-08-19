import React, { useEffect, useState } from "react";

const bibleVerses = [
  { verse: "Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.", reference: "Juan 3:16" },
  { verse: "El Señor es mi pastor, nada me faltará.", reference: "Salmos 23:1" }, 
  { verse: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" },
  { verse: "Sé fuerte y valiente. No temas ni te acobardes, porque el Señor tu Dios estará contigo dondequiera que vayas.", reference: "Josué 1:9" },
  { verse: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.", reference: "1 Corintios 13:4" },
  { verse: "Confía en el Señor de todo corazón, y no en tu propia inteligencia.", reference: "Proverbios 3:5" },
  { verse: "Clama a mí, y yo te responderé, y te daré a conocer cosas grandes y ocultas que tú no sabes.", reference: "Jeremías 33:3" },
  { verse: "A cualquiera, pues, que me confiese delante de los hombres, yo también le confesaré delante de mi Padre que está en los cielos.", reference: "Mateos 10:32" },
  { verse: "Y conoceréis la verdad, y la verdad os hará libres.", reference: "Juan 8:32" },
  { verse: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.", reference: "Romanos 8:28" },
  { verse: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.", reference: "2 Corintios 5:17" },
  { verse: "Por nada estéis afanosos; antes bien, en todo, mediante oración y súplica con acción de gracias, sean conocidas vuestras peticiones delante de Dios.", reference: "Filipenses 4:6" },
  { verse: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", reference: "Mateo 6:33" },
  { verse: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.", reference: "1 Pedro 5:7" },
  { verse: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.", reference: "Hebreos 11:1" },
  { verse: "Hermanos míos, tened por sumo gozo cuando os halléis en diversas pruebas, sabiendo que la prueba de vuestra fe produce paciencia.", reference: "Santiago 1:2-3" },
  { verse: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.", reference: "2 Timoteo 1:7" },
  { verse: "Si confiesas con tu boca que Jesús es el Señor, y crees en tu corazón que Dios le levantó de los muertos, serás salvo.", reference: "Romanos 10:9" },
  { verse: "He aquí, estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él y cenaré con él, y él conmigo.", reference: "Apocalipsis 3:20" },
  { verse: "¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?", reference: "Romanos 8:31" },
  { verse: "Por lo demás, hermanos míos, fortaleceos en el Señor y en el poder de su fuerza.", reference: "Efesios 6:10" },
  { verse: "Velad, estad firmes en la fe; portaos varonilmente; sed valientes; sed fuertes.", reference: "1 Corintios 16:13" },
  { verse: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios; te fortaleceré y te ayudaré; te sustentaré con mi mano derecha justa.", reference: "Isaías 41:10" },
  { verse: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.", reference: "Isaías 40:31" },
  { verse: "Esforzaos todos vosotros los que esperáis en Jehová, y tome aliento vuestro corazón.", reference: "Salmos 31:24" },
  { verse: "Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?", reference: "Salmos 27:1" },
  { verse: "Por tanto, nosotros también, teniendo en derredor nuestro tan grande nube de testigos, despojémonos de todo peso y del pecado que nos asedia, y corramos con paciencia la carrera que tenemos por delante.", reference: "Hebreos 12:1" }
]
;


const RandomBibleText = () => {
  const [randomVerse, setRandomVerse] = useState(bibleVerses[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setRandomVerse(bibleVerses[randomIndex]);
  }, []);

  return (
    <div className="text-left font-sans text-muted-foreground">
      <p className="text-xs italic">
        "{randomVerse.verse}" - <span className="font-bold">{randomVerse.reference}</span>
      </p>
    </div>
  );
};

export default RandomBibleText;
