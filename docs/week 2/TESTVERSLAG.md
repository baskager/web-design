# Testverslag Marijn
Op Woensdag 25 April heeft Marijn verschillende designs van mij en klasgenoten kunnen testen. Al snel werd duidelijk dat veel verwachtingen die we hadden wat betreft de UX niet klopten.

## Gebruik van de touchpad
Het valt op dat veel dingen waar wij van uit gingen toch niet klopten of anders werkten dan wij hadden verwacht. Wij waren verbaasd dat de touchpad toch vaak wordt gebruikt door Marijn. Omdat zoveel websites de tab functies hebben uitgeschakeld of gesloopt gaat Marijn er niet meer vanuit dat een website ondersteuning biedt voor tabs. Hieruit concludeer ik dat grote raakvlakken toch heel fijn zijn voor mensen die last hebben van spasmes.


## Scrollen
Waar veel mensen (waaronder ik) geen rekening mee hebben gehouden is dat Marijn de spatiebalk gebruikt om te scrollen. Het is dus belangrijk dat we de spatiebalk events niet vervangen of dat we uitgaan van scrollen via touchpad.

## 3d interactie
Het voorbeeld van Servin maakte gebruik van 3D interactie. Marijn had moeite met 3D interactie omdat hier vaak toch twee toetsen voor nodig zijn. Interactie gaat dus liever met een toets in plaats van twee toetsen.

## Navigatie en orientatie pagina's
Bij een aantal ontwerpen was Marijn verward en wist hij bijvoorbeeld niet meer hoe hij terug moest van een pagina. Er is in die gevallen meer duidelijkheid nodig over waar de gebruiker zich in de website bevind en hoe je terug komt naar een vorige pagina of overzicht.

# Test web design 'kager.io'
De onderstaande test is uitgevoerd volgens de stappen in het testplan
### Navigeer naar de "Projects pagina"
Marijn is verward over de 'skip to content' knop bij de navigatie, deze interactie verwachte Marijn niet en hierdoor raakte hij gedisorienteerd.
![Skip to content navigatie](http://www.kager.io/uploads/minor/web-design/accessibility/marijn/skip-to-content.jpg)

Het advies van Marijn is om dit weg te laten gezien de spatiebalk gebruikt wordt om naar beneden te scrollen
### Klik een van de projecten aan
Er is nog een detailpagina voor projecten, dit was verwarrend voor Marijn en werd niet duidelijk aangegeven. Voor de rest vondt Marijn de raakvlakken groot genoeg en werkte het navigeren tussen de projecten.



### Zoek naar een van de projecten
Native Mac OSX zoekbalk heeft een clear knop. Deze is te klein in de grote zoekbalk. Hier had ik geen rekening mee gehouden omdat op linux (Gnome3) input boxes geen clear knop hebben.

![Clear knop search input te klein](http://www.kager.io/uploads/minor/web-design/accessibility/marijn/clear-input.jpg)

Daarnaast sluiten knoppen zoals 'escape' of 'enter' niet de input box. Als er op 'enter' wordt gedrukt dan ververst de pagina. Dit kan verbeterd worden door 'enter' te remappen naar de 'tab' knop, in dat geval springt de focus direct naar het eerste zoekresultaat. De zoekbalk toont ook geen suggesties voor het zoeken, deze interactie werd wel verwacht.
![Pagina reload na enter keypress](http://www.kager.io/uploads/minor/web-design/accessibility/marijn/page-reload-enter.jpg)


