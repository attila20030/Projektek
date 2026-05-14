console.log("betoltve");

// Változók deklarálása
var jatekVege = false;
var j1TalalatSzam = 0;
var gepTalalatSzam = 0;
var anyahajo = {nev: 'anyahajo', hossz: 5, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var csatahajo = {nev: 'csatahajo', hossz: 4, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var rombolo = {nev: 'rombolo', hossz: 3, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var tengeralattjaro = {nev: 'tengeralattjaro', hossz: 3, irany: 0, hely: [], talalatok: [], elhelyezve: false};
var jaror = {nev: 'jaror', hossz: 2, irany: 0, hely: [], talalatok: [], elhelyezve: false};

// irany -> 0 = függőleges, 1 = vízszintes
var j1Hajok = [anyahajo, csatahajo, rombolo, tengeralattjaro, jaror];
var gepHajok = [anyahajo, csatahajo, rombolo, tengeralattjaro, jaror];
var j1Celzott = [];
var gepCelzott = [];
var gepTabla = 
[[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]];

const URES = 0;
const MELLE = 1;
const HAJO = 2;
const TALALAT = 3;
const ELSULLYEDT = 4; 
const FUGGOLOGES = 0;
const VIZSZINTES = 1;

var sorKoord; 
var oszlopKoord;
var kivalasztottHajo; 
var jatekosSorKoord;
var jatekosOszlopKoord;
var negyzetek = [];
var gTablaKezelo;
var jTablaKezelo;
var egerLeKezelo;
var egerFolKezelo;

// DOM Hivatkozások 
document.addEventListener("DOMContentLoaded", function() {
    var jatekosTabla = document.getElementById("jatekos_tabla");
    var szamitogepTabla = document.getElementById("szamitogep_tabla");
    var ujrainditasGomb = document.getElementById("ujrainditas");
    var jatekGomb = document.getElementById("jatek");
    var tuzelesGomb = document.getElementById("tuzeles");
    
    var anyahajoGomb = document.getElementById("anyahajo");
    var csatahajoGomb = document.getElementById("csatahajo");
    var romboloGomb = document.getElementById("rombolo");
    var tengeralattjaroGomb = document.getElementById("tengeralattjaro");
    var jarorGomb = document.getElementById("jaror");
    
    var forgatasGomb = document.getElementById("forgatas");
    var bevezeto = document.getElementById("bevezeto");
    var u1Szoveg = document.getElementById("utasitasok1");
    var u2Szoveg = document.getElementById("utasitasok2");
    var vegeSzoveg = document.getElementById("vege");
    var jatekosFlottaSzoveg = document.getElementById("jatekos");
    var ellensegFlottaSzoveg = document.getElementById("ellenseg");
    var fo = document.getElementById("fo");
    var lablec = document.getElementById("lablec");

    // Játéktáblák létrehozása
    function jatektablakLetrehozasa () {
        for (let i = 0; i <= 9; i++) {
            for (let j = 0; j <= 9; j++) {
                var jatekosMezo = document.createElement("div");
                jatekosTabla.appendChild(jatekosMezo);
                jatekosMezo.classList.add("negyzet");
                jatekosMezo.id = "j" + i + j; 
                
                var gepMezo = document.createElement("div");
                szamitogepTabla.appendChild(gepMezo);
                gepMezo.classList.add("negyzet");
                gepMezo.id = "g" + i + j; 
            }
        }
    };

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
    };        
    
    function hajoForgatasa(hajo) {
        if (hajo.irany === FUGGOLOGES) {
            hajo.irany = VIZSZINTES; 
        } else {
            hajo.irany = FUGGOLOGES;
        }
    };
    function hajokElhelyezese() {
        anyahajoGomb.addEventListener("click", function(e) {
            kivalasztottHajo = j1Hajok[0];
        });
        csatahajoGomb.addEventListener("click", function(e) {
            kivalasztottHajo = j1Hajok[1];
        });
        romboloGomb.addEventListener("click", function(e) {
            kivalasztottHajo = j1Hajok[2];
        });
        tengeralattjaroGomb.addEventListener("click", function(e) {
            kivalasztottHajo = j1Hajok[3];
        });
        jarorGomb.addEventListener("click", function(e) {
            kivalasztottHajo = j1Hajok[4];
        });
        
        forgatasGomb.addEventListener("click", function(e) {
            if(kivalasztottHajo) hajoForgatasa(kivalasztottHajo);
        });
        
        jatekosTabla.addEventListener("mouseover", egerFolKezeloH);
        
        function egerFolKezeloH(event) {
            if(!kivalasztottHajo) return;
            jatekosSorKoord = event.target.id.substring(1,2);
            jatekosOszlopKoord = event.target.id.substring(2,3);
            var sor = parseInt(jatekosSorKoord);
            var oszlop = parseInt(jatekosOszlopKoord);
            var pozicio = [];
            var id_k = [];
            
            for (var i = 0; i < kivalasztottHajo.hossz; i++) {
                if (kivalasztottHajo.irany === FUGGOLOGES) {
                    if (sor <= 10 - kivalasztottHajo.hossz) {
                        pozicio[i] = sor + i;
                        id_k = pozicio.map(function(hely) {
                            return '#j' + hely + oszlop;
                        });
                    }
                } else {
                    if (oszlop <= 10 - kivalasztottHajo.hossz) {
                        pozicio[i] = oszlop + i;
                        id_k = pozicio.map(function(hely) {
                            return '#j' + sor + hely;
                        });
                    }
                }
            }
            if(id_k.length > 0) {
                negyzetek = document.querySelectorAll(id_k.join(", "));
                for (let i = 0; i < negyzetek.length; i++) {
                    negyzetek[i].classList.add("hajo");
                }
            }
        };
        
        jatekosTabla.addEventListener("mouseout", egerLeKezeloH);

        function egerLeKezeloH(event) {
            for (let i = 0; i < negyzetek.length; i++) {
                negyzetek[i].classList.remove("hajo");
            }
        };
        
        jatekosTabla.addEventListener("click", jTablaKezeloH); 
        
        function jTablaKezeloH(event) {
            if(!kivalasztottHajo) return;
            jatekosSorKoord = event.target.id.substring(1,2);
            jatekosOszlopKoord = event.target.id.substring(2,3);
            
            kivalasztottHajo.hely = hajoLerakasa(kivalasztottHajo, jatekosSorKoord, jatekosOszlopKoord);
            var j1Helyszinek = kivalasztottHajo.hely;
            if(j1Helyszinek.length > 0){
                j1Helyszinek = j1Helyszinek.map(function(hely){
                    return '#' + hely;
                });
                var helyIDk = document.querySelectorAll(j1Helyszinek.join(", "));
                for (let i = 0; i < helyIDk.length; i++) {
                    helyIDk[i].classList.add("elhelyezve");
                }
                kivalasztottHajo = null; // Lerakás után nullázzuk a kiválasztást
            }
        }
    };    