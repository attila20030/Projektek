// Játékállapotok és irányok konstansai
const URES = 0;
const MELLE = 1;
const HAJO = 2;
const TALALAT = 3;
const ELSULLYEDT = 4; 
const FUGGOLOGES = 0;
const VIZSZINTES = 1;

// Koordináta-kezeléshez szükséges globális változók
var sorKoord; 
var oszlopKoord;
var kivalasztottHajo; 
var jatekosSorKoord;
var jatekosOszlopKoord;
var negyzetek = [];

// HTML elemek referenciáinak lekérése
var jatekosTabla = document.getElementById("jatekos_tabla");
var szamitogepTabla = document.getElementById("szamitogep_tabla");
var ujrainditasGomb = document.getElementById("ujrainditas");
var anyahajoGomb = document.getElementById("anyahajo");
var csatahajoGomb = document.getElementById("csatahajo");
var romboloGomb = document.getElementById("rombolo");
var tengeralattjaroGomb = document.getElementById("tengeralattjaro");
var jarorGomb = document.getElementById("jaror");
var forgatasGomb = document.getElementById("forgatas");



// Hajó objektumok alapállapotának definiálása
var anyahajo = {nev: 'anyahajo', hossz: 5, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var csatahajo = {nev: 'csatahajo', hossz: 4, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var rombolo = {nev: 'rombolo', hossz: 3, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var tengeralattjaro = {nev: 'tengeralattjaro', hossz: 3, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var jaror = {nev: 'jaror', hossz: 2, irany: 0, hely: [], talalatok: [], elhelyezve: false};

// Játékos és gép flottájának összeállítása
var j1Hajok = [anyahajo, csatahajo, rombolo, tengeralattjaro, jaror];
var gepHajok = [anyahajo, csatahajo, rombolo, tengeralattjaro, jaror];



// Hajó tényleges rögzítése 
function letrehoz(sor, oszlop, hajo, irany) { 
    sorKoord = sor;
    oszlopKoord = oszlop;
    hajo.irany = irany;
    for (var i = 0; i < hajo.hossz; i++) {
        if (hajo.irany === FUGGOLOGES) {
            gepTabla[sorKoord + i][oszlopKoord] = HAJO;
        } else {
            gepTabla[sorKoord][oszlopKoord + i] = HAJO;
        }
    }
};

// Ellenőrzés a hajó a pályán belül van-e és nem ütközik-e más hajóval
function elhelyezesEllenorzese (sor, oszlop, hajo) { 
    if (hatarokonBelulEllenoriz(sor, oszlop, hajo)) { 
        for (var i = 0; i < hajo.hossz; i++) {
            if (hajo.irany === FUGGOLOGES) {
                if (gepTabla[sor + i][oszlop] === HAJO || gepTabla[sor + i][oszlop] === MELLE || gepTabla[sor + i][oszlop] === ELSULLYEDT) return false;
            } else {
                if (gepTabla[sor][oszlop + i] === HAJO || gepTabla[sor][oszlop + i] === MELLE || gepTabla[sor][oszlop + i] === ELSULLYEDT) return false;
            }
        }
        return true;
    }
    return false;
};





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

        if (!hajo.elhelyezve) {
        for (var i = 0; i < hajo.hossz; i++) {
            if (hajo.irany === FUGGOLOGES) {
                if (sor <= 10 - hajo.hossz) {
                    pozicio[i] = sor + i;
                    ujPozicio = pozicio.map(function(hely) {
                        return 'j' + hely + oszlop;
                    });
                    hajo.elhelyezve = true;
                    document.getElementById(kivalasztottHajo.nev).disabled = true; 
                }
            } else {
                if (oszlop <= 10 - hajo.hossz) {
                    pozicio[i] = oszlop + i;
                    ujPozicio = pozicio.map(function(hely) {
                        return 'j' + sor + hely;
                    });
                    hajo.elhelyezve = true;
                    document.getElementById(kivalasztottHajo.nev).disabled = true; 
                }
            }
        }
    }
    return ujPozicio;


//Kattintás alapú hajóelhelyezés
    function jTablaKezeloH(event) {
    if(!kivalasztottHajo) return;
    jatekosSorKoord = event.target.id.substring(1,2);
    jatekosOszlopKoord = event.target.id.substring(2,3);
    
    // Kiszámolt helyek lekérése
    kivalasztottHajo.hely = hajoLerakasa(kivalasztottHajo, jatekosSorKoord, jatekosOszlopKoord);
    var j1Helyszinek = kivalasztottHajo.hely;

    // Mezők átszínezése
    if(j1Helyszinek.length > 0){
        j1Helyszinek = j1Helyszinek.map(function(hely){
            return '#' + hely;
        });
        var helyIDk = document.querySelectorAll(j1Helyszinek.join(", "));
        for (let i = 0; i < helyIDk.length; i++) {
            helyIDk[i].classList.add("elhelyezve");
        }
        kivalasztottHajo = null; 
    }
}
    
}

//Gép által megadott hajók véletlen elhelyzezése
function gepHajokVeletlenszeruElhelyezese() {

    for (var i = 0; i < gepHajok.length; i++) {

        var nincsElhelyezve = true;

        while (nincsElhelyezve) {

            var veletlenSor =
                Math.floor(10 * Math.random());

            var veletlenOszlop =
                Math.floor(10 * Math.random());

            var veletlenIrany =
                Math.round(Math.random());

            if (
                elhelyezesEllenorzese(
                    veletlenSor,
                    veletlenOszlop,
                    gepHajok[i]
                )
            ) {

                letrehoz(
                    veletlenSor,
                    veletlenOszlop,
                    gepHajok[i],
                    veletlenIrany
                );

                nincsElhelyezve = false;
            }
        }
    }
}

//Annak a helynek az ellenörzése ahol találat ért
function helyEllenorzese(
    tomb,
    e,
    sorK,
    oszlopK
) {

    if (tomb[sorK][oszlopK] === URES) {

        e.target.classList.add("melle");

        tomb[sorK][oszlopK] = MELLE;

    } else if (tomb[sorK][oszlopK] === HAJO) {

        e.target.classList.add("talalat");

        tomb[sorK][oszlopK] = TALALAT;

        j1TalalatSzam++;
    }
}

//Ellenfél táblájának kezelése
gTablaKezelo = function(e) {

    if (
        !(j1Celzott.includes(e.target.id)) &&
        !jatekVege &&
        e.target.id.startsWith("g")
    ) {

        j1Celzott.push(e.target.id);

        sorKoord = e.target.id.substring(1,2);

        oszlopKoord = e.target.id.substring(2,3);

        helyEllenorzese(
            gepTabla,
            e,
            sorKoord,
            oszlopKoord
        );

        setTimeout(function() {

            gepTippelese();

        }, 1000);

        gyozelemEllenorzese();
    }
};