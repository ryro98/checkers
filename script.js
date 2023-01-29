let t = [];
let firstmove = false;
let biale = true;
let bpionki = 12;
let cpionki = 12;
let bhetman = 0;
let chetman = 0;
let bicie = false;

function start() {
    document.getElementById("start").disabled = true;
    for (let y = 8; y >= 1; y--) {
        t[y] = [];
        for (let x = 1; x <= 8; x++) {
            t[y][x] = "";
        }
    }
    szachownica();
    postawfigury();
}

function szachownica() {
    let tabela = document.createElement("TABLE");
    for (let y = 8; y >= 1; y--) {
        let tr = document.createElement("TR");
        tabela.appendChild(tr);
        for (let x = 1; x <= 8; x++) {
            let td = document.createElement("TD");
            td.setAttribute("id", "p" + x + y);
            td.setAttribute("ondrop", 'drop(event)');
            td.setAttribute("ondragover", 'allowDrop(event)');
            td.isFree = true;
            tr.appendChild(td);
        }
    }
    document.getElementById("plansza").appendChild(tabela);
    jasneciemne();
}

function jasneciemne() {
    let pola = document.getElementsByTagName("td");
    let jeden = "ciemne";
    let dwa = "jasne";
    for (let p = 0; p < pola.length; p++) {
        if (p % 8 === 0) {
            let new1 = dwa;
            let new2 = jeden;
            jeden = new1;
            dwa = new2;
        }
        if (p % 2 === 0) pola[p].className = jeden;
        else pola[p].className = dwa;
    }
}

function postawfigury() {
    let pola = document.getElementsByTagName("td");
    let nr = 1;
    //czarne
    for (let p = 0; p < 24; p++) {
        if (pola[p].id === "p28" || pola[p].id === "p48" || pola[p].id === "p68" || pola[p].id === "p88" || pola[p].id === "p17" || pola[p].id === "p37" || pola[p].id === "p57" || pola[p].id === "p77" || pola[p].id === "p26" || pola[p].id === "p46" || pola[p].id === "p66" || pola[p].id === "p86") {
            let figura = document.createElement("IMG");
            pola[p].appendChild(figura);
            figura.setAttribute("id", "cpion" + nr);
            figura.setAttribute("src", "./jpg/cskoczek.png");
            figura.parentElement.isFree = false;
            figura.setAttribute("draggable", true);
            figura.setAttribute("ondragstart", 'drag(event)');
            figura.canMove = true;
            nr++;
        }
    }
    //białe
    nr = 1;
    for (let p = 40; p < 64; p++) {
        if (pola[p].id === "p13" || pola[p].id === "p33" || pola[p].id === "p53" || pola[p].id === "p73" || pola[p].id === "p22" || pola[p].id === "p42" || pola[p].id === "p62" || pola[p].id === "p82" || pola[p].id === "p11" || pola[p].id === "p31" || pola[p].id === "p51" || pola[p].id === "p71") {
            let figura = document.createElement("IMG");
            pola[p].appendChild(figura);
            figura.setAttribute("id", "bpion" + nr);
            figura.setAttribute("src", "./jpg/bskoczek.png");
            figura.parentElement.isFree = false;
            figura.setAttribute("draggable", true);
            figura.setAttribute("ondragstart", 'drag(event)');
            figura.canMove = true;
            nr++;
        }
    }
}

