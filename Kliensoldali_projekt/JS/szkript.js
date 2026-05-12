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

function gyozelemEllenorzese() {

    if (j1TalalatSzam >= 17 || gepTalalatSzam >= 17) {

        jatekBefejezese();
    }
}