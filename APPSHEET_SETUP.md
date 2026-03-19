# Weinkeller-App mit Google AppSheet (Tabelle `Weine`)

Diese Vorlage setzt deine Anforderungen **1:1** für eine App auf Basis **einer einzigen Tabelle `Weine`** um.

## 1) Datenquelle vorbereiten (Google Sheet)

1. Erstelle ein neues Google Sheet mit dem Tabellennamen: **`Weine`**.
2. Kopiere die Spalten aus `Weine.csv` (Header-Zeile) in Zeile 1.
3. Optional: Kopiere die fünf Beispieldatensätze aus `Weine.csv` in die Zeilen darunter.
4. Achte darauf, dass das Blatt exakt `Weine` heißt.

---

## 2) App erstellen

1. In AppSheet: **Create app** → **Start with your own data**.
2. Wähle das oben erstellte Google Sheet.
3. Stelle sicher, dass die Tabelle als **`Weine`** eingebunden ist.

---

## 3) Spaltenkonfiguration (Data → Columns → `Weine`)

> Alle folgenden Einstellungen in der Tabelle `Weine` hinterlegen.

### Schlüssel / IDs

- **`RowKey`**
  - Type: `Text`
  - Key: `ON`
  - Initial value: `UNIQUEID()`
  - Show?: `OFF`
  - Editable?: `OFF`

- **`ID`**
  - Type: `Text`
  - App formula:
    ```appsheet
    [Name] & "-" & [Weingut] & "-" & TEXT([Jahrgang]) & "-" & [Füllmenge]
    ```
  - Editable?: `OFF`

### Bilder

- **`Foto_vorne`**
  - Type: `Image`
  - Required?: `ON`

- **`Foto_hinten`**
  - Type: `Image`

### Stammdaten

- **`Name`** → Type `Text`, Required `ON`
- **`Weingut`** → Type `Text`, Required `ON`
- **`Weintyp`**
  - Type: `Enum`
  - Values:
    - `Weiss`
    - `Rot`
    - `Rosé`
    - `Orange`
    - `Sekt`
  - Required?: `ON`
- **`Traubensorten`** → Type `Text` (oder `EnumList`, falls später gewünscht)
- **`Jahrgang`** → Type `Number`, Required `ON`, Decimal digits `0`
- **`Trinkreif_von`** → Type `Number`, Decimal digits `0`
- **`Trinkreif_bis`** → Type `Number`, Decimal digits `0`
- **`Land`** → Type `Text`
- **`Region`** → Type `Text`
- **`Appellation`** → Type `Text`
- **`Qualitätsstufe`** → Type `Text`
- **`Alkoholgehalt`** → Type `Decimal`
- **`Füllmenge`** → Type `Text`, Required `ON`
- **`Lagerort`** → Type `Text`

### Bestand / Einkauf / Bewertung

- **`Bestand`**
  - Type: `Number`
  - Initial value: `1`
  - Required?: `ON`

- **`Einkaufspreis_CHF`**
  - Type: `Decimal`
  - Required?: `OFF`

- **`Einkaufsdatum`**
  - Type: `Date`
  - Initial value:
    ```appsheet
    TODAY()
    ```
  - Editable?: `ON` (damit manuell überschreibbar)

- **`Bewertung`**
  - Type: `Number`
  - Min value: `1`
  - Max value: `5`
  - Initial value: leer (oder optional `3`)

- **`Notizen`**
  - Type: `LongText`

### Signatur / Duplikat-Schutz

- **`Wein_Signatur`**
  - Type: `Text`
  - App formula:
    ```appsheet
    [Name] & "-" & [Weingut] & "-" & TEXT([Jahrgang]) & "-" & [Füllmenge]
    ```
  - Valid_If:
    ```appsheet
    NOT(
      IN(
        [_THIS],
        SELECT(
          Weine[Wein_Signatur],
          [RowKey] <> [_THISROW].[RowKey]
        )
      )
    )
    ```
  - Invalid value error:
    `Dieser Wein ist bereits erfasst.`
  - Editable?: `OFF`

---

## 4) Formular „Neuer Wein“

1. UX → Views → **New View**
2. Name: **`Neuer Wein`**
3. For this data: `Weine`
4. View type: `Form`
5. Position: `Primary` oder `Menu` (je nach Präferenz)

### Pflichtfelder prüfen

Sicherstellen, dass in der Spaltendefinition Pflicht gesetzt ist für:
- `Name`
- `Weingut`
- `Weintyp`
- `Jahrgang`
- `Füllmenge`
- `Bestand`
- `Foto_vorne`

Der Duplikat-Check läuft automatisch über `Wein_Signatur` und blockiert Speichern bei Dubletten.

---

## 5) Inventar-Ansicht (Hauptansicht)

1. UX → Views → **New View**
2. Name: **`Inventar`**
3. For this data: `Weine`
4. View type: `Deck` (mobilfreundlich; alternativ `Table`)
5. View options im Deck:
   - Primary header: `[Name]`
   - Secondary header (oder Subtitle):
     ```appsheet
     TEXT([Jahrgang]) & " • " & [Weingut]
     ```
   - Summary:
     ```appsheet
     "Bestand: " & TEXT([Bestand])
     ```
   - Image: `[Foto_vorne]`
6. Search: `ON`
7. Sort: z. B. nach `[Name]` aufsteigend oder `[Jahrgang]` absteigend.

---

## 6) Detail-View pro Wein

1. UX → Views → `Weine_Detail` (oder neue Detail-View anlegen)
2. Data: `Weine`
3. View type: `Detail`
4. In Data → Columns die Spalten **`Bestand`** und **`Bewertung`** als **Quick edit** aktivieren.

---

## 7) Plus/Minus-Aktionen für Bestand

Data → Actions → Tabelle `Weine`

### Aktion 1: `Bestand +1`

- For a record of this table: `Weine`
- Do this: `Data: set the values of some columns in this row`
- Set these columns:
  - `Bestand` =
    ```appsheet
    [Bestand] + 1
    ```
- Display prominently in: `Detail`

### Aktion 2: `Bestand -1`

- For a record of this table: `Weine`
- Do this: `Data: set the values of some columns in this row`
- Set these columns:
  - `Bestand` =
    ```appsheet
    MAX([Bestand] - 1, 0)
    ```
- Display prominently in: `Detail`

Optional: passendes Icon setzen (`add`, `remove`).

---

## 8) Optional: Slice „Top-Weine"

Data → Slices → New Slice

- Name: `Top_Weine`
- Source table: `Weine`
- Row filter condition:
  ```appsheet
  [Bewertung] >= 4
  ```

Danach eine eigene View auf diesem Slice erstellen.

---

## 9) Erweiterbarkeit

Die App bleibt einfach erweiterbar, weil:

- nur **eine** zentrale Tabelle genutzt wird,
- ID + Signatur automatisch erzeugt werden,
- Duplikate auf Signatur-Ebene verhindert werden,
- Formular + Inventar + Detail direkt auf derselben Tabelle basieren.

Wenn du später neue Felder hinzufügst, genügt:
1. Spalte im Google Sheet ergänzen,
2. In AppSheet „Regenerate structure“ bzw. Spalte konfigurieren,
3. Feld in Form/Detail sichtbar machen.