function zmiana() {
    if (biale === true) biale = false;
    else biale = true;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    let data = event.dataTransfer.getData("text");
    let oldid = document.getElementById(data).parentElement.id;
    let newid = "";
    if (event.target.id[0] != "p") newid = event.target.parentElement.id;
    else newid = event.target.id;
    let srcwiersz = parseInt(oldid[2]);
    let srckolumna = parseInt(oldid[1]);
    let newwiersz = parseInt(newid[2]);
    let newkolumna = parseInt(newid[1]);
    //teamkill = 0 // nie wolno skakać w miejscu // na innych też nie wolno
    if (newid != oldid && event.target.id[0] != data[0] && document.getElementById(newid).isFree === true && document.getElementById(data).canMove === true) {
        if (firstmove === false) firstmove = true;
        //pionek
        if (data.slice(1,5) === "pion") {
            //biały
            if (data[0] === "b" && biale === true) {
                //góra lewo // góra prawo
                if (((srcwiersz+1 === newwiersz && srckolumna-1 === newkolumna) || (srcwiersz+1 === newwiersz && srckolumna+1 === newkolumna)) && bicie === false) {
                    move(data,event,newid,oldid);
                    //promocja
                    if (newwiersz === 8) {
                        bhetman++;
                        document.getElementById(data).src = "./jpg/bhetman.png";
                        document.getElementById(data).id = 'bhetman' + bhetman;
                    }
                }
                //bicie
                if (srcwiersz+2 === newwiersz) {
                    let sprlewo = parseInt(srckolumna-1);
                    let sprprawo = parseInt(srckolumna+1);
                    let sprgora = parseInt(srcwiersz+1);
                    //góra lewo
                    if (srckolumna-2 === newkolumna && document.getElementById("p" + sprlewo + sprgora).isFree === false && document.getElementById("p" + sprlewo + sprgora).firstElementChild.id[0] != data[0]) {
                        document.getElementById("p" + sprlewo + sprgora).removeChild(document.getElementById("p" + sprlewo + sprgora).firstElementChild);
                        document.getElementById("p" + sprlewo + sprgora).isFree = true;
                        event.target.appendChild(document.getElementById(data));
                        document.getElementById(newid).isFree = false;
                        document.getElementById(oldid).isFree = true;
                        cpionki--;
                        checksolo(document.getElementById(data));
                        //promocja
                        if (newwiersz === 8) {
                            bhetman++;
                            document.getElementById(data).src = "./jpg/bhetman.png";
                            document.getElementById(data).id = 'bhetman' + bhetman;
                        }
                    }
                    //góra prawo
                    if (srckolumna+2 === newkolumna && document.getElementById("p" + sprprawo + sprgora).isFree === false && document.getElementById("p" + sprprawo + sprgora).firstElementChild.id[0] != data[0]) {
                        document.getElementById("p" + sprprawo + sprgora).removeChild(document.getElementById("p" + sprprawo + sprgora).firstElementChild);
                        document.getElementById("p" + sprprawo + sprgora).isFree = true;
                        event.target.appendChild(document.getElementById(data));
                        document.getElementById(newid).isFree = false;
                        document.getElementById(oldid).isFree = true;
                        cpionki--;
                        checksolo(document.getElementById(data));
                        //promocja
                        if (newwiersz === 8) {
                            bhetman++;
                            document.getElementById(data).src = "./jpg/bhetman.png";
                            document.getElementById(data).id = 'bhetman' + bhetman;
                        }
                    }
                }
            }
            //czarny
            if (data[0] === "c" && biale === false) {
                //dół lewo // dół prawo
                if (((srcwiersz-1 === newwiersz && srckolumna-1 === newkolumna) || (srcwiersz-1 === newwiersz && srckolumna+1 === newkolumna)) && bicie === false) {
                    move(data,event,newid,oldid);
                    //promocja
                    if (newwiersz === 1) {
                        chetman++;
                        document.getElementById(data).src = "./jpg/chetman.png";
                        document.getElementById(data).id = 'chetman' + chetman;
                    }
                }
                //bicie
                if (srcwiersz-2 === newwiersz) {
                    let sprlewo = parseInt(srckolumna-1);
                    let sprprawo = parseInt(srckolumna+1);
                    let sprdol = parseInt(srcwiersz-1);
                    //dół lewo
                    if (srckolumna-2 === newkolumna && document.getElementById("p" + sprlewo + sprdol).isFree === false && document.getElementById("p" + sprlewo + sprdol).firstElementChild.id[0] != data[0]) {
                        document.getElementById("p" + sprlewo + sprdol).removeChild(document.getElementById("p" + sprlewo + sprdol).firstElementChild);
                        document.getElementById("p" + sprlewo + sprdol).isFree = true;
                        event.target.appendChild(document.getElementById(data));
                        document.getElementById(newid).isFree = false;
                        document.getElementById(oldid).isFree = true;
                        bpionki--;
                        checksolo(document.getElementById(data));
                        //promocja
                        if (newwiersz === 1) {
                            chetman++;
                            document.getElementById(data).src = "./jpg/chetman.png";
                            document.getElementById(data).id = 'chetman' + chetman;
                        }
                    }
                    //dół prawo
                    if (srckolumna+2 === newkolumna && document.getElementById("p" + sprprawo + sprdol).isFree === false && document.getElementById("p" + sprprawo + sprdol).firstElementChild.id[0] != data[0]) {
                        document.getElementById("p" + sprprawo + sprdol).removeChild(document.getElementById("p" + sprprawo + sprdol).firstElementChild);
                        document.getElementById("p" + sprprawo + sprdol).isFree = true;
                        event.target.appendChild(document.getElementById(data));
                        document.getElementById(newid).isFree = false;
                        document.getElementById(oldid).isFree = true;
                        bpionki--;
                        checksolo(document.getElementById(data));
                        //promocja
                        if (newwiersz === 1) {
                            chetman++;
                            document.getElementById(data).src = "./jpg/chetman.png";
                            document.getElementById(data).id = 'chetman' + chetman;
                        }
                    }
                }
            }
        }
        //hetman
        if (data.slice(1,7) === "hetman") {
            //biały
            if (data[0] === "b" && biale === true) ruchhetman();
            //czarny
            if (data[0] === "c" && biale === false) ruchhetman();
            function ruchhetman() {
                //góra lewo
                if (srcwiersz < newwiersz && srckolumna > newkolumna && newwiersz-srcwiersz === srckolumna-newkolumna) {
                    let y = srcwiersz+1;
                    for (let x = srckolumna-1; x >= newkolumna; x--) {
                        let przelot = document.getElementById("p" + x + y);
                        if (x === newkolumna && y === newwiersz) {
                            let sprx = parseInt(x+1);
                            let spry = parseInt(y-1);
                            if (document.getElementById("p" + sprx + spry).isFree === false) {
                                if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != data[0]) {
                                    document.getElementById("p" + sprx + spry).removeChild(document.getElementById("p" + sprx + spry).firstElementChild);
                                    event.target.appendChild(document.getElementById(data));
                                    document.getElementById(newid).isFree = false;
                                    document.getElementById(oldid).isFree = true;
                                    document.getElementById("p" + sprx + spry).isFree = true;
                                    if (data[0] === "b") cpionki--;
                                    else bpionki--;
                                    checksolo(document.getElementById(data));
                                }
                            } else move(data,event,newid,oldid);
                        }
                        if (przelot.isFree === true) y++;
                        else if (x != newkolumna+1) break;
                        else y++;
                    }
                }
                //góra prawo
                if (srcwiersz < newwiersz && srckolumna < newkolumna && newwiersz-srcwiersz === newkolumna-srckolumna) {
                    let y = srcwiersz+1;
                    for (let x = srckolumna+1; x <= newkolumna; x++) {
                        let przelot = document.getElementById("p" + x + y);
                        if (x === newkolumna && y === newwiersz) {
                            let sprx = parseInt(x-1);
                            let spry = parseInt(y-1);
                            if (document.getElementById("p" + sprx + spry).isFree === false) {
                                if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != data[0]) {
                                    document.getElementById("p" + sprx + spry).removeChild(document.getElementById("p" + sprx + spry).firstElementChild);
                                    event.target.appendChild(document.getElementById(data));
                                    document.getElementById(newid).isFree = false;
                                    document.getElementById(oldid).isFree = true;
                                    document.getElementById("p" + sprx + spry).isFree = true;
                                    if (data[0] === "b") cpionki--;
                                    else bpionki--;
                                    checksolo(document.getElementById(data));
                                }
                            } else move(data,event,newid,oldid);
                        }
                        if (przelot.isFree === true) y++;
                        else if (x != newkolumna+1) break;
                        else y++;
                    }
                }
                //dół lewo
                if (srcwiersz > newwiersz && srckolumna > newkolumna && srcwiersz-newwiersz === srckolumna-newkolumna) {
                    let y = srcwiersz-1;
                    for (let x = srckolumna-1; x >= newkolumna; x--) {
                        let przelot = document.getElementById("p" + x + y);
                        if (x === newkolumna && y === newwiersz) {
                            let sprx = parseInt(x+1);
                            let spry = parseInt(y+1);
                            if (document.getElementById("p" + sprx + spry).isFree === false) {
                                if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != data[0]) {
                                    document.getElementById("p" + sprx + spry).removeChild(document.getElementById("p" + sprx + spry).firstElementChild);
                                    event.target.appendChild(document.getElementById(data));
                                    document.getElementById(newid).isFree = false;
                                    document.getElementById(oldid).isFree = true;
                                    document.getElementById("p" + sprx + spry).isFree = true;
                                    if (data[0] === "b") cpionki--;
                                    else bpionki--;
                                    checksolo(document.getElementById(data));
                                }
                            } else move(data,event,newid,oldid);
                        }
                        if (przelot.isFree === true) y--;
                        else if (x != newkolumna+1) break;
                        else y++;
                    }
                }
                //dół prawo
                if (srcwiersz > newwiersz && srckolumna < newkolumna && srcwiersz-newwiersz === newkolumna-srckolumna) {
                    let y = srcwiersz-1;
                    for (let x = srckolumna+1; x <= newkolumna; x++) {
                        let przelot = document.getElementById("p" + x + y);
                        if (x === newkolumna && y === newwiersz) {
                            let sprx = parseInt(x-1);
                            let spry = parseInt(y+1);
                            if (document.getElementById("p" + sprx + spry).isFree === false) {
                                if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != data[0]) {
                                    document.getElementById("p" + sprx + spry).removeChild(document.getElementById("p" + sprx + spry).firstElementChild);
                                    event.target.appendChild(document.getElementById(data));
                                    document.getElementById(newid).isFree = false;
                                    document.getElementById(oldid).isFree = true;
                                    document.getElementById("p" + sprx + spry).isFree = true;
                                    if (data[0] === "b") cpionki--;
                                    else bpionki--;
                                    checksolo(document.getElementById(data));
                                }
                            } else move(data,event,newid,oldid);
                        }
                        if (przelot.isFree === true) y--;
                        else if (x != newkolumna+1) break;
                        else y++;
                    }
                }
            }
        }
    }
}

