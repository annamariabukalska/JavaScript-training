/*Inspired by https://magasin.oslo.kommune.no/byplan/oslos-ukjente-perler?fbclid=IwAR3cJAKULzOiOY7BmOiS6ojPITd9vkas2FklvMRwBN5u4691RQ8STWm9agc*/

const steder = [
    {
        navn: "Sirkusteltet Frognerparken",
        tekst: "Teater",
        lng: 10.700877, 
        lat: 59.928318,
        bilde: "https://img.icons8.com/office/2x/park-bench.png"
    },
    {
        navn: "Vigelandsparken",
        tekst: "Skulpturmuseum",
        lng: 10.701371, 
        lat: 59.927168,
        bilde: "https://img.icons8.com/doodle/2x/museum.png"
    },
    {
        navn: "Frognerparken",
        tekst: "Park",
        lng: 10.703452, 
        lat: 59.926603,
        bilde: "https://img.icons8.com/office/2x/park-bench.png"
    },
    {   
        navn: "Caltexløkka",
        tekst: "Fotballbane",
        lng: 10.777982, 
        lat: 59.916434,
        bilde: "https://img.icons8.com/cotton/2x/football-ball.png"
    },
    {
        navn: "Lille Kampen Kafe",
        tekst: "Kaffe",
        lng: 10.781587, 
        lat: 59.914040,
        bilde: "https://img.icons8.com/officel/2x/kawaii-coffee.png"
    },
    {
        navn: "Heimatt Løkka",
        tekst: "Kaffe",
        lng: 10.764030, 
        lat: 59.919157,
        bilde: "https://img.icons8.com/officel/2x/kawaii-coffee.png"
    },
    {
        navn: "Java Oslo",
        tekst: "Kaffe",
        lng: 10.739661, 
        lat: 59.924428,
        bilde: "https://img.icons8.com/officel/2x/kawaii-coffee.png"
    },
    {
        navn: "Vøienvolden gård",
        tekst: "Park - Vøienvolden gård (Maridalsveien 120) ble fredet i 1941 og er et av Oslos eldste og best bevarte gårdsanlegg. Idylliske, rødmalte bygninger fra sent 1700-tall og tidlig 1800-tall er omgitt av skjermende grønne omgivelser på Sagene som gir gårdsanlegget en hyggelig atmosfære. Her holdes kurs, foredrag og arrangementer som bl.a. annet julemarked og bygningsverndagen. (Anbefalt av Fortidsminneforeningen – FMF)",
        lng: 10.754639, 
        lat: 59.934381,
        bilde: "https://img.icons8.com/cotton/2x/farm.png"
    },
    {  
        navn: "Raades hagekafé",
        tekst: "Kaffe",
        lng: 10.755804, 
        lat: 59.934535,
        bilde: "https://img.icons8.com/officel/2x/kawaii-coffee.png"

    },
    {
        navn: "Vøienvolden Park",
        tekst: "Park",
        lng: 10.754840, 
        lat: 59.933836,
        bilde: "https://img.icons8.com/office/2x/park-bench.png"
    },
    {
        navn: "Parkens Grøde",
        tekst: "Park",
        lng: 10.755478, 
        lat: 59.934081,
        bilde: "https://img.icons8.com/office/2x/park-bench.png"
    },
    {
        navn: "Breidablikk – Speiderhuset på Høyenhall",
        tekst: "Bryn KFUK-KFUM ble stiftet i 1896. Speiderhuset i Høyenhallveien 3 er oppført i tømmer i nasjonal, nybarokk stil og stod ferdig i 1927 etter en større innsamlingsaksjon og er fortsatt i bruk som speiderhus. Bygningen er tegnet av arkitekt Resvold. Speiderhuset tilhører bevaringskategorien politikk og organisasjonsarbeid og er et meget godt bevart forsamlingshus med høye kulturhistoriske og arkitektoniske verdier. (Anbefalt av Byantikvaren – BYA).",
        lng: 10.815878, 
        lat: 59.907214,
        bilde: "https://img.icons8.com/cotton/2x/farm.png"
    },
    {       
        navn: "Tveten gård",
        tekst: "Nylig restaurert gårdsanlegg på Tveita som i dag driftes av Kulturetaten, Oslo kommune. Tveten gård, som ligger i Tvetenveien 101, nevnes første gang i skriftlige kilder på 1400-tallet. Dette er Oslos best bevarte gårdstun. Åtte bygninger. Brukes som sosialt møtested for pensjonister og trygdede i alderen 50+, og leies i tillegg ut til veldedighet, organisasjonsliv, minnemarkeringer og faglige anledninger.",
        lng: 10.836902, 
        lat: 59.913067,
        bilde: "https://img.icons8.com/cotton/2x/farm.png"
    },
    {       
        navn: "Synagogen i Calmeyergaten 15",
        tekst: "Eiendommen ble kjøpt i 1916 av Den israelittiske menighet, en utbrytergruppe fra Det mosaiske trossamfunn og ble synagogen for de ortodokse jødene i Oslo. Den består av en frontbygning mot gaten der de ansatte bodde og selve synagogen inne i bakgården. De ansatte måtte bo nær synagogen av religiøse grunner ettersom det var strenge regler for hvor langt man kunne bevege seg på sabbaten. Synagogen var i bruk til formålet 1921-1942. Utenfor gården er det plassert 19 «snublesteiner» til minne om den jødiske deportasjonen. Dette var det største antallet jøder arrestert og deportert fra en enkelt bygning i Norge. I synagogens tidligere lokaler har Jødisk Museum holdt til siden 2008.",
        lng: 10.755270, 
        lat: 59.916408,
        bilde: "https://img.icons8.com/doodle/2x/museum.png"
    },
    {       
        navn: "Klosteret Restaurant",
        tekst: "Restaurant",
        lng: 10.747569, 
        lat: 59.918160,
        bilde: "https://img.icons8.com/ultraviolet/2x/cutlery.png"
    },
    {       
        navn: "Løve Restaurant & Bar",
        tekst: "Restaurant",
        lng: 10.738400, 
        lat: 59.915298,
        bilde: "https://img.icons8.com/ultraviolet/2x/cutlery.png"
    },
    {       
        navn: "Miss Sophie Restaurant",
        tekst: "Restaurant",
        lng: 10.728748, 
        lat: 59.915140,
        bilde: "https://img.icons8.com/ultraviolet/2x/cutlery.png"
    },
    {       
        navn: "Caminito",
        tekst: "Restaurant",
        lng: 10.762056, 
        lat: 59.934167,
        bilde: "https://img.icons8.com/ultraviolet/2x/cutlery.png"
    }
]






