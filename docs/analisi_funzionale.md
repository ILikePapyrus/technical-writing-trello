# Analisi Funzionale: Applicazione Kanban (Clone Trello)

> **Dettagli Documento**
> * **Autore:** Signor Software
> * **Data:** 19 Novembre 2025
> * **Riferimento:** Product Requirements Document (PRD) v1.0 (MVP)

## 1. Introduzione e Scopo del Sistema

Il software in oggetto è una **Web Application** per la gestione visuale dei progetti.
Lo scopo principale è permettere agli utenti di atomizzare progetti complessi in unità gestibili (**Cards**), organizzate in fasi di lavoro (**Lists**), all'interno di contenitori di progetto dedicati (**Boards**).



Il comportamento del software emulerà l'esperienza fisica di una lavagna con post-it, digitalizzandola tramite tecnologie web standard (**Stack:** Node.js / Express / MySQL).

---

## 2. Attori e Ruoli

Nel contesto dell'**MVP** (Minimum Viable Product), vengono identificati due ruoli principali con permessi distinti.

| Ruolo | Stato Autenticazione | Permessi e Accesso |
| :--- | :--- | :--- |
| **Utente Ospite (Guest)** | Non autenticato | • Visualizza solo Login/Registrazione.<br>• Reindirizzamento forzato al Login se tenta accesso a URL protetti. |
| **Utente Registrato (User)** | Autenticato | • **Accesso completo (CRUD)** in lettura e scrittura.<br>• Limitato esclusivamente alle risorse (Bacheche, Liste, Schede) di sua proprietà. |

---

## 3. Funzionalità Dettagliate e Comportamento

### 3.1 Modulo Autenticazione e Profilo (Il "Gatekeeper")
*Funzione: Gestisce l'accesso sicuro e l'identità dell'utente.*

* **Registrazione**
    * **Input:** Email, Password.
    * **Comportamento:** Verifica unicità email nel DB MySQL $\rightarrow$ Hashing della password $\rightarrow$ Creazione record utente.
* **Login**
    * **Input:** Email, Password.
    * **Comportamento:** Verifica credenziali. In caso di successo, il server emette un **Token JWT**. Il frontend mantiene la sessione attiva allegando il token alle chiamate API.
* **Logout**
    * **Comportamento:** Invalida la sessione locale rimuovendo il token dal client.

### 3.2 Modulo Bacheca (Board - Il Contenitore)
*Funzione: Livello macro di organizzazione.*

* **Dashboard Iniziale:** Al login, query per recuperare tutte le Board associate all'ID utente, visualizzate come griglia cliccabile.
* **Creazione Board:** L'utente inserisce un titolo. Il sistema crea il record, lo associa all'utente e reindirizza alla nuova bacheca vuota.
* **Archiviazione (Soft Delete):** L'eliminazione non rimuove fisicamente i dati. Viene impostato un flag `is_archived = true` nel DB per nascondere la bacheca senza perdita di dati.

### 3.3 Modulo Liste (List - Le Colonne)
*Funzione: Rappresentano gli stati di avanzamento (es. "Da fare", "In corso").*

* **Creazione Dinamica:** Calcolo automatico della posizione per inserire la nuova lista a destra di quelle esistenti.
* **Riordino (Drag-and-Drop Orizzontale):**
    * **Frontend:** Aggiornamento istantaneo (**Optimistic UI**).
    * **Backend:** Chiamata API in background per aggiornare il campo `position` nel DB.

### 3.4 Modulo Schede (Card - L'Unità di Lavoro)
*Funzione: L'unità atomica del lavoro contenente i dettagli.*

* **Creazione Rapida:** Inserimento del solo titolo direttamente nella colonna per non interrompere il flusso.
* **Dettaglio Modale:** Click sulla card $\rightarrow$ Apertura finestra sovrapposta (Overlay) per modifica descrizione estesa, mantenendo il contesto della Board.
* **Assegnazione:** Pulsante "Assegna a me" per collegare l'ID utente alla Card.
* **Spostamento (Drag-and-Drop):**
    * *Intra-lista:* Cambia la priorità (campo `position`).
    * *Inter-lista:* Cambia lo stato (campo `list_id`) e la priorità.

---

## 4. Flussi Operativi Critici
**Use Case: Spostamento Card ("In Corso" $\rightarrow$ "Completato")**

Questo scenario definisce la qualità della User Experience (UX).

1.  **Azione Utente:** Drag & Drop della card dalla Lista A alla Lista B.
2.  **Frontend (Reazione Immediata):** Manipolazione del DOM via JavaScript. Latenza percepita pari a zero.
3.  **Backend (Persistenza):** Invio asincrono `PUT /api/cards/:id/move` con `newListId` e `newPosition`.
4.  **Database:** MySQL aggiorna i riferimenti.
5.  **Gestione Errori:** Se l'API fallisce, il Frontend mostra un errore e esegue un **Rollback visuale** (riporta la card alla posizione originale).

---

## 5. Analisi Tecnica Dati (Schema Logico)



Per garantire il funzionamento, il sistema si basa su rigide logiche relazionali:

* **Gerarchia Relazionale:**
    $$Utente \xrightarrow{1:N} Board \xrightarrow{1:N} Liste \xrightarrow{1:N} Cards$$
* **Posizionamento:** Utilizzo critico di indici (interi o floating point) per gestire l'ordine visivo nel Drag-and-Drop.
* **Integrità Referenziale:** La cancellazione di una Lista deve gestire le Cards orfane (es. cancellazione a cascata o spostamento in una lista "Archivio").

---

## 6. Conclusioni

Il software agirà come un **orchestratore di stato**. Sebbene l'interfaccia (Frontend) debba sembrare fluida e libera, il Backend (Node.js) imporrà regole rigide per mantenere la coerenza dei dati.

Il successo funzionale dipenderà dalla capacità del sistema di sincronizzare l'azione visiva dell'utente con il record nel database MySQL in meno di **500ms**.