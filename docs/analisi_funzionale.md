Analisi Funzionale: Applicazione Kanban (Clone Trello)

Autore: Signor Software
Data: 19 Novembre 2025
Riferimento: Product Requirements Document (PRD) v1.0 (MVP)

1. Introduzione e Scopo del Sistema

Il software in oggetto è una Web Application per la gestione visuale dei progetti.
Lo scopo principale del sistema è permettere agli utenti di atomizzare progetti complessi in unità gestibili (Cards), organizzate in fasi di lavoro (Lists), all'interno di contenitori di progetto dedicati (Boards).

Il comportamento del software emulerà l'esperienza fisica di una lavagna con post-it, digitalizzandola tramite tecnologie web standard (Stack: Node.js / Express / MySQL).

2. Attori e Ruoli

Nel contesto dell'MVP (Minimum Viable Product), identifichiamo due ruoli principali:

Utente Ospite (Guest):

Non autenticato.

Permessi: Può visualizzare esclusivamente le pagine di Login e Registrazione. Qualsiasi tentativo di accesso a URL protetti lo reindirizza al Login.

Utente Registrato (User):

Autenticato tramite credenziali.

Permessi: Accesso completo in lettura e scrittura (CRUD) esclusivamente sulle risorse (Bacheche, Liste, Schede) di sua proprietà o create da lui.

3. Funzionalità Dettagliate e Comportamento

3.1 Modulo Autenticazione e Profilo (Il "Gatekeeper")

Funzione: Gestisce l'accesso sicuro e l'identità dell'utente.

Registrazione:

Input: Email, Password.

Comportamento: Il sistema verifica l'unicità dell'email nel DB MySQL. Se valida, esegue l'hashing della password (sicurezza) e crea il record utente.

Login:

Input: Email, Password.

Comportamento: Verifica le credenziali. In caso di successo, il server (Node.js) emette un Token JWT. Il frontend memorizza questo token e lo allega automaticamente a ogni successiva richiesta API per mantenere la sessione attiva senza richiedere il login continuo.

Logout:

Comportamento: Invalida la sessione locale rimuovendo il token dal client.

3.2 Modulo Bacheca (Board - Il Contenitore)

Funzione: Livello macro di organizzazione (es. "Progetto Sito Web", "Ristrutturazione Casa").

Dashboard Iniziale:

Comportamento: Al login, il sistema esegue una query per recuperare tutte le Board associate all'ID dell'utente e le visualizza come una griglia di tessere cliccabili.

Creazione Board:

Comportamento: L'utente inserisce un titolo. Il sistema crea un nuovo record nel DB e lo associa all'utente. L'interfaccia reindirizza immediatamente l'utente all'interno della nuova bacheca vuota.

Archiviazione (Soft Delete):

Comportamento: L'eliminazione non rimuove fisicamente i dati (per evitare perdite accidentali). Il sistema imposta un flag is_archived = true nel database, nascondendo la bacheca dalla vista principale.

3.3 Modulo Liste (List - Le Colonne)

Funzione: Rappresentano gli stati di avanzamento (es. "Da fare", "In corso", "Fatto").

Creazione Dinamica:

Comportamento: L'utente aggiunge una lista (colonna). Il sistema calcola automaticamente la posizione corretta per posizionarla alla destra delle liste esistenti.

Riordino Liste (Drag-and-Drop Orizzontale):

Comportamento: Quando l'utente trascina una lista, l'interfaccia si aggiorna istantaneamente (Optimistic UI). In background, una chiamata API aggiorna il campo position nel database per rendere la modifica permanente.

3.4 Modulo Schede (Card - L'Unità di Lavoro)

Funzione: L'unità atomica del lavoro. Contiene i dettagli dell'attività.

Creazione Rapida:

Comportamento: Possibilità di aggiungere una card inserendo solo il titolo direttamente dalla vista della colonna, per non interrompere il flusso di pensiero.

Dettaglio Modale:

Comportamento: Cliccando una card, si apre una finestra sovrapposta (Modale/Overlay). L'utente rimane nel contesto della Board ma può leggere/modificare la descrizione estesa.

Spostamento (Drag-and-Drop Verticale e Trasversale):

Logica:

Spostamento intra-lista: Cambia solo la priorità (campo position).

Spostamento inter-lista: Cambia lo stato dell'attività (campo list_id e campo position).

Assegnazione:

Comportamento: Un pulsante "Assegna a me" collega l'ID dell'utente corrente alla Card, rendendo visibile chi se ne sta occupando.

4. Flussi Operativi Critici (Use Case: Spostamento Card)

Uno scenario tipico che definisce la qualità dell'esperienza utente: L'utente sposta una task da "In Corso" a "Completato".

Azione Utente: Clicca e trascina (Drag) la card dalla Lista A alla Lista B e rilascia (Drop).

Frontend (Reazione Immediata):

Il DOM viene manipolato immediatamente via JavaScript per spostare la card visivamente.

L'utente percepisce latenza zero.

Backend (Persistenza):

Il Frontend invia una richiesta asincrona PUT /api/cards/:id/move.

Dati inviati: newListId, newPosition.

Database:

MySQL aggiorna i riferimenti.

Gestione Errori:

Se l'API fallisce (es. server down), il Frontend deve mostrare un errore ("Impossibile salvare le modifiche") e riportare la card alla posizione originale (Rollback visuale).

5. Analisi Tecnica Dati (Schema Logico)

Per garantire il funzionamento descritto, il software si appoggerà sulle seguenti logiche relazionali:

Gerarchia: Utente 1:N Board 1:N Liste 1:N Cards.

Posizionamento: L'uso di indici interi (o floating point) per gestire l'ordine degli elementi è critico per il Drag-and-Drop.

Integrità: La cancellazione di una Lista deve innescare una logica di gestione per le Cards orfane (es. cancellazione a cascata o spostamento in una lista "Archivio").

6. Conclusioni

Il software agirà come un orchestratore di stato. Sebbene l'interfaccia (Frontend) debba sembrare fluida e libera, il Backend (Node.js) imporrà regole rigide per mantenere la coerenza dei dati.
Il successo funzionale dipenderà dalla capacità del sistema di sincronizzare l'azione visiva dell'utente con il record nel database MySQL in meno di 500ms.