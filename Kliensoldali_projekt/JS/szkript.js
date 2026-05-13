//A tippelések AI oldalról
function gepTippelese() {
    var veletlenSor = Math.floor(10 * Math.random());
    var veletlenOszlop = Math.floor(10 * Math.random());
    var jID = "j" + veletlenSor + veletlenOszlop;

    if (!gepCelzott.includes(jID)) {
        for (let i = 0; i < j1Hajok.length; i++) {
            if (
                j1Hajok[i].hely.includes(jID) &&
                !j1Hajok[i].talalatok.includes(jID)
            ) {
                j1Hajok[i].talalatok.push(jID);
                document.getElementById(jID).classList.remove("elhelyezve");
                document.getElementById(jID).classList.add("talalat");
                gepCelzott.push(jID);
                gepTalalatSzam++;
            } else if (!j1Hajok[i].hely.includes(jID)) {
                document.getElementById(jID).classList.add("melle");
                gepCelzott.push(jID);
            }
        }
    }
}

//Győzelem ellenőrzése
function gyozelemEllenorzese() {

    if (j1TalalatSzam >= 17 || gepTalalatSzam >= 17) {

        jatekBefejezese();
    }
}

//Kör befejezése
function jatekBefejezese() {

    jatekVege = true;

    szamitogepTabla.removeEventListener(
        "click",
        gTablaKezelo
    );

    if (j1TalalatSzam >= 17) {

        vegeSzoveg.textContent =
            "Az ellenség megsemmisült. Előléptetés vár önre.";

    } else {

        vegeSzoveg.textContent =
            "A flottája megsemmisült.";
    }
}


//Újrakezdés
function jatekUjrainditasa() {

    jatekVege = false;

    j1TalalatSzam = 0;
    gepTalalatSzam = 0;

    j1Celzott = [];
    gepCelzott = [];

    vegeSzoveg.textContent = "";

    jatekInicializalasa();
}



//Játékos táblák

function jatektablakLetrehozasa () {
    for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
            // Játékos mező létrehozása
            var jatekosMezo = document.createElement("div");
            jatekosTabla.appendChild(jatekosMezo);
            jatekosMezo.classList.add("negyzet");
            jatekosMezo.id = "j" + i + j; 
            
            // Gép mező létrehozása
            var gepMezo = document.createElement("div");
            szamitogepTabla.appendChild(gepMezo);
            gepMezo.classList.add("negyzet");
            gepMezo.id = "g" + i + j; 
        }
    }
};


//Hajóelhelyezés

function hajoLerakasa(hajo, jatekosSor, jatekosOszlop) { 
    var pozicio = [];
    var ujPozicio = [];
    var sor = parseInt(jatekosSor);
    var oszlop = parseInt(jatekosOszlop);

    
}