# Angular Lifecycle Checkliste

## 1. constructor

**Verwenden für:**

- Dependency Injection  
  `constructor(private service: MyService) {}`
- Initialisierung reiner Logikobjekte  
  `this.form = this.fb.group({...});`
- Setzen von Konstanten

**Nicht geeignet für:**

- Zugriff auf DOM-Elemente
- Zugriff auf `@ViewChild`
- Layout- oder UI-basierte Logik
- Aktionen, die eine existierende View voraussetzen

**Merksatz:**  
**constructor = Klassen-Setup, keine View vorhanden.**

---

## 2. ngOnInit

**Verwenden für:**

- Starten von Ladevorgängen  
  `this.facade.ensureLoaded();`
- Subscriptions, die **nicht** auf DOM angewiesen sind
- Initiales Patchen der Form basierend auf Daten
- Verarbeitung von `@Input()`-Werten

**Nicht geeignet für:**

- Fokus setzen
- Arbeiten mit `@ViewChild`
- DOM-Messungen

**Merksatz:**  
**ngOnInit = Daten sind bereit, DOM noch nicht.**

---

## 3. ngAfterViewInit

**Verwenden für:**

- Fokus setzen  
  `this.input.nativeElement.focus();`
- Arbeiten mit `@ViewChild`
- DOM-Messungen (Breite/Höhe etc.)
- Initialisierung von:
  - Charts
  - Maps
  - Canvas
  - IntersectionObserver
  - 3rd-Party-UI-Bibliotheken
  - Editor-Komponenten

**Praktisch:**  
Dies ist der **einzige** Hook, in dem du garantiert auf die fertige DOM-Struktur zugreifen kannst.

**Merksatz:**  
**ngAfterViewInit = DOM fertig, View fertig, alles verfügbar.**

---

## 4. ngOnDestroy

**Verwenden für:**

- Freigeben von Subscriptions  
  `takeUntil(this.destroy$)`
- Entfernen von EventListenern
- Beenden von Timern / Intervallen
- Cleanup für Services / Facades

**Merksatz:**  
**ngOnDestroy = Aufräumen.**

---

# Typische Aufgaben & richtiger Hook

| Aufgabe                              | Richtiger Hook                              |
| ------------------------------------ | ------------------------------------------- |
| FormGroup erstellen                  | constructor                                 |
| Form initial befüllen                | ngOnInit                                    |
| Route auslesen und Facade triggern   | ngOnInit                                    |
| Fokus setzen                         | ngAfterViewInit                             |
| DOM-Elemente auslesen (`@ViewChild`) | ngAfterViewInit                             |
| Charts/Maps initialisieren           | ngAfterViewInit                             |
| Resize Listener starten              | ngAfterViewInit                             |
| UI-basierte Observables abonnieren   | ngOnInit / AfterViewInit (abhängig vom DOM) |
| Cleanup und unsubscribe              | ngOnDestroy                                 |

---

# Einfache Gesamtheuristik

**constructor → Klasse**  
**ngOnInit → Daten**  
**ngAfterViewInit → DOM**  
**ngOnDestroy → Aufräumen**
