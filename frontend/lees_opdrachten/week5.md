JWT wordt vaak gebruikt voor authenticatie en autorisatie omdat je hiermee gebruikers makkelijk en snel kunt identificeren zonder dat je elke keer de database hoeft te checken.
Het is handig voor de memory-opdracht om een speler ingelogd te houden tijdens het spel en past ook goed bij de IWA-opdracht om API-verzoeken te beveiligen.
Voordelen zijn dat JWT’s snel en stateless zijn, maar nadelen zijn dat ze niet versleuteld zijn, gevoelig kunnen zijn voor XSS/CSRF en beperkt zijn in grootte.
Best practices zijn: tokens kort houden, geen gevoelige info opslaan, veilige opslag gebruiken en zorgen dat tokens snel verlopen.
In beide projecten is JWT nuttig, maar in IWA moet je extra goed opletten op veiligheid.