function move(data,event,newid,oldid) {
    event.target.appendChild(document.getElementById(data));
    document.getElementById(newid).isFree = false;
    document.getElementById(oldid).isFree = true;
    zmiana();
    skan();
}

function check() {
    skan();
    if (bicie === false) {
        zmiana();
        skan();
    }
}

function checksolo(fighter) {
    fightagain(fighter);
    if (bicie === false) {
        zmiana();
        skan();
    }
}

function skan() {
    let pola = document.getElementsByTagName("td");
    let licznik = 0;
    for (let x = 0; x < pola.length; x++) {
        pola[x].style.opacity = 1;
        if (pola[x].childElementCount != 0) pola[x].firstElementChild.canMove = false;
    }
    for (let x = 0; x < pola.length; x++) {
        let spr = pola[x];
        let kolumna = parseInt(spr.id[1]);
        let wiersz = parseInt(spr.id[2]);
        if (spr.isFree === false) {
            let lewo = parseInt(kolumna-1);
            let lewodwa = parseInt(kolumna-2);
            let prawo = parseInt(kolumna+1);
            let prawodwa = parseInt(kolumna+2);
            let gora = parseInt(wiersz+1);
            let goradwa = parseInt(wiersz+2);
            let dol = parseInt(wiersz-1);
            let doldwa = parseInt(wiersz-2);
            //pionek
            if (spr.firstElementChild.id.slice(1,5) === "pion") {
                //białe
                if (spr.firstElementChild.id[0] === "b" && biale === true) {
                    //wysokość
                    if (wiersz <= 6) {
                        //lewo
                        if (kolumna >= 3) {
                            if (document.getElementById("p" + lewo + gora).isFree === false) {
                                if (document.getElementById("p" + lewo + gora).firstElementChild.id[0] != spr.firstElementChild.id[0]) {
                                    if (document.getElementById("p" + lewodwa + goradwa).isFree === true) {
                                        spr.style.opacity = 0.7;
                                        spr.firstElementChild.canMove = true;
                                        licznik++;
                                    }
                                }
                            }
                        }
                        //prawo
                        if (kolumna <= 6) {
                            if (document.getElementById("p" + prawo + gora).isFree === false) {
                                if (document.getElementById("p" + prawo + gora).firstElementChild.id[0] != spr.firstElementChild.id[0]) {
                                    if (document.getElementById("p" + prawodwa + goradwa).isFree === true) {
                                        spr.style.opacity = 0.7;
                                        spr.firstElementChild.canMove = true;
                                        licznik++;
                                    }
                                }
                            }
                        }
                    }
                }
                //czarne
                if (spr.firstElementChild.id[0] === "c" && biale === false) {
                    //wysokość
                    if (wiersz >= 3) {
                        //lewo
                        if (kolumna >= 3) {
                            if (document.getElementById("p" + lewo + dol).isFree === false) {
                                if (document.getElementById("p" + lewo + dol).firstElementChild.id[0] != spr.firstElementChild.id[0]) {
                                    if (document.getElementById("p" + lewodwa + doldwa).isFree === true) {
                                        spr.style.opacity = 0.7;
                                        spr.firstElementChild.canMove = true;
                                        licznik++;
                                    }
                                }
                            }
                        }
                        //prawo
                        if (kolumna <= 6) {
                            if (document.getElementById("p" + prawo + dol).isFree === false) {
                                if (document.getElementById("p" + prawo + dol).firstElementChild.id[0] != spr.firstElementChild.id[0]) {
                                    if (document.getElementById("p" + prawodwa + doldwa).isFree === true) {
                                        spr.style.opacity = 0.7;
                                        spr.firstElementChild.canMove = true;
                                        licznik++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //hetman
            if (spr.firstElementChild.id.slice(1,7) === "hetman") {
                //góra
                if (wiersz <= 6) {
                    let y = parseInt(wiersz+2);
                    //lewo
                    if (kolumna >= 3) {
                        for (let x = kolumna-2; x > 1; x--) {
                            if (y < 8) {
                                let sprx = parseInt(x+1);
                                let spry = parseInt(y-1);
                                if (document.getElementById("p" + sprx + spry).isFree === false) {
                                    if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                        if (document.getElementById("p" + x + y).isFree === true) {
                                            spr.style.opacity = 0.7;
                                            spr.firstElementChild.canMove = true;
                                            licznik++;
                                        } else y++;
                                    } else break;
                                } else y++;
                            } else break;
                        }
                    }
                    y = parseInt(wiersz+2);
                    //prawo
                    if (kolumna <= 6) {
                        for (let x = kolumna+2; x < 8; x++) {
                            if (y < 8) {
                                let sprx = parseInt(x-1);
                                let spry = parseInt(y-1);
                                if (document.getElementById("p" + sprx + spry).isFree === false) {
                                    if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                        if (document.getElementById("p" + x + y).isFree === true) {
                                            spr.style.opacity = 0.7;
                                            spr.firstElementChild.canMove = true;
                                            licznik++;
                                        } else y++;
                                    } else break;
                                } else y++;
                            } else break;
                        }
                    }
                }
                //dół
                if (wiersz >= 3) {
                    let y = parseInt(wiersz-2);
                    //lewo
                    if (kolumna >= 3) {
                        for (let x = kolumna-2; x > 1; x--) {
                            if (y > 1) {
                                let sprx = parseInt(x+1);
                                let spry = parseInt(y+1);
                                if (document.getElementById("p" + sprx + spry).isFree === false) {
                                    if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                        if (document.getElementById("p" + x + y).isFree === true) {
                                            spr.style.opacity = 0.7;
                                            spr.firstElementChild.canMove = true;
                                            licznik++;
                                        } else y--;
                                    } else break;
                                } else y--;
                            } else break;
                        }
                    }
                    y = parseInt(wiersz-2);
                    //prawo
                    if (kolumna <= 6) {
                        for (let x = kolumna+2; x < 8; x++) {
                            if (y > 1) {
                                let sprx = parseInt(x-1);
                                let spry = parseInt(y+1);
                                if (document.getElementById("p" + sprx + spry).isFree === false) {
                                    if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                        if (document.getElementById("p" + x + y).isFree === true) {
                                            spr.style.opacity = 0.7;
                                            spr.firstElementChild.canMove = true;
                                            licznik++;
                                        } else y--;
                                    } else break;
                                } else y--;
                            } else break;
                        }
                    }
                }
            }
        }
    }
    if (licznik === 0) {
        bicie = false;
        for (let x = 0; x < pola.length; x++) {
            if (pola[x].childElementCount != 0) pola[x].firstElementChild.canMove = true;
        }
    } else bicie = true;
}

function fightagain(fighter) {
    let pola = document.getElementsByTagName("td");
    let licznik = 0;
    for (let x = 0; x < pola.length; x++) {
        pola[x].style.opacity = 1;
        if (pola[x].childElementCount != 0) pola[x].firstElementChild.canMove = false;
    }
    let spr = fighter;
    let kolumna = parseInt(spr.parentElement.id[1]);
    let wiersz = parseInt(spr.parentElement.id[2]);
    if (fighter.id.slice(1,5) === "pion") {
        let lewo = parseInt(kolumna-1);
        let lewodwa = parseInt(kolumna-2);  
        let prawo = parseInt(kolumna+1);
        let prawodwa = parseInt(kolumna+2);
        let gora = parseInt(wiersz+1);
        let goradwa = parseInt(wiersz+2);
        let dol = parseInt(wiersz-1);
        let doldwa = parseInt(wiersz-2);
        //białe
        if (spr.id[0] === "b" && biale === true) {
            //wysokość
            if (wiersz <= 6) {
                //lewo
                if (kolumna >= 3) {
                    if (document.getElementById("p" + lewo + gora).isFree === false) {
                        if (document.getElementById("p" + lewo + gora).firstElementChild.id[0] != spr.id[0]) {
                            if (document.getElementById("p" + lewodwa + goradwa).isFree === true) {
                                spr.parentElement.style.opacity = 0.7;
                                spr.canMove = true;
                                licznik++;
                            }
                        }
                    }
                }
                //prawo
                if (kolumna <= 6) {
                    if (document.getElementById("p" + prawo + gora).isFree === false) {
                        if (document.getElementById("p" + prawo + gora).firstElementChild.id[0] != spr.id[0]) {
                            if (document.getElementById("p" + prawodwa + goradwa).isFree === true) {
                                spr.parentElement.style.opacity = 0.7;
                                spr.canMove = true;
                                licznik++;
                            }
                        }
                    }
                }
            }
        }
        //czarne
        if (spr.id[0] === "c" && biale === false) {
            //wysokość
            if (wiersz >= 3) {
                //lewo
                if (kolumna >= 3) {
                    if (document.getElementById("p" + lewo + dol).isFree === false) {
                        if (document.getElementById("p" + lewo + dol).firstElementChild.id[0] != spr.id[0]) {
                            if (document.getElementById("p" + lewodwa + doldwa).isFree === true) {
                                spr.parentElement.style.opacity = 0.7;
                                spr.canMove = true;
                                licznik++;
                            }
                        }
                    }
                }
                //prawo
                if (kolumna <= 6) {
                    if (document.getElementById("p" + prawo + dol).isFree === false) {
                        if (document.getElementById("p" + prawo + dol).firstElementChild.id[0] != spr.id[0]) {
                            if (document.getElementById("p" + prawodwa + doldwa).isFree === true) {
                                spr.parentElement.style.opacity = 0.7;
                                spr.canMove = true;
                                licznik++;
                            }
                        }
                    }
                }
            }
        }
    }
    if (fighter.id.slice(1,7) === "hetman") {
        //góra
        if (wiersz <= 6) {
            let y = parseInt(wiersz+2);
            //lewo
            if (kolumna >= 3) {
                for (let x = kolumna-2; x > 1; x--) {
                    if (y < 8) {
                        let sprx = parseInt(x+1);
                        let spry = parseInt(y-1);
                        if (document.getElementById("p" + sprx + spry).isFree === false) {
                            if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                if (document.getElementById("p" + x + y).isFree === true) {
                                    spr.style.opacity = 0.7;
                                    spr.firstElementChild.canMove = true;
                                    licznik++;
                                } else y++;
                            } else break;
                        } else y++;
                    } else break;
                }
            }
            y = parseInt(wiersz+2);
            //prawo
            if (kolumna <= 6) {
                for (let x = kolumna+2; x < 8; x++) {
                    if (y < 8) {
                        let sprx = parseInt(x-1);
                        let spry = parseInt(y-1);
                        if (document.getElementById("p" + sprx + spry).isFree === false) {
                            if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                if (document.getElementById("p" + x + y).isFree === true) {
                                    spr.style.opacity = 0.7;
                                    spr.firstElementChild.canMove = true;
                                    licznik++;
                                } else y++;
                            } else break;
                        } else y++;
                    } else break;
                }
            }
        }
        //dół
        if (wiersz >= 3) {
            let y = parseInt(wiersz-2);
            //lewo
            if (kolumna >= 3) {
                for (let x = kolumna-2; x > 1; x--) {
                    if (y > 1) {
                        let sprx = parseInt(x+1);
                        let spry = parseInt(y+1);
                        if (document.getElementById("p" + sprx + spry).isFree === false) {
                            if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                if (document.getElementById("p" + x + y).isFree === true) {
                                    spr.style.opacity = 0.7;
                                    spr.firstElementChild.canMove = true;
                                    licznik++;
                                } else y--;
                            } else break;
                        } else y--;
                    } else break;
                }
            }
            y = parseInt(wiersz-2);
            //prawo
            if (kolumna <= 6) {
                for (let x = kolumna+2; x < 8; x++) {
                    if (y > 1) {
                        let sprx = parseInt(x-1);
                        let spry = parseInt(y+1);
                        if (document.getElementById("p" + sprx + spry).isFree === false) {
                            if (document.getElementById("p" + sprx + spry).firstElementChild.id[0] != spr.id[0]) {
                                if (document.getElementById("p" + x + y).isFree === true) {
                                    spr.style.opacity = 0.7;
                                    spr.firstElementChild.canMove = true;
                                    licznik++;
                                } else y--;
                            } else break;
                        } else y--;
                    } else break;
                }
            }
        }
    }
    if (licznik === 0) {
        bicie = false;
        for (let x = 0; x < pola.length; x++) {
            if (pola[x].childElementCount != 0) pola[x].firstElementChild.canMove = true;
        }
    } else bicie = true;
}